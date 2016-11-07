<?php
  include("../config/config.php");
  $conn = connectionDB();

  if ($_FILES["layer_url"]["name"] != "") {
    $image = uploadFile("layer_url");
    if ($image) {
      $_POST["layer"]["url"] = $image["path"];
    }
  }

  $res = pg_insert($conn, 'layers', $_POST["layer"]);
  if ($res) {
      echo json_encode(array("success" => true));
  } else {
      echo json_encode(array("success" => false));
  }

  pg_close($conn);
?>