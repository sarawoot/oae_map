<?php
  require_once('../libs/php-shapefile-1.1/src/shapefile.php');
  include("../config/config.php");

  if ($_FILES["layer_url"]["name"] != "") {
    if ($_FILES["layer_url"]['size'] > 1500000) { // max upload 1.5m
      echo '{"success": false, "msg": "กรุณาเลือกไฟล์ขนาดไม่เกิน 1.5M" }';
    }
    echo $_FILES["layer_url"]['size'];
    // $file = uploadFile("layer_url");
    // if ($image) {
    //   $_POST["layer"]["url"] = $image["path"];
    //   var_dump($image);

    //   // $zip = new ZipArchive;
    //   // if ($zip->open($image["path"]) === TRUE) {
    //   //     $zip->extractTo('/my/destination/dir/');
    //   //     $zip->close();
    //   //     echo 'ok';
    //   // } else {
    //   //     echo 'failed';
    //   // }


    // }
  }
  
  // try {
  //   $ShapeFile = new ShapeFile('../shp/provinces.shp');
  //   while ($record = $ShapeFile->getRecord(SHAPEFILE::GEOMETRY_WKT)) {
  //     if ($record['dbf']['deleted']) continue;
  //     // print_r($record['shp']);
  //     print_r( strtolower(json_encode($record['dbf'])));
  //   }
  // } catch (ShapeFileException $e) {
  //   exit('Error '.$e->getCode().': '.$e->getMessage());
  // }
?>