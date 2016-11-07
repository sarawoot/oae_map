var layerSort = (function(){
  var init = function(){
    $( "#layerSortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#layerSortablelayerSortable" ).disableSelection();
    $("#layerSortable").on("sortbeforestop", function(e, ui) {
      var elements = $(e.target).find("div[class!=ui-state-highlight][role=tab]").get().reverse();
      _.each(elements, function(item) {
        l = map.getLayer(item.id.replace("heading", ""));
        map.removeLayer(l);
        map.addLayer(l);
      });
      map.render();
    });
  };

  return {
    init: init
  };
})();