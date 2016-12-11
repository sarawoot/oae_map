<?php
include ("../config/config.php");
$conn = connectionOracleDB ();
$sql = "SELECT DETAIL_CODE, DETAIL_NAME FROM DETAIL ";
if (isset ( $_GET ["group_code"] )) {
  $sql .= "where  TYPE_CODE IN (SELECT TYPE_CODE FROM TYPE WHERE GROUP_CODE = " . (( int ) $_GET ["group_code"]) . " )   ";
}
// echo $sql;
$result = oci_parse ( $conn, $sql );
oci_execute ( $result );
$res = array ();
while ( ($row = oci_fetch_array ( $result, OCI_BOTH )) != false ) {
  $res [] = array (
      "name" => iconv ( 'tis-620', 'utf-8', $row ["DETAIL_NAME"] ),
      "code" => $row ["DETAIL_CODE"] 
  );
}
echo json_encode ( $res );
oci_free_statement ( $result );
oci_close ( $conn );

?>