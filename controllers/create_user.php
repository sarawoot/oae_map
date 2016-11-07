<?php
  include("../config/config.php");
  $conn = connectionDB();

  $check = "Select username from users Where username='".$_POST["username"]."'";
  $query = pg_query($conn, $check);
  $row = pg_num_rows($query);
  if($row == 0){

  $sql = "insert into users(full_name,username,role) values('".$_POST["full_name"]."','".$_POST["username"]."','".$_POST["role"]."');";
    $res = pg_query($conn, $sql);
    if ($res) {
      echo json_encode(array("success" => true));
      return true;

    } else {
      echo json_encode(array("success" => false));
      return false;
    }
  }
  else
  {
    echo json_encode(array("success" => "HAVE"));
    return false;
  }
  pg_close($conn);
?>
