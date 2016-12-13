if (Array.prototype.remove === undefined) {
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
}

if (ol.Map.prototype.getLayer === undefined) {
  ol.Map.prototype.getLayer = function (id) {
    var layer;
    this.getLayers().forEach(function (lyr) {
        if (id == lyr.get('id')) {
          layer = lyr;
        }
    });
    return layer;
  };
}

proj4.defs("EPSG:32647", "+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs");
proj4.defs("EPSG:32648", "+proj=utm +zone=48 +datum=WGS84 +units=m +no_defs");

var overlayStyle = (function() {
    /* jshint -W069 */
    var styles = {};
    styles['Polygon'] = [
      new ol.style.Style({
        fill: new ol.style.Fill({
          color: [255, 255, 0, 0.5]
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [255, 255, 0, 1],
          width: 5
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [255, 255, 0, 1],
          width: 3
        })
      })
    ];
    styles['MultiPolygon'] = styles['Polygon'];

    styles['LineString'] = [
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [255, 255, 0, 1],
          width: 5
        })
      }),
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: [255, 255, 0, 1],
          width: 3
        })
      })
    ];
    styles['MultiLineString'] = styles['LineString'];

    styles['Point'] = [
      new ol.style.Style({
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: [255, 255, 0, 1]
          }),
          stroke: new ol.style.Stroke({
            color: [255, 255, 0, 0.75],
            width: 1.5
          })
        }),
        zIndex: 100000
      })
    ];
    styles['MultiPoint'] = styles['Point'];

    styles['GeometryCollection'] = styles['Polygon'].concat(styles['Point']);

    return function(feature, resolution) {
      return styles[feature.getGeometry().getType()];
    };
    /* jshint +W069 */
})();

var baseLayers = [
  {
    name: "Google Road",
    layer: new ol.layer.Tile({source: new ol.source.OSM({url: "https://mts1.googleapis.com/vt?lyrs=m@230022547&src=apiv3&hl=th-TH&x={x}&y={y}&z={z}&style=59,37%7Csmartmaps"}),opacity: 1, visible: true})
  }, {
    name: "Google Satellite",
    layer: new ol.layer.Tile({source: new ol.source.OSM({url: "http://mt.google.com/vt/lyrs=s&z={z}&x={x}&y={y}&hl=th"}),opacity: 1, visible: false})
  }, {
    name: "Google Hybrid",
    layer: new ol.layer.Tile({source: new ol.source.OSM({url: "http://mt.google.com/vt/lyrs=y&z={z}&x={x}&y={y}&hl=th"}),opacity: 1, visible: false})
  }, {
    name: "Google Terrain",
    layer: new ol.layer.Tile({source: new ol.source.OSM({url: "http://mt.google.com/vt/lyrs=t&z={z}&x={x}&y={y}&hl=th"}),opacity: 1, visible: false})
  }, {
    name: "Open Street Map",
    layer: new ol.layer.Tile({ source: new ol.source.OSM(), visible: false })
  }, {
    name: "Bing Road",
    layer: new ol.layer.Tile({
      visible: false,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: 'Ain9zviHZUQq1V7lzjLAeLUMUJyz3pgVE0zZnt4Sqg0BPehKC8Hj0jSPmzqVetC6',
        imagerySet: 'Road'
      })
    })
  }, {
    name: "Bing Aerial",
    layer: new ol.layer.Tile({
      visible: false,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: 'Ain9zviHZUQq1V7lzjLAeLUMUJyz3pgVE0zZnt4Sqg0BPehKC8Hj0jSPmzqVetC6',
        imagerySet: 'Aerial'
      })
    })
  }, {
    name: "Bing Aerial with labels",
    layer: new ol.layer.Tile({
      visible: false,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: 'Ain9zviHZUQq1V7lzjLAeLUMUJyz3pgVE0zZnt4Sqg0BPehKC8Hj0jSPmzqVetC6',
        imagerySet: 'AerialWithLabels'
      })
    })
  }
]
var projection = new ol.proj.Projection({
  code: 'EPSG:4326',
  units: 'degrees',
  axisOrientation: 'neu'
});
var map = new ol.Map({
  target: "map",
  view: new ol.View({
    center: oaeConfig.centerThai,
    zoom: oaeConfig.zoomThai,
    // projection: projection
  })
});

var popup = new ol.Overlay.Popup();
map.addOverlay(popup);
popup.getElement().addEventListener('click', function(e) {
  var action = e.target.getAttribute('data-action');
  if (action) {
    if (action === 'delete') {
      $.ajax({
        type: "POST",
        url: "controllers/delete_poi.php",
        dataType: 'json',
        data: {id: e.target.getAttribute('data-id')},
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
                }
              }));
              popup.hide();
            }
            alert("ลบเสร็จเรียบร้อย");
          } else {
            alert("เกิดปัญหาระหว่างดำเนินการ กรุณาลองใหม่อีกครั้ง");
          }
        }
      });
    }
    e.preventDefault();
  }
}, false);

