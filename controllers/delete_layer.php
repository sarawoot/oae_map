<?php
  include("../config/config.php");
  $conn = connectionDB();
  $sql = "delete from layers where id in (".join($_POST['ids'], ',').")";
  $res = pg_query($conn, $sql);
  if ($res) {
      echo json_encode(array("success" => true));
  } else {
      echo json_encode(array("success" => false));
  }
  pg_close($conn);
?>