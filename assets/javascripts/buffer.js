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
        var wkt = format.writeFeature( feature, 
                    {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'});
        removeOtherInteraction();
        var tmp = _.template($("#tmpBuffer").html()),
            dialog = $("#dialog");
        dialog.html(tmp({wkt: wkt}));
        dialog.dialog({
          width: 330,
          height: 160,
          title: "Buffer",
          buttons: {
            Close: {
              click: function () {
                clearAll();
                $("#resultPanel").empty();
              },
              text: 'ยกเลิก'
            },
            Save: {
              text: "ยืนยัน",
              click: function(){
                var form = $("#frmBuffer")[0];
                var buffer = form.buffer.value;
                var wkt = form.wkt.value;
                if (Number(buffer) && Number(buffer) > 0) {
                  var format = new ol.format.WKT();
                  var feature = format.readFeature( wkt, 
                    {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'});
                  var geom = feature.getGeometry();
                  calcBuffer(geom.getCoordinates(), buffer);  
                } else {
                  alert("กรุณาทำรายการให้ถูกต้อง");
                }
              }
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

  var calcBuffer = function(coor, buffer){
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
    var format = new ol.format.WKT();
    var wkt = format.writeFeature( feature, 
                {featureProjection: 'EPSG:3857', dataProjection: 'EPSG:4326'});
    // Create Paginate
    var panel = $("#resultPanel");
    panel.empty();
    var div_paginate = $("<div>");
    div_paginate.empty();
    var tag_center = $("<center>");
    tag_center.append(div_paginate);
    panel.append(tag_center);
    $.ajax({
      url: 'controllers/buffer.php',
      type: 'GET',
      dataType: 'json',
      data: { wkt: wkt, total: 1 },
      success: function(res){
        if (res.n === '0') { 
          alert('ไม่พบข้อมูล');
          return; 
        }
        var total_page = Math.ceil(Number(res.n)/20);
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
          render(wkt, num);
        });
        render(wkt, 1);
      }
    });
    // Expand Resule Panel if collapsed
    if (!$("#collapseResultPanel").hasClass("in")) {
      $("#resultHeader a").click();
    }
  };

  var render = function(wkt, page){
    $.ajax({
      url: 'controllers/buffer.php',
      type: 'GET',
      dataType: 'json',
      data: { wkt: wkt, page: page },
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
              var content = "<br><p><b>ชื่อ-นามสกุล</b>: "+data.profile_name+" "+data.profile_surname+"</p>";
              content += "<p><b>จังหวัด</b>: "+data.province_name+"</p>";
              content += "<p><b>สินค้า</b>: "+data.detail_name+"</p>";
              var area = "";
              if (data.act_rai != 0) {
                area += " "+data.act_rai+" ไร่";
              }
              if (data.act_ngan != 0) {
                area += " "+data.act_ngan+" งาน";
              }
              if (data.act_wa != 0) {
                area += " "+data.act_wa+" วา";
              }
              content += "<p><b>ขนาดพื้นที่</b>: "+area+"</p>";
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