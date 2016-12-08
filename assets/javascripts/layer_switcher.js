var LayerSwitcher = (function(){
  var init = function(){
    var data = getData();
    $('#layerSwitcher').jstree({
      plugins: ["wholerow", "checkbox", "contextmenu", "search"],
      core: {
        data: data,
        themes: {
          name: 'proton',
          responsive: true
        }
      },
      contextmenu: {
        select_node: false,
        items: treeMenu
      }
    }).bind('changed.jstree', function (evt, data) {
      selected_id = [];
      _.each(data.selected, function(item) {
        attr = data.instance.get_node(item).data;
        if (!$.isEmptyObject(attr)) {
          if (attr.id) {
            selected_id.push(attr.id);
            if (attr.layer && _.indexOf(addLayer.cache, attr.id) == -1) {
              layer = addLayer(attr);
              if (layer) {
                map.addLayer(layer);
                addLayer.cache.push(attr.id);
              }
            }
          }
        }
      });
      remove_layers = [];
      _.each(map.getLayers().getArray(), function(item) {
        if( _.indexOf( selected_id, item.get("id") ) == -1  && 
            item.get("mapType") != "baseLayer" ) {
          remove_layers.push(item);
        }
      });
      _.each(remove_layers, function(item) {
        map.removeLayer(item);
        idx = _.indexOf(addLayer.cache, item.get("id"));
        if (idx != -1) {
          addLayer.cache.remove(idx);
        }
      });
      renderLayerSortable();
    }).on('loaded.jstree', function() {
      $("#layerSwitcher").jstree("open_all");
    });

    var to = false;
    $('#searchLayerSwitcher').keyup(function () {
      if(to) { clearTimeout(to); }
      to = setTimeout(function () {
        var v = $('#searchLayerSwitcher').val();
        $('#layerSwitcher').jstree(true).search(v);
      }, 250);
    });
  };

  var treeMenu = function(node){
    if (role == "guest") {
      return false;
    }
    var items = {},
        data = node.data;
    if (data.add_able) {
      items["create"] = {
        label: 'เพิ่มชั้นข้อมูลแผนที่',
        action: newLayer
      };
    }

    if (data.edit_able) {
      items["edit"] = {
        label: 'แก้ไขชั้นข้อมูลแผนที่',
        action: editLayer
      };
    }

    if (data.delete_able) {
      items["delete"] = {
        label: 'ลบชั้นแผ่นที่',
        action: function(data){
          var inst = $.jstree.reference(data.reference),
              obj = inst.get_node(data.reference);
          $.ajax({
            type: "POST",
            url: "controllers/delete_layer.php",
            dataType: 'json',
            data: {id: obj.id},
            success: function(data){
              if (data.success) {
                treeRefresh();
                alert("ลบชั้นข้อมูลเสร็จเรียบร้อย")
                dialogDestroy();
              } else {
                alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
              }
            }
          });
        }
      };
    }
    return items;
  };

  var newLayer = function(data){
    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference),
        tmp = _.template($("#tmpNewLayer").html()),
        dialog = $("#dialog");

    dialog.html(tmp({
      id: '',
      parent_id: obj.id,
      name: '',
      url: '',
      opacity: 1,
      visible: false,
      category: 'folder',
    }));
    dialog.dialog({
      modal: true,
      width: 600,
      height: 500,
      title: "เพิ่มชั้นข้อมูล",
      buttons: {
        Close: {
          click: function () {
            dialogDestroy();
          },
          text: 'ยกเลิก'
        },
        Save: {
          text: "บันทึก",
          click: function(){
            createLayer();
          }
        }
      },
      close: function(){
        dialogDestroy();
      }
    });
  };

  var editLayer = function(data){
    var inst = $.jstree.reference(data.reference),
        obj = inst.get_node(data.reference),
        tmp = _.template($("#tmpNewLayer").html()),
        dialog = $("#dialog");
    dialog.html(tmp({
      id: obj.id,
      parent_id: obj.data.parent_id,
      name: obj.data.name,
      url: obj.data.url,
      opacity: obj.data.opacity,
      visible: obj.data.visible,
      category: obj.data.category,
    }));
    dialog.dialog({
      modal: true,
      width: 600,
      height: 500,
      title: "แก้ไขชั้นข้อมูล",
      buttons: {
        Close: {
          click: function () {
            dialogDestroy();
          },
          text: 'ยกเลิก'
        },
        Save: {
          text: "บันทึก",
          click: function(){
            updateLayer();
          }
        }
      },
      close: function(){
        dialogDestroy();
      }
    });
  };

  var addLayer =  function(attr) {
    var layer;
    if (attr.category == "tile") {
      layer = new ol.layer.Tile({
        source: new ol.source.OSM({
          url: attr.url,
          crossOrigin: 'Anonymous'
        }),
        opacity: 1
      });
    }
    if (attr.category == "tile_wms") {
      layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
          url: attr.url,
          params: {
            tiled: true
          },
          crossOrigin: 'Anonymous'
        })
      })
    }

    if (attr.category == "wms") {
      layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: attr.url,
          params: {},
          crossOrigin: 'Anonymous'
        })
      })
    }
    if (attr.category == "kml") {
      layer = new ol.layer.Vector({
        source: new ol.source.Vector({
          url: attr.url,
          format: new ol.format.KML(),
          crossOrigin: 'Anonymous'
        })
      });
    }
    if (attr.category == "poi") {
      layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: oaeConfig.geoserverUrl+"/oae/wms",
          params: {
            tiled: true,
            "FORMAT": "image/png",
            "LAYERS": "oae:poi",
            "VERSION": "1.1.1"
          },
          crossOrigin: 'Anonymous'
        })
      })
    }
    if (attr.category == "farmer") {
      layer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: oaeConfig.geoserverUrl+"/oae/wms",
          params: {
            "FORMAT": "image/png",
            "LAYERS": "oae:farmer_area",
            "VERSION": "1.1.1",
            STYLES: oaeConfig.mode == "infoFarmer" ? 'point' : '',
          },
          crossOrigin: 'Anonymous'
        })
      })
    }    
    if (layer) {
      layer.set("id", attr.id);
      layer.set("name", attr.name);
      layer.set("category", attr.category);
      layer.set("opacity", attr.opacity);
      layer.set("url", attr.url)
    }
    return layer;
  };
  addLayer.cache = [];

  var default_validate = {
    errorElement: "em",
    errorPlacement: function ( error, element ) {
      // Add the `help-block` class to the error element
      error.addClass( "help-block" );

      // Add `has-feedback` class to the parent div.form-group
      // in order to add icons to inputs
      element.parents( ".col-sm-5" ).addClass( "has-feedback" );

      if ( element.prop( "type" ) === "checkbox" ) {
        error.insertAfter( element.parent( "label" ) );
      } else {
        error.insertAfter( element );
      }

      // Add the span element, if doesn't exists, and apply the icon classes to it.
      if ( !element.next( "span" )[ 0 ] ) {
        $( "<span class='glyphicon glyphicon-remove form-control-feedback'></span>" ).insertAfter( element );
      }
    },
    success: function ( label, element ) {
      // Add the span element, if doesn't exists, and apply the icon classes to it.
      if ( !$( element ).next( "span" )[ 0 ] ) {
        $( "<span class='glyphicon glyphicon-ok form-control-feedback'></span>" ).insertAfter( $( element ) );
      }
    },
    highlight: function ( element, errorClass, validClass ) {
      $( element ).parents( ".col-sm-5" ).addClass( "has-error" ).removeClass( "has-success" );
      $( element ).next( "span" ).addClass( "glyphicon-remove" ).removeClass( "glyphicon-ok" );
    },
    unhighlight: function ( element, errorClass, validClass ) {
      $( element ).parents( ".col-sm-5" ).addClass( "has-success" ).removeClass( "has-error" );
      $( element ).next( "span" ).addClass( "glyphicon-ok" ).removeClass( "glyphicon-remove" );
    }
  };

  var createLayer = function () {

    var category = $("#layer_category").val();
    var form = $("#frmNewLayer");
    var validator = form.validate();
    validator.destroy();
    var options;
    if (category == "folder") {
      options = {
        rules: { 
          "layer[name]": "required"
        }
      };
    } else if (category == "kml" || category == 'shp') {
      options = {
        rules: { 
          "layer[name]": "required",
          "layer_url": "required",
        }
      };
    } else {
      options = {
        rules: { 
          "layer[name]": "required",
          "layer[url]": "required",
        }
      };
    }

    _.merge(options, default_validate);
    validator = form.validate(options)
    form.valid();
    if (!validator.valid()) {
      return false;    
    }
    var form = $("#frmNewLayer");
    var formData = new FormData(form[0]);
    url = 'controllers/create_layer.php';
    if (category == 'shp') {
      url = 'controllers/import_shp.php';
    }
    $.ajax({
      type: "POST",
      url: url,
      dataType: 'json',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data){
        if (data.success) {
          treeRefresh();
          alert("เพิ่มชั้นข้อมูลเสร็จเรียบร้อย")
          dialogDestroy();
        } else {
          alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
        }
      }
    });
  };

  var updateLayer = function () {

    var category = $("#layer_category").val();
    var form = $("#frmNewLayer");
    var validator = form.validate();
    validator.destroy();
    var options;
    if (category == "folder") {
      options = {
        rules: { 
          "layer[name]": "required"
        }
      };
    } else if (category == "kml") {
      options = {
        rules: { 
          "layer[name]": "required",
          "layer_url": "required",
        }
      };
    } else {
      options = {
        rules: { 
          "layer[name]": "required",
          "layer[url]": "required",
        }
      };
    }

    _.merge(options, default_validate);
    validator = form.validate(options)
    form.valid();
    if (!validator.valid()) {
      return false;    
    }
    var form = $("#frmNewLayer");
    var formData = new FormData(form[0]);
    $.ajax({
      type: "POST",
      url: "controllers/update_layer.php",
      dataType: 'json',
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      success: function(data){
        if (data.success) {
          treeRefresh();
          alert("แก้ไขชั้นข้อมูลเสร็จเรียบร้อย")
          dialogDestroy();
        } else {
          alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
        }
      }
    });
  };

  var treeRefresh = function(){
    var ref = $.jstree.reference("#layerSwitcher");
    ref.settings.core.data = getData();
    ref.refresh(false,false);
  };

  var getData = function(){
    var json = [];
    $.ajax({
      url:  "controllers/layer_json.php",
      dataType: "json",
      type: "get",
      async: false,
      success: function(data) {
        json = data;
      },
      error: function (xhr, status, e) {
        console.log('erroe  '+e );
      }
    });
    return json;
  };

  var renderLayerSortable = function(){
    $("#layerSortable").html("");
    var layers = map.getLayers().getArray();

    layers.reverse();
    _.each(layers, function(layer){
      if (layer.get("mapType") != "baseLayer") {
        var tmp = $("#tmpLayerSort").html();
        if(layer.get('category') == "farmer") {
          tmp = $("#tmpLayerSortFarmer").html();
        }
        tmp = _.template(tmp);
        tmp = tmp({
          title: layer.get("name"),
          id: layer.get("id"),
          opacity: layer.get("opacity")
        });
        $("#layerSortable").append(tmp);
        // numberField();
        configtmpLayerSort(layer);
      }
    });
    layers.reverse();
  };

  var configtmpLayerSort = function(layer) {
    $(".select2-muti").select2();

    $("#opacity_"+layer.get("id")).unbind().change(function(){
      layer.setOpacity( Number( $(this).val() ) )
    });

    $("#frmSearchFarmerArea").unbind().submit(function(){
      var panel = $("#resultPanel");
      panel.empty();
      var div_paginate = $("<div>");
      div_paginate.empty();
      var tag_center = $("<center>");
      var span_total = $("<span>", {
        style: 'color: #acacac;'
      });
      tag_center.append(div_paginate);
      tag_center.append(span_total);
      panel.append(tag_center);
      $.ajax({
        url: "controllers/search_farmer.php",
        type: "GET",
        dataType: "json",
        data: $("#frmSearchFarmerArea").serialize()+"&total=1",
        success: function(res){
          if (res.n === '0') { 
            alert('ไม่พบข้อมูล');
            return; 
          }
          var total_page = Math.ceil(Number(res.n)/20);
          span_total.html("ทั้งหมด "+res.n+" รายการ")
          div_paginate.bootpag({
            total: total_page,
            maxVisible: 5,
            page: 1,
            leaps: true,
            wrapClass: 'pagination',
            activeClass: 'active',
            disabledClass: 'disabled',
            nextClass: 'next',
            prevClass: 'prev',
            lastClass: 'last',
            firstClass: 'first'
          }).on("page", function(event, num){
            renderSearchFarmer(num);
          });
          renderSearchFarmer(1);
          if (!$("#collapseResultPanel").hasClass("in")) {
            $("#resultHeader a").click();
          }
        }
      });
      return false;
    })
  };

  var renderSearchFarmer = function(page){
    $.ajax({
      url: 'controllers/search_farmer.php',
      type: 'GET',
      dataType: 'json',
      data: $("#frmSearchFarmerArea").serialize()+"&page="+page,
      success: function(res){
        $("#resultPanel table").remove();
        popup.hide();
        var panel = $("#resultPanel");
        var tb = $("<table>", {
          class: 'table table-bordered table-hover table-striped'
        });
        panel.append(tb);
        tb.append("<thead><tr><th>ชื่อ</th><th>สินค้า</th></tr></thead>");
        var tbody = $("<tbody>");
        tb.append(tbody);  
        var geojson = JSON.parse(res.fc);
        _.each(geojson.features, function(f){
          var full_name = f.properties.profile_name+" "+f.properties.profile_surname
          var detail_name = f.properties.detail_name;
          var tr = $("<tr>", {
            click: function(){
             var data = f.properties;
              var content = contentPopupFarmer(data);
              popup.show(ol.proj.transform(f.geometry.coordinates, 'EPSG:4326', 'EPSG:3857'), content);
            }
          });
          tr.append("<td>"+full_name+"</td><td>"+detail_name+"</td>");
          tbody.append(tr);
        });   
      }
    });

  };  

  return {
    init: init
  };
})();