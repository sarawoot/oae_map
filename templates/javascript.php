  <!-- Javascript -->
  <script src="assets/plugins/lodash.js"></script>
  <script src="assets/plugins/jquery-1.12.4.min.js"></script>
  <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
  <script src="assets/plugins/jquery.bootpag.min.js"></script>
  <script src="assets/plugins/bootstrap-slider/dist/bootstrap-slider.min.js"></script>
  <script src="assets/plugins/ol3/ol.js"></script>
  <script src="assets/plugins/proj4.js"></script>
  <script src="assets/plugins/bootstrap-colorpicker/dist/js/bootstrap-colorpicker.min.js"></script>
  <script src="assets/plugins/jquery-ui-1.12.0/jquery-ui.js"></script>
  <script src="assets/plugins/jstree/dist/jstree.js"></script>
  <script src="assets/plugins/jquery-validation-1.15.0/dist/jquery.validate.js"></script>
  <script src="assets/plugins/ol3-popup/src/ol3-popup.js"></script>
  <script src="assets/plugins/jquery.dialogextend.min.js"></script>
  <script src="assets/plugins/exif.js"></script>
  <script src="assets/plugins/select2-4.0.3/dist/js/select2.full.min.js"></script>
  <script src="assets/plugins/jspdf.min.js"></script>
  <script src="assets/plugins/pace.min.js"></script>

  <script src="assets/javascripts/config.js"></script>
  <script src="assets/javascripts/menu.js"></script>
  <script src="assets/javascripts/layer_switcher.js"></script>
  <script src="assets/javascripts/map.js"></script>
  <script src="assets/javascripts/measure.js"></script>
  <script src="assets/javascripts/tools.js"></script>
  <script src="assets/javascripts/poi.js"></script>
  <script src="assets/javascripts/buffer.js"></script>
  <script src="assets/javascripts/layer_sort.js"></script>
  <script>
    $(function(){
      poi.init();
      measure.init();
      LayerSwitcher.init();
      buffer.init();
      layerSort.init();
      $("button[title=Attributions]").remove();
    });
  </script>
  <!-- End Javascript -->