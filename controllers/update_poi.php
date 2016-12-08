<?php 
  include("../config/auth.php");
  include("../config/config.php");
  $conn = connectionDB();
  if ($_FILES["file"]["name"] != "") {
    $file = uploadFile("file");
    if ($file) {
      $_POST["poi"]["file_name"] = $file["name"];
      $_POST["poi"]["file_path"] = $file["path"];
    }
  }
  if ($_FILES["image"]["name"] != "") {
    $image = uploadFile("image");
    if ($image) {
      $_POST["poi"]["image_name"] = $image["name"];
      $_POST["poi"]["image_path"] = $image["path"];
    }
  }
  $_POST["poi"]["geom"] = "ST_GeometryFromText('".$_POST["poi"]["geom"]."')";
  $_POST["poi"]["gtype"] = "GeometryType(".$_POST["poi"]["geom"].")";
  $_POST["poi"]["updated_by"] = $_SESSION['user_id'];
  $_POST["poi"]["updated_at"] = date("Y-m-d H:i:s");
  $fields = array();
  foreach ($_POST["poi"] as $key => $value){
    if ($key == "geom" or  $key == "gtype"  or $key == 'user_id') {
      $fields[] = $key." = ".$value;
    } else {
      $fields[] = $key." = '".$value."'";
    }
  }
  $sql = "update poi set ".join($fields, ", ")." where id = ".$_POST["id"];
  $res = pg_query($conn, $sql);
  if ($res) {
    echo json_encode(array("success" => true));
  } else {
    echo json_encode(array("success" => false));
  }
  pg_close($conn);
?>