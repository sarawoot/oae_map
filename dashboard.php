<!DOCTYPE html>
<html lang="en">
<head>
  <title></title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport"
    content="width=device-width, initial-scale=1, user-scalable=no" />
  <link rel="stylesheet"
    href="assets/plugins/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/plugins/ol3/ol.css">
  <link rel="stylesheet" href="assets/ol.css">
  <link rel="stylesheet" type="text/css"
    href="assets/plugins/fancybox/source/jquery.fancybox.css?v=2.1.5"
    media="screen" />
  <style>
    #map { position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; }
    #map .ol-zoom { font-size: 1.2em; }
    #map { z-index: 35; }
  </style>
</head>

<body>
  <div id="map"></div>
  <div id="inline1" style="width: 300px; display: none;">
    <center>
      <p>
        <img src="assets/images/loader.gif">
      </p>
      <h3>Loading..</h3>
    </center>
  </div>
  <!-- Javascript -->
  <script src="assets/plugins/lodash.js"></script>
  <script src="assets/plugins/jquery-1.12.4.min.js"></script>
  <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
  <script src="assets/plugins/ol3/ol.js"></script>
  <script src="assets/javascripts/config.js"></script>
  <script type="text/javascript"
    src="assets/plugins/fancybox/source/jquery.fancybox.js?v=2.1.5"></script>
  <script src="assets/javascripts/dashboard/map.js"></script>
</body>
</html>