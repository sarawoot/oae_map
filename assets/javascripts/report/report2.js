$(function(){
  $("[select2]").select2();
  $("#farmer-type").change(function(){
    $.ajax({
      url: "controllers/details.php",
      type: 'GET',
      dataType: "json",
      data: {
        type_code: $("#farmer-type").val()
      },
      success: function(res){
        var elem = $("#farmer-detail");
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
  });
  $("#report-farmer").submit(function(){
    // var host = location.href.replace(/\/([^\/]+)\/?$/, '/');
    $.ajax({
      url: 'controllers/report/sharding_farmer_report.php',
      type: 'GET',
      data: $("#report-farmer").serialize(),
      dataType: 'json',
      success: function(res) {
    	 
        if (res.data.length == 0) { 
          provinceLayer.setSource(new ol.source.TileWMS({
            url: oaeConfig.geoserverUrl+"/oae/wms",
            params: {
              LAYERS: 'oae:provinces',
              TILED: true
            },
            serverType: 'geoserver',
            tileLoadFunction: tileLoadFunction
          }));
          alert("ไม่พบข้อมูล");
          return false;
        }
        $.fancybox.open({
			href : '#inline1',
			type : 'inline',
			closeBtn : false,
			closeClick : false,
			helpers   : { 
					overlay : {closeClick: false} // prevents closing when clicking OUTSIDE fancybox 
			}
        });
        var sld_body = '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><NamedLayer><Name>oae:provinces</Name><UserStyle><Title>Provinces</Title><Abstract>Provinces</Abstract><FeatureTypeStyle>';
        var colors = ["#008000","FBFB58","#FF0000"];
        var length_data = 0;
        _.each(res.data,function(item) {
          sld_body += '<Rule><ogc:Filter><ogc:PropertyIsEqualTo><ogc:PropertyName>prov_code</ogc:PropertyName><ogc:Literal>';
          sld_body += item.province_code+'</ogc:Literal></ogc:PropertyIsEqualTo></ogc:Filter><PolygonSymbolizer><Fill>';
          _.each(res.intervals, function(interval, idx) {
              if (interval[0] <= item.cnt && interval[1] >= item.cnt) {
                sld_body += '<CssParameter name="fill">'+colors[idx]+'</CssParameter>';
              }
          })
          sld_body += '</Fill><Stroke><CssParameter name="stroke">#FFFFFF</CssParameter><CssParameter name="stroke-width">2</CssParameter></Stroke></PolygonSymbolizer><TextSymbolizer><Label>'+item.cnt+'</Label><Font><CssParameter name="font-family">Tahoma</CssParameter><CssParameter name="font-size">13.0</CssParameter><CssParameter name="font-style">normal</CssParameter><CssParameter name="font-weight">bold</CssParameter></Font><LabelPlacement><PointPlacement><AnchorPoint><AnchorPointX>0.5</AnchorPointX><AnchorPointY>0.5</AnchorPointY></AnchorPoint><Displacement><DisplacementX>0.0</DisplacementX><DisplacementY>0.0</DisplacementY></Displacement></PointPlacement></LabelPlacement><Fill><CssParameter name="fill">#3D3D3D</CssParameter></Fill><Halo><CssParameter name="fill">#FFFFFF</CssParameter></Halo></TextSymbolizer></Rule>';
        });
        // <TextSymbolizer><Label><ogc:PropertyName>name_thai</ogc:PropertyName></Label><Font><CssParameter name="font-family">Tahoma</CssParameter><CssParameter name="font-size">13.0</CssParameter><CssParameter name="font-style">normal</CssParameter><CssParameter name="font-weight">bold</CssParameter></Font><LabelPlacement><PointPlacement><AnchorPoint><AnchorPointX>0.5</AnchorPointX><AnchorPointY>0.5</AnchorPointY></AnchorPoint><Displacement><DisplacementX>0.0</DisplacementX><DisplacementY>0.0</DisplacementY></Displacement></PointPlacement></LabelPlacement><Fill><CssParameter name="fill">#3D3D3D</CssParameter></Fill></TextSymbolizer>
        sld_body += '<Rule><Name>rule1</Name><Title>Rule 1</Title><Abstract>Rule 1</Abstract><PolygonSymbolizer><Fill><CssParameter name="fill-opacity">0</CssParameter></Fill><Stroke><CssParameter name="stroke">#3D3D3D</CssParameter></Stroke></PolygonSymbolizer></Rule></FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
        source = new ol.source.TileWMS({
            url: oaeConfig.geoserverUrl+"/oae/wms",
            params: {
              LAYERS: 'oae:provinces',
              STYLES: '',
              SLD_BODY: sld_body,
              TILED: true
            },
            serverType: 'geoserver',
            tileLoadFunction: tileLoadFunction
          });
        source.on('tileloadstart', function() {
        	length_data = length_data + 1;
        	
        });
        
        source.on('tileloadend', function() {
        	length_data = length_data - 1;
        	if(length_data == 0)
        		$.fancybox.close()
        	
        });
        
        provinceLayer.setSource(source);
        
      }
    })

    return false;
  });
  $("#link-report-farmer").click(function(){
    var url = 'http://192.168.0.220:9502/analytics/saw.dll?';
    url += 'Go&Path=/shared/OAE_REPORT/GIS_REG_01&Action=Navigate&P0=3&P1=eq';
    url += '&P2="ข้อมูลพื้นฐานครัวเรือนเกษตรกร"."ปีที่ขึ้นทะเบียนเกษตรกร"&P3="'+$("#farmer-year").val()+'"';
    url += '&P4=eq&P5="การประกอบกิจกรรมการเกษตร"."รหัสประเภทกิจกรรม"&P6="'+$("#farmer-type").val()+'"';
    url += '&P7=eq&P8="การประกอบกิจกรรมการเกษตร"."รหัสชนิดพืช/สัตว์"&P9="'+$("#farmer-detail").val()+'"';
    url += '&NQUser=weblogic&NQPassword=Welcome1';
    window.open(url,"_blank");
  });
});