map.on('singleclick', function(evt) {
  var layerPOI = getLayerPOI();
  var layerFarmer = getLayerFarmer();
  var getUrlInfo = function(layerInfo){
    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = layerInfo.getSource();
    var url = source.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, view.getProjection(),
      {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 1});
    return url;
  }; 
  if (oaeConfig.mode == "editPOI") {
    if (!layerPOI) {
      alert("กรุณาเปิดชั้นข้อมูล POI ก่อน");
    } else {
      var url = getUrlInfo(layerPOI);
      $.getJSON( url, function(res) {
        if (res.features.length > 0) {
          clearAll();
          var format = new ol.format.GeoJSON();
          var feature = format.readFeature(res.features[0],{
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
          });
          features.push(feature);
          $("#btnConfirmPOI").show();
          poi.feature = feature;
        }
      });
    }   
  } else if (oaeConfig.mode == "infoPOI") {
    var url = getUrlInfo(layerPOI);
    $.getJSON( url, function(res) {
      if (res.features.length > 0) {
        clearMap();
        var data = res.features[0].properties;
        var content = "<h5>"+data.title+"</h5>";
        if (data.link.toString().trim() != "") {
          content += "<a href='"+data.link+"' target='_blank' style='padding: 0 10px'>ลิงค์</a>";  
        }
        if (data.file_path) {
         content += "<a href='"+data.file_path+"' target='_blank' style='padding: 0 10px'>ไฟล์</a>"; 
        }
        if (data.image_path) {
         content += "<p><img src='"+data.image_path+"' style='width:170px;height:100px;'></p>"; 
        }
        content += '<p><a href="javascript:void(0)" data-action="delete" data-id="'+res.features[0].id.replace("poi.", "")+'">ลบ</a></p>';
        popup.show(evt.coordinate, content);
      }
    });   
  } else if (oaeConfig.mode == "infoFarmer") {
    var url = getUrlInfo(layerFarmer);
    $.getJSON( url, function(res) {
      if (res.features.length > 0) {
        clearMap();
        var data = res.features[0].properties;
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
        
        popup.show(evt.coordinate, content);
      }
    }); 
  }
});

$.each(baseLayers, function(i, item){
  layer = item.layer
  layer.set("mapType", "baseLayer");
  map.addLayer(layer);
  if (layer.getVisible()) {
    $("[data-type=label_layer]").html(item.name);
  }
  var li = $("<li>");
  var a = $("<a>", {
    text: item.name,
    "data-idx":  i,
    click: function(){
      var baseLayer = baseLayers[$(this).data("idx")];
      $.each(baseLayers, function(i, item){
        var layer = item.layer;
        layer.setVisible(false);
      });
      baseLayer.layer.setVisible(true);
      $("[data-type=label_layer]").html(baseLayer.name);
    }
  });
  li.append(a);
  $("[data-type=container_layers]").append(li);
});

var features = new ol.Collection();
var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector({features: features}),
  style: function(feature, resolution){

    if (feature.get('popup') == 'show') {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(142, 225, 247, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: "#2670ee",
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 10,
          fill: new ol.style.Fill({
            color:  "#a00103" 
          })
        })
      })];  
    }


    if (feature.get("type") == "measure") {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: "#ffcc33",
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color:  "#ffcc33" 
          })
        })
      })];
    } else if (feature.get("type") == "intersect") {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: '#B3AA90'
        }),
        stroke: new ol.style.Stroke({
          color: "#B3AA90",
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color:  "#B3AA90" 
          })
        })
      })];
    } else if (feature.get("type") == "draw") {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: feature.get("color")
        }),
        stroke: new ol.style.Stroke({
          color: feature.get("color"),
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: feature.get("color") 
          })
        })
      })];  
    } else if (feature.get("type") == "buffer_area") {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 0, 0, 0.5)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(255, 255, 255, 0.5)',
          width: 2
        })
      })];  
    } else if (feature.get('type') == 'result-search') {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(142, 225, 247, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: "#2670ee",
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color:  "#2670ee" 
          })
        })
      })];  
    } else {
      return [new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: "#ffcc33",
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color:  "#ffcc33" 
          })
        })
      })];      
    }
  }
});
featureOverlay.setMap(map);

function removeOtherInteraction() {
  var sl = [];
  _.each(map.getInteractions().a, function(item, i){
    if (i > 8) {
      sl.push(item);
    }
  });
  _.each(sl, function(item){
    map.removeInteraction(item);
  });
}

function clearAll(){
  clearMap();
  dialogDestroy();
  $("#resultPanel").empty();
}

function clearMap(){
  features.clear();  
  map.getOverlays().clear();
  map.addOverlay(popup);
  popup.hide();
  var layer = getLayerFarmer();
  if ( layer && layer.getSource().getParams().STYLES != "" && 
       oaeConfig.mode != "infoPOI" && oaeConfig.mode != "infoFarmer" ) {
    layer.setSource(
      new ol.source.ImageWMS({
        url: oaeConfig.geoserverUrl+"/oae/wms",
        params: {
          "FORMAT": "image/png",
          "LAYERS": "oae:farmer_area",
          "VERSION": "1.1.1",
          STYLES: '',
          id_random: getRandomInt(1, 100000000)
        }
      })
    );
  }
}

function getLayerPOI(){
  var layerPOI;
  _.each(map.getLayers().getArray(), function(item) {
    if( item.get("category") == "poi") {
      layerPOI = item;
    }
  });
  return layerPOI
}

function getLayerFarmer(){
  var layerFarmer;
  _.each(map.getLayers().getArray(), function(item) {
    if( item.get("category") == "farmer") {
      layerFarmer = item;
    }
  });
  return layerFarmer
}

var dialogDestroy = function(){
  // var layer_result = map.getLayer("result");
  // if (layer_result) { return false; };
  if ($("#dialog").hasClass('ui-dialog-content')){
    $("#dialog").dialog("destroy");  
  }
};