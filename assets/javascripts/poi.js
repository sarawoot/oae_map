var base64ToArrayBuffer = function(base64) {
  base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
  var binaryString = atob(base64);
  var len = binaryString.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
var poi = (function(){
  var draw, modify;
  var init = function(){
    $("#btnAddPOI").click(function(){
      oaeConfig.mode = "addPOI";
      deactiveMenuAll();
      removeOtherInteraction();
      clearAll();
      $(this).addClass("active");
      $("#btnPOI").addClass("active");
      draw = new ol.interaction.Draw({
        features: features,
        type: "Point"
      });

      draw.on('drawend', function(evt) {
        poi.feature = evt.feature;
        features.clear();        
        $("#btnConfirmPOI").show();
        return false;
      });
      map.addInteraction(draw);

      modify = new ol.interaction.Modify({
        features: features,
        style: overlayStyle
      });
      map.addInteraction(modify);
    });


    $("#btnAddPOIPhoto").click(function(){
      oaeConfig.mode = "addPOI";
      deactiveMenuAll();
      removeOtherInteraction();
      clearAll();
      $(this).addClass("active");
      $("#btnPOI").addClass("active");
      photoPOI();
    });

    $("#btnEditPOI").click(function(){
      oaeConfig.mode = "editPOI";
      deactiveMenuAll();
      removeOtherInteraction();
      clearAll();
      $(this).addClass("active");
      modify = new ol.interaction.Modify({
        features: features,
        style: overlayStyle
      });
      map.addInteraction(modify);
    });

    $("#btnConfirmPOI").click(function(){
      if (oaeConfig.mode == "addPOI") {addPOI();}
      if (oaeConfig.mode == "editPOI") {editPOI();}
    });    
  };

  var closDialog = function(){
    dialogDestroy();
    deactiveMenuAll();
    $("#btnPanMap").click();
  };

  var addPOI = function(){
    var feature_tmp = poi.feature.clone();
    feature_tmp.getGeometry().transform("EPSG:3857", "EPSG:4326")
    var format = new ol.format.WKT();
    var wkt = format.writeFeature(feature_tmp);
    wkt = "SRID=4326;"+wkt
    var tmp = _.template($("#tmpPOI").html()),
        dialog = $("#dialog");
    dialog.html(tmp({id: "", name: "", link: "", geom: wkt}));
    dialog.dialog({
      modal: true,
      width: 600,
      height: 500,
      title: "เพิ่ม POI",
      buttons: {
        Close: {
          text: 'ยกเลิก',
          click: function () {
            dialogDestroy();
          }
        },
        Save: {
          text: "บันทึก",
          click: function(){
            var form = $("#formPOI");
            var formData = new FormData(form[0]);
            $.ajax({
              type: "POST",
              url: "controllers/create_poi.php",
              dataType: 'json',
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              success: function(data){
                if (data.success) {
                  var layerPOI = getLayerPOI();
                  if (layerPOI) {
                    layerPOI.setSource(new ol.source.ImageWMS({
                      url: oaeConfig.geoserverUrl+"/oae/wms",
                      params: {
                        "FORMAT": "image/png",
                        "LAYERS": "oae:poi",
                        "VERSION": "1.1.1",
                        id_random: getRandomInt(1, 100000000)
                      },
                      // crossOrigin: 'Anonymous'
                    }));
                  }
                  
                  alert("เพิ่ม POI เสร็จเรียบร้อย");
                  clearAll();
                  closDialog();
                  removeOtherInteraction();
                } else {
                  alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
                }
              }
            });
          }
        }
      },
      close: function(){
        dialogDestroy();
      }
    });    
  };

  var editPOI = function(){
    var feature_tmp = poi.feature;
    feature_tmp.getGeometry().transform("EPSG:3857", "EPSG:4326")
    var format = new ol.format.WKT();
    var wkt = format.writeFeature(feature_tmp);
    wkt = "SRID=4326;"+wkt
    var tmp = _.template($("#tmpPOI").html()),
        dialog = $("#dialog");
    dialog.html(tmp({
      id: feature_tmp.getId().replace("poi.", ""),
      name: feature_tmp.get("title"),
      link: feature_tmp.get("link"),
      geom: wkt
    }));
    dialog.dialog({
      modal: true,
      width: 600,
      height: 500,
      title: "แก้ไข POI",
      buttons: {
        Close: {
          text: 'ยกเลิก',
          click: function () {
            dialogDestroy();
          }
        },
        Save: {
          text: "บันทึก",
          click: function(){
            var form = $("#formPOI");
            var formData = new FormData($("#formPOI")[0]);
            $.ajax({
              type: "POST",
              url: "controllers/update_poi.php",
              dataType: 'json',
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              success: function(data){
                if (data.success) {
                  var layerPOI = getLayerPOI();
                  if (layerPOI) {
                    layerPOI.setSource(new ol.source.ImageWMS({
                      url: oaeConfig.geoserverUrl+"/oae/wms",
                      params: {
                        "FORMAT": "image/png",
                        "LAYERS": "oae:poi",
                        "VERSION": "1.1.1",
                        id_random: getRandomInt(1, 100000000)
                      },
                      // crossOrigin: 'Anonymous'
                    }));
                  }
                  
                  alert("แก้ไข POI เสร็จเรียบร้อย");
                  clearAll();
                  closDialog();
                  removeOtherInteraction();
                } else {
                  alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
                }
              }
            });
          }
        }
      },
      close: function(){
        dialogDestroy();
      }
    }); 
  };


  var photoPOI = function() {    
    var tmp = _.template($("#tmpPOIPhoto").html()),
        dialog = $("#dialog");
    dialog.html(tmp({id: "", name: "", link: "", geom: ''}));
    dialog.dialog({
      modal: true,
      width: 600,
      height: 500,
      title: "เพิ่ม POI",
      buttons: {
        Close: {
          text: 'ยกเลิก',
          click: function () {
            dialogDestroy();
          }
        },
        Save: {
          text: "บันทึก",
          click: function(){
            var form = $("#formPOIPhoto");
            var formData = new FormData(form[0]);
            $.ajax({
              type: "POST",
              url: "controllers/create_poi.php",
              dataType: 'json',
              data: formData,
              cache: false,
              contentType: false,
              processData: false,
              success: function(data){
                if (data.success) {
                  var layerPOI = getLayerPOI();
                  if (layerPOI) {
                    layerPOI.setSource(new ol.source.ImageWMS({
                      url: oaeConfig.geoserverUrl+"/oae/wms",
                      params: {
                        "FORMAT": "image/png",
                        "LAYERS": "oae:poi",
                        "VERSION": "1.1.1",
                        id_random: getRandomInt(1, 100000000)
                      },
                      // crossOrigin: 'Anonymous'
                    }));
                  }
                  
                  alert("เพิ่ม POI เสร็จเรียบร้อย");
                  clearAll();
                  closDialog();
                  removeOtherInteraction();
                } else {
                  alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
                }
              }
            });
          }
        }
      },
      close: function(){
        dialogDestroy();
      }
    }).dialogExtend({
      closable: true,
      maximizable: true,
      minimizable: true,
      collapsable: true
    });
    dialog.siblings('.ui-dialog-buttonpane').find('button:last').hide();

    $("#photoPOI").unbind().change(function() {
      var input = document.getElementById('photoPOI');
      var file = input.files[0];
      var reader = new FileReader;
      reader.onloadend = function () {
        var exif = EXIF.readFromBinaryFile(base64ToArrayBuffer(this.result));
        if (exif.GPSLongitude && exif.GPSLatitude) {
          var lat = exif.GPSLatitude;
          var lon = exif.GPSLongitude;
          //Convert coordinates to WGS84 decimal
          var latRef = exif.GPSLatitudeRef || "N";  
          var lonRef = exif.GPSLongitudeRef || "W";
          lat = (lat[0] + lat[1]/60 + lat[2]/3600) * (latRef == "N" ? 1 : -1);  
          lon = (lon[0] + lon[1]/60 + lon[2]/3600) * (lonRef == "W" ? -1 : 1);
          $("#POIPhotoDetail").show();
          $("#formPOIPhoto input[name='poi[geom]']").val("SRID=4326;POINT("+ lon + " " + lat + ")");
          dialog.siblings('.ui-dialog-buttonpane').find('button:last').show();
        } else {
          $("#POIPhotoDetail").hide();
          $("#formPOIPhoto input[name='poi[geom]']").val("");
          dialog.siblings('.ui-dialog-buttonpane').find('button:last').hide();
          alert("ไม่พบค่าพิกัดในรูปภาพ");
        }
      };
      reader.readAsDataURL(file); 
    });
  };




  return {
    init : init,
    feature: null
  }
})();