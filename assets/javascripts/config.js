var oaeConfig = {
  centerThai: [11302896.246585583, 1477374.8826958865],
  zoomThai: 6,
  mode: "normal",
  currentLayer: null,
  drawColor: "#ffcc33",
  geoserverUrl: "http://192.168.0.202:8080/geoserver",
};

var dragDialog = function(event, ui) {
  var fixPix = $( window ).height() - $(this.parentElement).height(); 
  iObj = ui.position;
  if (iObj.top > fixPix) {
    iObj.top = fixPix;        
  }        
  ui.position = iObj;  
  $(window).scrollTop(0);  
};