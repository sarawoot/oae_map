<?php
  include("../config/auth.php");
  include("../config/config.php");
  date_default_timezone_set("Asia/Bangkok");
  $conn = connectionDB();

  if ($_FILES["layer_url"]["name"] != "") {
    $image = uploadFile("layer_url");
    if ($image) {
      $_POST["layer"]["url"] = $image["path"];
    }
  }
  $_POST["layer"]["created_by"] = $_SESSION['user_id'];
  $_POST["layer"]["created_at"] = date("Y-m-d H:i:s");

  $res = pg_insert($conn, 'layers', $_POST["layer"]);
  if ($res) {
      echo json_encode(array("success" => true));
  } else {
      echo json_encode(array("success" => false));
  }

  pg_close($conn);
?>