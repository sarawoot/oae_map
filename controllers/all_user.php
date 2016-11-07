<?php
  include("../config/config.php");
  $conn = connectionDB();
  $result = pg_query($conn, "SELECT * FROM users order by id desc");
  $data = array(
  );
  while ($row = pg_fetch_assoc($result)) {
    $data[] = array(
      "id" => $row["id"],
      "full_name" => $row["full_name"],
      "username" => $row["username"],
      "role" => $row["role"]
    );
  }
  echo json_encode($data);
  pg_close($conn);
?>