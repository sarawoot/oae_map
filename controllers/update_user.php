<?php
  include("../config/config.php");
  $conn = connectionDB();

  $sql = "update users set role = '".$_POST["role"]."' where id = ".$_POST["id"];
  // echo $sql;
  // exit();
  $res = pg_query($conn, $sql);
  if ($res) {
    echo json_encode(array("success" => true));
  } else {
    echo json_encode(array("success" => false));
  }
  pg_close($conn);
?>