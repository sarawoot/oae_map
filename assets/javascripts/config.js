var oaeConfig = {
  centerThai: [11302896.246585583, 1477374.8826958865],
  zoomThai: 6,
  mode: "normal",
  currentLayer: null,
  drawColor: "#ffcc33",
  geoserverUrl: "http://192.168.4.230:8080/geoserver",
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

var contentPopupFarmer = function(data) {
  var content = "<br><p><b>ชื่อ-นามสกุล</b>: "+data.profile_name+" "+data.profile_surname+"</p>";
  if (role == 'admin') {
    content += "<p><b>ที่อยู่</b>: "+data.address+"</p>";  
  }
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

  content += "<p style='margin-top:5px;'><h5><b><u>พื้นที่เพาะปลูก</u></b></h5></p>";
  content += "<p><b>สินค้า</b>: "+data.detail_name+"</p>";
  content += "<p><b>ขนาดพื้นที่</b>: "+area+"</p>";
  content += "<p><b>ตำบล</b>: "+data.tambon_name+"</p>";
  content += "<p><b>อำเภอ</b>: "+data.amphur_name+"</p>";
  content += "<p><b>จังหวัด</b>: "+data.province_name+"</p>";

  return content;
}