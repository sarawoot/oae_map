<?php 
  include("../config/config.php");
  $conn = connectionOracleDB();
  $sql = "SELECT DETAIL_CODE, DETAIL_NAME FROM DETAIL ";
  if (isset($_GET["type_code"])) {
    if ( gettype($_GET["type_code"]) == "array") {
      $sql .= "where GROUP_CODE in ('".join($_GET["group_code"], "', '")."')";
    }
    if ( gettype($_GET["type_code"]) == "string") {
      $sql .= "where  GROUP_CODE = '".$_GET["group_code"]."'";
    } 
  }
  $result = oci_parse($conn, $sql);
  oci_execute($result);
  $res = array();
  while (($row = oci_fetch_array($result, OCI_BOTH)) != false) {
    $res[] =  array(
      "name" => iconv('tis-620', 'utf-8', $row["DETAIL_NAME"]),
      "code" => $row["DETAIL_CODE"]
    );
  }
  echo json_encode($res);
  oci_free_statement($result);
  oci_close($conn);

?>