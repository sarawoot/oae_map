<?php
  include("../config/config.php");
  $conn = connectionDB();
  $result = pg_query($conn, "SELECT * FROM layers order by id");
  $data = array();
  while ($row = pg_fetch_assoc($result)) {
    $data[] = array(
      "id" => $row["id"],
      "text" => $row["name"],
      "parent" => is_null($row["parent_id"]) ? "#" : $row["parent_id"],
      "data" => array(
        "layer" => $row["layer"] == "t",
        "category" => $row["category"],
        "url" => $row["url"],
        "visible" => $row["visible"] == "t",
        "opacity" => $row["opacity"],
        "add_able" => $row["add_able"] == "t",
        "edit_able" => $row["edit_able"] == "t",
        "delete_able" => $row["delete_able"] == "t",
        "id" => $row["id"],
        "name" => $row["name"],
        "parent_id" => $row["parent_id"],
      ),
      "state" => array(
        "selected" => $row["visible"] == "t"
      ),
    );
  }
  echo json_encode($data);
  pg_close($conn);
?>