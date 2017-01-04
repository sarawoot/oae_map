function tileLoadFunction(image, src) {
  var img = image.getImage();
  if (typeof window.btoa === 'function') {
    var xhr = new XMLHttpRequest();
    var dataEntries = src.split("&");
    var url;
    var params = "";
    for (var i = 0 ; i< dataEntries.length ; i++){
      if (i===0){
        url = dataEntries[i];    
      } else {
        params = params + "&"+dataEntries[i];
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


function generate_xml(res) {
  var colors = [ "#FF0000", "#FBFB58", "#008000" ];

  var sld_body = '';
  var title = 'Provinces';
  var layer_name = 'oae:provinces';
  var id_name = 'prov_code';
  
  sld_body = '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">';
  sld_body += '<NamedLayer><Name>' + layer_name + '</Name><UserStyle><Title>'
      + title + '</Title><Abstract>' + title + '</Abstract><FeatureTypeStyle>';
  _.each(
          res.data,
          function(item) {
            sld_body += '<Rule><ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>'
                + id_name + '</ogc:PropertyName><ogc:Literal>';
            sld_body += item.id_code
                + '</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter><PolygonSymbolizer><Fill>';
            _.each(
                    res.intervals,
                    function(interval, idx) {
                      if (item.cnt >= interval[0] && item.cnt <= interval[1]) {
                        sld_body += '<CssParameter name="fill">' + colors[idx]
                            + '</CssParameter>';
                        sld_body += '<CssParameter name="fill-opacity">0.4</CssParameter>';

                      }
                    })
            sld_body += '</Fill><Stroke><CssParameter name="stroke">#FFFFFF</CssParameter><CssParameter name="stroke-width">2</CssParameter></Stroke></PolygonSymbolizer><TextSymbolizer><Label>'
                + item.cnt
                + '</Label><Font><CssParameter name="font-family">Tahoma</CssParameter><CssParameter name="font-size">13.0</CssParameter><CssParameter name="font-style">normal</CssParameter><CssParameter name="font-weight">bold</CssParameter></Font><LabelPlacement><PointPlacement><AnchorPoint><AnchorPointX>0.5</AnchorPointX><AnchorPointY>0.5</AnchorPointY></AnchorPoint><Displacement><DisplacementX>0.0</DisplacementX><DisplacementY>0.0</DisplacementY></Displacement></PointPlacement></LabelPlacement><Fill><CssParameter name="fill">#3D3D3D</CssParameter></Fill><Halo><CssParameter name="fill">#FFFFFF</CssParameter></Halo></TextSymbolizer></Rule>';
          });
  sld_body += '<Rule><Name>rule1</Name><Title>Rule 1</Title><Abstract>Rule 1</Abstract><PolygonSymbolizer><Fill><CssParameter name="fill-opacity">0</CssParameter></Fill><Stroke><CssParameter name="stroke">#3D3D3D</CssParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

  return sld_body;
}

var googleLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    url: "https://mts1.googleapis.com/vt?lyrs=m@230022547&src=apiv3&hl=th-TH&x={x}&y={y}&z={z}&style=59,37%7Csmartmaps"
  }),
  opacity: 1,
  visible: true
});
var provinceLayer = new ol.layer.Tile({
  source: new ol.source.TileWMS({
    url: oaeConfig.geoserverUrl+"/oae/wms",
    params: {
      LAYERS: 'oae:provinces',
      STYLES: undefined,
      TILED: true
    },
    serverType: 'geoserver',
    tileLoadFunction: tileLoadFunction
  }),
  visible: false
});

var map = new ol.Map({
  target: "map",
  layers: [googleLayer, provinceLayer],
  view: new ol.View({
    center: oaeConfig.centerThai,
    zoom: oaeConfig.zoomThai,
  })
});

$.ajax({
  url : 'controllers/report/sharding_farmer_report.php',
  type : 'GET',
  data : {
    year: new Date().getFullYear() + 542,
    province: '',
    amphur: '',
    'group-type': 3,
    detail: '',
    'age-1': '',
    'age-2': '',
    'area-type': '',
    'waterexpect-report': 1
  },
  dataType : 'json',
  success : function(res) {
    provinceLayer.setVisible(true);
    layer_name = 'oae:provinces';
    if (res.data.length == 0) {
      provinceLayer.setSource(new ol.source.TileWMS({
        url : oaeConfig.geoserverUrl + "/oae/wms",
        params : {
          LAYERS : layer_name,
          TILED : true
        },
        serverType : 'geoserver',
        tileLoadFunction : tileLoadFunction
      }));
      alert("ไม่พบข้อมูล");
      return false;
    }
    var length_data = 0;
    $.fancybox.open({
      href : '#inline1',
      type : 'inline',
      closeBtn : false,
      closeClick : false,
      helpers : {
        overlay : {
          closeClick : false
        }
      }
    });
    sld_body = generate_xml(res);

    source = new ol.source.TileWMS({
      url : oaeConfig.geoserverUrl + "/oae/wms",
      params : {
        LAYERS : layer_name,
        STYLES : '',
        SLD_BODY : sld_body,
        TILED : true
      },
      serverType : 'geoserver',
      tileLoadFunction : tileLoadFunction
    });
    source.on('tileloadstart', function() {
      length_data = length_data + 1;
    });

    source.on('tileloadend', function() {
      length_data = length_data - 1;
      if (length_data == 0) {
        $.fancybox.close()
      }
    });

    provinceLayer.setSource(source);

  }
})



