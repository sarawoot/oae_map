var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

/**
 * Add a click handler to hide the popup.
 * 
 * @return {boolean} Don't follow the href.
 */
closer.onclick = function() {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */
({
  element : container,
  autoPan : true,
  autoPanAnimation : {
    duration : 250
  }
}));

var googleLayer = new ol.layer.Tile(
    {
      source : new ol.source.OSM(
          {
            url : "https://mts1.googleapis.com/vt?lyrs=m@230022547&src=apiv3&hl=th-TH&x={x}&y={y}&z={z}&style=59,37%7Csmartmaps"
          }),
      opacity : 1,
      visible : true
    });

function tileLoadFunction(image, src) {
  var img = image.getImage();
  if (typeof window.btoa === 'function') {
    var xhr = new XMLHttpRequest();
    var dataEntries = src.split("&");
    var url;
    var params = "";
    for (var i = 0; i < dataEntries.length; i++) {
      if (i === 0) {
        url = dataEntries[i];
      } else {
        params = params + "&" + dataEntries[i];
      }
    }
    xhr.open('POST', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      if (this.status === 200) {
        var uInt8Array = new Uint8Array(this.response);
        var i = uInt8Array.length;
        var binaryString = new Array(i);
        while (i--) {
          binaryString[i] = String.fromCharCode(uInt8Array[i]);
        }
        var data = binaryString.join('');
        var type = xhr.getResponseHeader('content-type');
        if (type.indexOf('image') === 0) {
          img.src = 'data:' + type + ';base64,' + window.btoa(data);
        }
      }
    };
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send(params);
  } else {
    img.src = src;
  }
}

var provinceLayer = new ol.layer.Tile({
  source : new ol.source.TileWMS({
    url : oaeConfig.geoserverUrl + "/oae/wms",
    params : {
      LAYERS : 'oae:provinces',
      STYLES : undefined,
      TILED : true
    },
    serverType : 'geoserver',
    tileLoadFunction : tileLoadFunction
  })
});

var map = new ol.Map({
  target : "map",
  layers : [ googleLayer, provinceLayer ],
  view : new ol.View({
    center : oaeConfig.centerThai,
    zoom : oaeConfig.zoomThai,
  }),
  overlays : [ overlay ]
});

map.on('singleclick', function(evt) {
  var coordinate = evt.coordinate;
  content.innerHTML = '';
  var getUrlInfo = function(layerInfo) {
    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = layerInfo.getSource();
    var url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view
        .getProjection(), {
      'INFO_FORMAT' : 'application/json',
      'FEATURE_COUNT' : 1
    });
    return url;
  };
  var url = getUrlInfo(provinceLayer);
  var dataEntries = url.split("&");
  var params = "";
  for (var i = 0; i < dataEntries.length; i++) {
    if (i === 0) {
      url = dataEntries[i];
    } else if (!/SLD_BODY/.test(dataEntries[i])) {
      params = params + "&" + dataEntries[i];
    }
  }
  $.ajax({
    url : url,
    dataType : 'json',
    type : 'POST',
    data : params,
    async : false,
    success : function(res) {
      var prov_code = '';
      var ap_idn = '';
      var tb_idn = '';
      if (res.features.length > 0) {
        if ($('#province').val() == '') {
          prov_code = res.features[0].properties.prov_code;
        } else if ($('#amphur').val() == '') {
          ap_idn = res.features[0].properties.ap_idn;
        } else {
          tb_idn = res.features[0].properties.tb_idn;
          if(!tb_idn)
            tb_idn= '';
        }
        var param = 'prov_code=' + prov_code + '&ap_idn=' + ap_idn + '&tb_idn=' + tb_idn;
        $.ajax({
          url : 'controllers/report/popupdetail.php',
          type : 'GET',
          data : param,
          success : function(res) {
            content.innerHTML = res;
          }
        });

      }
    }
  });

  overlay.setPosition(coordinate);
});

map.on('dblclick', function(evt) {
  var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  var getUrlInfo = function(layerInfo) {
    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = layerInfo.getSource();
    var url = source.getGetFeatureInfoUrl(evt.coordinate, viewResolution, view
        .getProjection(), {
      'INFO_FORMAT' : 'application/json',
      'FEATURE_COUNT' : 1
    });
    return url;
  };
  var url = getUrlInfo(provinceLayer);
  var dataEntries = url.split("&");
  var params = "";
  for (var i = 0; i < dataEntries.length; i++) {
    if (i === 0) {
      url = dataEntries[i];
    } else if (!/SLD_BODY/.test(dataEntries[i])) {
      params = params + "&" + dataEntries[i];
    }
  }
  $.ajax({
    url : url,
    dataType : 'json',
    type : 'POST',
    data : params,
    async : false,
    success : function(res) {
      if (res.features.length > 0) {
        if ($('#province').val() == '') {
          var prov_code = res.features[0].properties.prov_code;
          $('#province').val(prov_code);
          centermap = true
        } else {
          var ap_idn = res.features[0].properties.ap_idn.substring(2, 4);
          if (ap_idn[0] == '0') {
            ap_idn = ap_idn[1];
          }
          $('#amphur').val(ap_idn);
          centermap = false
        }

        submit_form();
        CenterMap(lonlat[0], lonlat[1], centermap)
      }
    }
  });

});

function CenterMap(long, lat, amphur) {
  map.getView().setCenter(
      ol.proj.transform([ long, lat ], 'EPSG:4326', 'EPSG:3857'));
  map.getView().setZoom((amphur ? 8 : 11));

}
