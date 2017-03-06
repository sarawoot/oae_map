function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}

var measure = (function () {
  var init= function(){
    $("#mapToolbar button[data-group=measure]").on("click", function(){
      oaeConfig.mode = "normal";
      deactiveMenuAll();
      $(this).addClass("active");
      removeOtherInteraction();
      addInteraction($(this).attr("category"));
    });
  };

  var interaction, sketch;
  this.addInteraction = function(type) {
    map.removeInteraction(interaction);
    interaction = new ol.interaction.Draw({
      features: features,
      type: (type),
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 5,
          stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)'
          }),
          fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)'
          })
        })
      })
    });
    map.addInteraction(interaction);

    createMeasureTooltip();
    createHelpTooltip();

    interaction.on('drawstart',
      function(evt) {
        sketch = evt.feature;
        var id = new Date().getTime();
        sketch.set("id", id);
        sketch.set("config", {});
      }, this);

    interaction.on('drawend',
      function(evt) {
        measureTooltipElement.className = 'tooltip tooltip-custom tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        evt.feature.set("type", "measure");
        // removeOtherInteraction();
        // deactiveMenuAll();
      }, this);
  }

  var measureTooltipElement, measureTooltip;
  var createMeasureTooltip = function() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-custom tooltip-measure';
    measureTooltip = new ol.Overlay({
      element: measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);
  }

  var helpTooltipElement, helpTooltip;
  var createHelpTooltip = function() {
    if (helpTooltipElement) {
      helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip tooltip-custom';
    helpTooltip = new ol.Overlay({
      element: helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);
  }

  var pointerMoveHandler = function(evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click to start drawing';
    /** @type {ol.Coordinate|undefined} */
    var tooltipCoord = evt.coordinate;

    if (sketch) {
      var output;
      var geom = (sketch.getGeometry());
      if (geom instanceof ol.geom.Polygon) {
          output = formatArea((geom));
          helpMsg = continuePolygonMsg;
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
          output = formatLength((geom));
          helpMsg = continueLineMsg;
          tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
      measureTooltip.set("parent_id", sketch.get("id"));
    }

    // helpTooltipElement.innerHTML = helpMsg;
    // helpTooltip.setPosition(evt.coordinate);
  };
  map.on('pointermove', pointerMoveHandler);

  var continuePolygonMsg = 'Click to continue drawing the polygon';
  var formatArea = function(polygon) {
    var area;
    area = polygon.getArea();
    var area = (Math.round(area * 100) / 100);
    // if (area > 10000) {
    //     output = (Math.round(area / 1000000 * 100) / 100) +
    //       ' ' + 'km<sup>2</sup>';
    // } else {
    //     output = (Math.round(area * 100) / 100) +
    //       ' ' + 'm<sup>2</sup>';
    // }
    var str = "";
    var rai = Math.floor(area/1600)
    var nang = Math.floor((area%1600)/400)
    var wa =  ((area%1600)%400)/4
    if (rai > 0) {
      str += " "+numberWithCommas(rai)+" ไร่"
    }
    if (nang > 0) {
      str += " "+numberWithCommas(Math.round(nang*100)/100)+" งาน"
    }
    if (wa > 0) {
      str += " "+numberWithCommas(Math.round(wa*100)/100)+" วา"
    }

    return str;
  };

  var continueLineMsg = 'Click to continue drawing the line';
  var formatLength = function(line) {
    var length;
    length = Math.round(line.getLength() * 100) / 100;
    var output;
    if (length > 100) {
      output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
    } else {
      output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
    }
    return output;
  };

  return {
    init: init
  };
})();
