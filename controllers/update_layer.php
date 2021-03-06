<?php
  include("../config/auth.php");
  include("../config/config.php");
  $conn = connectionDB();

  if ($_FILES["layer_url"]["name"] != "") {
    $image = uploadFile("layer_url");
    if ($image) {
      $_POST["layer"]["url"] = $image["path"];
    }
  }
  $_POST["layer"]["updated_by"] = $_SESSION['user_id'];
  $_POST["layer"]["updated_at"] = date("Y-m-d H:i:s");
  
  $res = pg_update($conn, 'layers', $_POST["layer"], array("id" => $_POST["id"]) );
  if ($res) {
      echo json_encode(array("success" => true));
  } else {
      echo json_encode(array("success" => false));
  }

  pg_close($conn);
?>