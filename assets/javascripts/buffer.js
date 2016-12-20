var buffer = (function(){
  var init = function(){
    btnBuffer();
  };

  var btnBuffer = function() {
    $("#btnBuffer").click(function(){
      clearAll();
      oaeConfig.mode = "buffer";
      deactiveMenuAll();
      $(this).addClass("active");
      removeOtherInteraction();

      var draw = new ol.interaction.Draw({
        features: features,
        type: 'Point'
      });

      draw.on('drawend', function(evt) {
        var feature = evt.feature;
        var format = new ol.format.WKT();
        var wkt = format.writeFeature(feature);
        removeOtherInteraction();
        var tmp = _.template($("#tmpBuffer").html()),
            dialog = $("#dialog");
        dialog.html(tmp({wkt: wkt}));
        
        $.ajax({
          url: "controllers/years.php",
          type: 'GET',
          // async: false,
          dataType: "json",
          success: function(res){
            var elem = $("#year_buffer");
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
            var elem = $("#buffer_type");
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
        $("#buffer_type").unbind().change(function(){
          $.ajax({
            url: "controllers/details.php",
            type: 'GET',
            dataType: "json",
            data: {
              type_code: $("#buffer_type").val()
            },
            success: function(res){
              var elem = $("#buffer_detail");
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
        dialog.dialog({
          width: 400,
          height: 420,
          title: "Buffer",
          buttons: {
            Save: {
              text: "ยืนยัน",
              click: function(){
                var form = $("#frmBuffer")[0];
                var buffer = form.buffer.value;
                var wkt = form.wkt.value;
                if (Number(buffer) && Number(buffer) > 0) {
                  buffer = Number(buffer)*1000
                  var format = new ol.format.WKT();
                  var feature = format.readFeature(wkt);
                  var geom = feature.getGeometry();
                  calcBuffer(geom.getCoordinates(), buffer, $("#frmBuffer").serializeArray());  
                } else {
                  alert("กรุณาทำรายการให้ถูกต้อง");
                }
              }
            },
            Close: {
              click: function () {
                clearAll();
                $("#resultPanel").empty();
              },
              text: 'ยกเลิก'
            }
          },
          position: { my: "right bottom", at: "right bottom", of: window },
          drag: dragDialog,
          close: function(){
            dialogDestroy();
          }
        });
        deactiveMenuAll();
        $("#btnPanMap").addClass("active");
        return false;
      });
      map.addInteraction(draw);
    });

    $("#mapToolbar button[data-group=intersect]").click(function(){
      clearAll();
      oaeConfig.mode = "buffer";
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
        var format = new ol.format.WKT();
        var wkt = format.writeFeature( feature, 
                    {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'});
        removeOtherInteraction();
        feature.set("type", "buffer_area");

        var tmp = _.template($("#tmpIntersect").html()),
            dialog = $("#dialog");
        dialog.html(tmp({wkt: wkt}));


        $.ajax({
          url: "controllers/types.php",
          type: 'GET',
          // async: false,
          dataType: "json",
          success: function(res){
            var elem = $("#intersect_type");
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
        $("#intersect_type").unbind().change(function(){
          $.ajax({
            url: "controllers/details.php",
            type: 'GET',
            dataType: "json",
            data: {
              type_code: $("#intersect_type").val()
            },
            success: function(res){
              var elem = $("#intersect_detail");
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

        $.ajax({
          url: "controllers/years.php",
          type: 'GET',
          // async: false,
          dataType: "json",
          success: function(res){
            var elem = $("#year_intersect");
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

        dialog.dialog({
          width: 400,
          height: 350,
          title: "Intersect",
          buttons: {
            Save: {
              text: "ยืนยัน",
              click: $.proxy(function(){
                paginate(this.feature, $("#frmIntersect").serializeArray());
              }, {feature: feature})
            },
            Close: {
              click: function () {
                clearAll();
                $("#resultPanel").empty();
              },
              text: 'ยกเลิก'
            }
          },
          position: { my: "right bottom", at: "right bottom", of: window },
          drag: dragDialog,
          close: function(){
            dialogDestroy();
          }
        });

        deactiveMenuAll();
        $("#btnPanMap").addClass("active");
        return false;
      });
      map.addInteraction(draw);
    });



  };

  var calcBuffer = function(coor, buffer, data){
    var circle = new ol.geom.Circle(coor, Number(buffer));
    feature_tmp = [];

    _.each(features.getArray(), function(f){
      if (f.get('type') == 'buffer_area') {
        feature_tmp.push(f);
      }
    });
    _.each(feature_tmp, function(f){
      features.remove(f);
    });

    var feature = new ol.Feature({ geometry: circle });
    feature.set("type", "buffer_area");
    features.push(feature);

    var polygon = ol.geom.Polygon.fromCircle(circle, 64);
    feature = new ol.Feature({ geometry: polygon });
    paginate(feature, data);
  };

  var paginate = function(feature, data) {

    var format = new ol.format.WKT();
    var wkt = format.writeFeature( feature, 
                {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'});
    // Create Paginate
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
    data.push({name: 'wkt', value: wkt});
    $.ajax({
      url: 'controllers/buffer.php',
      type: 'POST',
      dataType: 'json',
      data: _.concat(data, {name: 'total', value: 1}),
      success: function(res){
        if (res.n === '0') { 
          var feature_ = _.filter(features.getArray(), function(feature){ 
            return feature.get('type') == 'result-search' 
          });
          _.each(feature_, function(feature) {
            features.remove(feature)
          });
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
          render(data, num);
        });
        render(data, 1);
      }
    });
    // Expand Resule Panel if collapsed
    if (!$("#collapseResultPanel").hasClass("in")) {
      $("#resultHeader a").click();
    }
  }

  var render = function(data, page){
    $.ajax({
      url: 'controllers/buffer.php',
      type: 'POST',
      dataType: 'json',
      data: _.concat(data, {name: 'page', value: page}),
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
          return feature.get('type') == 'result-search' 
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

  return {
    init: init
  }
})();