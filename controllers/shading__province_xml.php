<?php

// #00ff00  #00d100 #008f00
  // "http://127.0.0.1:8080/geoserver/postgresql/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYER=postgresql:province&STYLES&format=image/png&sld=http://127.0.0.1:3000/sld/shading.xml?data=[["30",1]]&interval=[["1","1"],["2","2"],["3","3"]]&color=["#008000","fbfb58","#FF0000"]&place=prov_code&CRS=EPSG:3857&WIDTH=1919&HEIGHT=433&BBOX=8375048.403271469,789704.527017104,14153849.492677536,2093623.6889310316"
  // echo(IntervalInt(1,1,3)[1][0]);

echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<StyledLayerDescriptor version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <NamedLayer>
    <Name>province</Name>
    <UserStyle>
      <Title></Title>
      <Abstract>Feature</Abstract>
      <FeatureTypeStyle>
        <Rule>
          <ogc:Filter>
            <ogc:PropertyIsEqualTo>
              <ogc:PropertyName>prov_code</ogc:PropertyName>
              <ogc:Literal>30</ogc:Literal>
            </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <PolygonSymbolizer>
            <Fill>
              <CssParameter name="fill">#fad2d2</CssParameter>
            </Fill>
          </PolygonSymbolizer>
          <TextSymbolizer>
            <Label>1</Label>
            <Font>
              <CssParameter name="font-family">Tahoma</CssParameter>
              <CssParameter name="font-size">13.0</CssParameter>
              <CssParameter name="font-style">normal</CssParameter>
              <CssParameter name="font-weight">bold</CssParameter>
            </Font>
            <LabelPlacement>
              <PointPlacement>
                <AnchorPoint>
                  <AnchorPointX>0.5</AnchorPointX>
                  <AnchorPointY>0.5</AnchorPointY>
                </AnchorPoint>
                <Displacement>
                  <DisplacementX>0.0</DisplacementX>
                  <DisplacementY>0.0</DisplacementY>
                </Displacement>
              </PointPlacement>
            </LabelPlacement>
            <Fill>
              <CssParameter name="#3D3D3D">fill</CssParameter>
            </Fill>
            <Halo>
              <CssParameter name="#FFFFFF">fill</CssParameter>
            </Halo>
          </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>