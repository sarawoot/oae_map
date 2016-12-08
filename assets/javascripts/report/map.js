var googleLayer = new ol.layer.Tile({
  source: new ol.source.OSM({
    url: "https://mts1.googleapis.com/vt?lyrs=m@230022547&src=apiv3&hl=th-TH&x={x}&y={y}&z={z}&style=59,37%7Csmartmaps"
  }),
  opacity: 1,
  visible: true
});

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
  })
});


var map = new ol.Map({
  target: "map",
  layers: [googleLayer, provinceLayer],
  view: new ol.View({
    center: oaeConfig.centerThai,
    zoom: oaeConfig.zoomThai,
  })
});


map.on('singleclick', function(evt) {
  var getUrlInfo = function(layerInfo){
    var view = map.getView();
    var viewResolution = view.getResolution();
    var source = layerInfo.getSource();
    var url = source.getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, view.getProjection(),
      {'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 1});
    return url;
  }; 
  var url = getUrlInfo(provinceLayer);
  var dataEntries = url.split("&");
  var params = "";
  for (var i = 0 ; i< dataEntries.length ; i++){
    if (i===0){
      url = dataEntries[i];    
    } else if (!/SLD_BODY/.test(dataEntries[i])) {
      params = params + "&"+dataEntries[i];
    }
  }
  var url_report = "";
  $.ajax({ 
    url: url,
    dataType: 'json',
    type: 'POST',
    data: params,
    async: false,
    success: function(res) {
      if (res.features.length > 0) {
        var prov_code = res.features[0].properties.prov_code;
        // url_report = 'http://192.168.0.220:9502/analytics/saw.dll?'
        // url_report += 'Go&Path=/shared/OAE_REPORT/GIS_REG_02&Action=Navigate&P0=4'
        // url_report += '&P1=eq&P2="ข้อมูลพื้นฐานครัวเรือนเกษตรกร"."ปีที่ขึ้นทะเบียนเกษตรกร"&P3="'+$("#farmer-year").val()+'"'
        // url_report += '&P4=eq&P5="การประกอบกิจกรรมการเกษตร"."รหัสประเภทกิจกรรม"&P6="'+$("#farmer-type").val()+'"'
        // url_report += '&P7=eq&P8="การประกอบกิจกรรมการเกษตร"."รหัสชนิดพืช/สัตว์"&P9="'+$("#farmer-detail").val()+'"'
        // url_report += '&P10=eq&P11="การถือครองที่ดิน"."รหัสจังหวัด"&P12="'+prov_code+'"'
        // url_report += '&NQUser=weblogic&NQPassword=Welcome1';
      }
    }
  });
  // window.open(url_report,"_blank");
});