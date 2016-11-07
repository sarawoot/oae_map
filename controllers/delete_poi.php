<?php
  include("../config/config.php");
  $conn = connectionDB();

  $res = pg_delete($conn, 'poi', array("id" => $_POST["id"]) );
  if ($res) {
    echo json_encode(array("success" => true));
  } else {
    echo json_encode(array("success" => false));
  }

  pg_close($conn);
?>