<?php
  include("../config/config.php");
  $conn = connectionOracleDB();
  $result = oci_parse($conn, "SELECT PROVINCE_CODE, PROVINCE_NAME FROM PROVINCE");
  oci_execute($result);
  $res = array();
  while (($row = oci_fetch_array($result, OCI_BOTH)) != false) {
    $res[] =  array(
      "name" => iconv('tis-620', 'utf-8', $row["PROVINCE_NAME"]),
      "code" => $row["PROVINCE_CODE"]
    );
  }
  echo json_encode($res);
  oci_free_statement($result);
  oci_close($conn);
?>