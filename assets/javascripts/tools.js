$(function(){
  $('[data-type="tooltip"]').tooltip();

  $("[number-only]").on('keypress',function(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    var number = this.value.split('.');
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if(number.length>1 && charCode == 46){
      return false;
    }
    return true;
  })

  $("#confirm_reprojection").click(function() {
    var projection_from = $('#projection_from').val();
    var projection_to = $('#projection_to').val();
    var x_from = Number($('#x_from').val());
    var y_from = Number($('#y_from').val());
    
    if (x_from != 0 && y_from != 0) {
      var coordinate = ol.proj.transform([x_from, y_from], projection_from, projection_to)
      $('#x_to').val(coordinate[0]); 
      $('#y_to').val(coordinate[1]); 
    } else {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

  });

  $("#btnSearch").click(function function_name(argument) {
    oaeConfig.mode = "normal";
    var tmp = $("#tmpSearchFarmer").html(),
        dialog = $("#dialog");
        dialog.html("");
    tmp = _.template(tmp);
    dialog.html(tmp());
    setFormSearch();
    dialog.dialog({
      modal: true,
      width: 500,
      height: 500,
      title: "ค้นหา",
      buttons: {
        Save: {
          text: "ค้นหา",
          click: function(){
            $("#frmSearchFarmer").submit();
            dialogDestroy();
          }
        },
        Close: {
          click: function () {
            dialogDestroy();
          },
          text: 'ยกเลิก'
        }
      },
      close: function(){
        dialogDestroy();
      }
    });
  })

  $("#btnExportPNG").click(function(){
    map.once('postcompose', function(event) {
      var canvas = event.context.canvas;
      canvas.setAttribute('crossOrigin', 'Anonymous');
      $("#btnExportPNG")[0].href = canvas.toDataURL();
    });
    map.renderSync();
  });

  $("#btnExportJPEG").click(function(){
    map.once('postcompose', function(event) {
      var canvas = event.context.canvas;
      $("#btnExportJPEG")[0].href = canvas.toDataURL();
    });
    map.renderSync();
  });

  $("#btnExportPDF").click(function(){
    map.once('postcompose', function(event) {
      var dim = [297, 210];
      var resolution = 72;
      var width = Math.round(dim[0] * resolution / 25.4);
      var height = Math.round(dim[1] * resolution / 25.4);
      var size = (map.getSize());
      var extent = map.getView().calculateExtent(size);

      // map.setSize([width, height]);
      // map.getView().fit(extent, (map.getSize()));
      map.renderSync();

      var canvas = event.context.canvas;
      var data = canvas.toDataURL();
      var pdf = new jsPDF('landscape', undefined, 'a4');
      pdf.addImage(data, 'JPEG', 0, 0, dim[0], dim[1]);
      pdf.save('map.pdf');
    });
    map.renderSync();
  });

  $("#btnHomeMap").click(function(){
    oaeConfig.mode = "normal";
    var view = map.getView();
    view.setCenter(oaeConfig.centerThai);
    view.setZoom(oaeConfig.zoomThai);
  });

  $("#btnClearMap").click(function(){
    oaeConfig.mode = "normal";
    deactiveMenuAll();
    $(this).addClass("active");
    removeOtherInteraction();
    clearAll();
    $("#btnPanMap").addClass("active");
    $("#resultPanel").empty();
  });

  $("#btnPanMap").click(function(){
    oaeConfig.mode = "normal";
    deactiveMenuAll();
    $(this).addClass("active");
    removeOtherInteraction();
  });

  $("#btnInfoPOI").click(function(){
    oaeConfig.mode = "infoPOI";
    deactiveMenuAll();
    // $("#btnInfo").addClass("active");
    removeOtherInteraction();
    clearAll();
  });

  $("#btnInfoFarmer").click(function(){
    oaeConfig.mode = "infoFarmer";
    clearAll();
    var layer = getLayerFarmer();
    if (layer) {
      layer.setSource(
        new ol.source.ImageWMS({
          url: oaeConfig.geoserverUrl+"/oae/wms",
          params: {
            "FORMAT": "image/png",
            "LAYERS": "oae:farmer_area",
            "VERSION": "1.1.1",
            STYLES: 'point',
            id_random: getRandomInt(1, 100000000)
          }
        })
      );
    }
    deactiveMenuAll();
    // $("#btnInfo").addClass("active");
    removeOtherInteraction();
  });

  $("#mapToolbar button[data-group=draw]").click(function(){
    oaeConfig.mode = "normal";
    deactiveMenuAll();
    $(this).addClass("active");
    removeOtherInteraction();
    var value = $(this).attr("category");


    var geometryFunction;
    if (value === 'Square') {
      value = 'Circle';
      geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    } else if (value === 'Box') {
      value = 'LineString';
      maxPoints = 2;
      geometryFunction = function(coordinates, geometry) {
        if (!geometry) {
          geometry = new ol.geom.Polygon(null);
        }
        var start = coordinates[0];
        var end = coordinates[1];
        geometry.setCoordinates([
          [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
      };
    }


    var draw = new ol.interaction.Draw({
      features: features,
      type: value,
      geometryFunction: geometryFunction
    });

    draw.on('drawend', function(evt) {
      var feature = evt.feature;

      feature.set("type", "draw");
      feature.set("color", oaeConfig.drawColor);
      return false;
    });
    map.addInteraction(draw);
  });

  $("#btnCofigDraw").click(function(){
    oaeConfig.mode = "normal";
    var tmp = $("#tmpConfigDraw").html(),
        dialog = $("#dialog");
    dialog.html("");
    tmp = _.template(tmp);
    dialog.html(tmp());
    $('#fColorDraw').colorpicker();
    dialog.dialog({
      modal: true,
      width: 300,
      height: 200,
      title: "กำหนด",
      buttons: {
        Save: {
          text: "ยืนยัน",
          click: function(){
            oaeConfig.drawColor = $('#fColorDraw').colorpicker('getValue');
            dialogDestroy();
          }
        },
        Close: {
          click: function () {
            dialogDestroy();
          },
          text: 'ยกเลิก'
        }
      },
      close: function(){
        dialogDestroy();
      }
    });
  });

  $("#btnRemoveFeature").click(function(){
    oaeConfig.mode = "normal";
    deactiveMenuAll();
    $(this).addClass("active");
    removeOtherInteraction();
    var deleteSelect = new ol.interaction.Select({
      condition: ol.events.condition.click
    });
    var collection = deleteSelect.getFeatures();
    collection.on('add', function(){
      var id = collection.a[0].get("id");
      var sl = [];
      _.each(map.getOverlays().a, function(item){
        if (item.get("parent_id") == id) {
          sl.push(item);
        }
      });
      _.each(sl, function(item){
        map.removeOverlay(item);
      });
      features.remove(collection.a[0]);
      var layer_sl = deleteSelect.getFeatures();
      deleteSelect.getFeatures().remove(layer_sl.a[0]);
    });
    map.addInteraction(deleteSelect);
  });

  $("#btnRemoveAllFeature").click(function(){
    oaeConfig.mode = "normal";
    deactiveMenuAll();
    removeOtherInteraction();
    $("#btnPanMap").addClass("active");
    clearAll()
  });

  var renderSearchFarmer = function(page){
    $.ajax({
      url: 'controllers/search_farmer.php',
      type: 'GET',
      dataType: 'json',
      data: $("#frmSearchFarmer").serialize()+"&page="+page,
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

        var feature_ = _.filter(features.getArray(), function(feature){ 
          return feature.get('type') == 'result-search' || feature.get('type') == 'buffer_area'
        });
        _.each(feature_, function(feature) {
          features.remove(feature)
        });

        var format = new ol.format.GeoJSON();
        feature_ = format.readFeatures(geojson,{
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
        _.each(feature_, function(feature) {
          feature.set("type", 'result-search');
          features.push(feature);
        });
        
        _.each(geojson.features, function(f){
          var full_name = f.properties.profile_name+" "+f.properties.profile_surname
          var detail_name = f.properties.detail_name;
          var tr = $("<tr>", {
            click: function(){
              var data = f.properties;
              _.each(features.getArray(), function(item){ 
                item.set('popup', 'hide');
                if (data.id == item.get('id')) {
                  item.set('popup', 'show');
                }
              })
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

  var setFormSearch = function() {
    $.ajax({
      url: "controllers/provinces.php",
      type: 'GET',
      // async: false,
      dataType: "json",
      success: function(res){
        var elem = $("#search_province");
        elem.empty();
        elem.append($("<option>",{
          text: '',
          value: ''
        }));
        _.each(res, function(item){
          elem.append($("<option>",{
            text: item.name,
            value: item.code
          }));
        });
      }
    });
    $.ajax({
      url: "controllers/types.php",
      type: 'GET',
      // async: false,
      dataType: "json",
      success: function(res){
        var elem = $("#search_type");
        elem.empty();
        elem.append($("<option>",{
          text: '',
          value: ''
        }));
        _.each(res, function(item){
          elem.append($("<option>",{
            text: item.name,
            value: item.code
          }));
        });
      }
    });
    $.ajax({
      url: "controllers/years.php",
      type: 'GET',
      // async: false,
      dataType: "json",
      success: function(res){
        var elem = $("#search_year");
        elem.empty();
        elem.append($("<option>",{
          text: '',
          value: ''
        }));
        _.each(res, function(item){
          elem.append($("<option>",{
            text: item.name,
            value: item.code
          }));
        });
      }
    });
    $("#search_type").unbind().change(function(){
      $.ajax({
        url: "controllers/details.php",
        type: 'GET',
        dataType: "json",
        data: {
          type_code: $("#search_type").val()
        },
        success: function(res){
          var elem = $("#search_detail");
          elem.empty();
          elem.append($("<option>",{
            text: '',
            value: ''
          }));
          _.each(res, function(item){
            elem.append($("<option>",{
              text: item.name,
              value: item.name
            }));
          });
        }
      });
    });
    $(".select2-muti").select2();
    $("#frmSearchFarmer").unbind().submit(function(){

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
        data: $("#frmSearchFarmer").serialize()+"&total=1",
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
    });
  } 
});


