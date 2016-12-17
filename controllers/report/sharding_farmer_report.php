<?php
include ("../../config/config.php");
include ("../../helper/share_func.php");
$conn = connectionOracleDB ();
$sql = "";
$num_min = 0;
$num_max = 0;
$level = 3;
$intervals = array ();
$result = array ();
$colors = array (
    "#008000",
    "FBFB58",
    "#FF0000" 
);
$expect_report_array = [ 
    "count(PROFILE.PROFILE_CENTER_ID)",
    "count(PROFILE.PROFILE_CENTER_ID)",
    "sum(ACTIVITY.ACT_RAI)",
    "sum(NVL(ACTIVITY.PRODUCE_AREA,0))",
    "sum(NVL(ACTIVITY.AMOUNT,0))" 
];

$expect_report = (isset ( $_GET ['expect-report'] )) ? ( int ) $_GET ['expect-report'] : 0;
if (isset ( $_GET ['province'] ) and $_GET ["province"] != "") {
  if (isset ( $_GET ['amphur'] ) and $_GET ["amphur"] != "") {
    $select_field = "CONCAT(CONCAT(TAMBON.PROVINCE_CODE ,LPAD(TAMBON.AMPHUR_CODE,2,'0')) ,LPAD(TAMBON.TAMBON_CODE,2,'0') ) AP_CODE";
    $join = '  INNER JOIN TAMBON ON TAMBON.AMPHUR_CODE= AREA.AMPHUR_CODE  AND TAMBON.PROVINCE_CODE = AREA.PROVINCE_CODE AND TAMBON.TAMBON_CODE = AREA.TAMBON_CODE ';
    $groupby = " GROUP BY TAMBON.PROVINCE_CODE,TAMBON.AMPHUR_CODE,TAMBON.TAMBON_CODE";
    $index_get = "AP_CODE";
  } else {
    $select_field = "CONCAT(AMPHUR.PROVINCE_CODE ,LPAD(AMPHUR.AMPHUR_CODE,2,'0')) AP_CODE";
    $join = ' INNER JOIN AMPHUR ON AMPHUR.AMPHUR_CODE= AREA.AMPHUR_CODE  AND AMPHUR.PROVINCE_CODE = AREA.PROVINCE_CODE ';
    $groupby = " GROUP BY AMPHUR.AMPHUR_CODE,AMPHUR.PROVINCE_CODE";
    $index_get = "AP_CODE";
  }
  $orderby = " ORDER BY AP_CODE";
} else {
  $select_field = 'PROVINCE.PROVINCE_CODE';
  $join = " INNER JOIN PROVINCE ON PROVINCE.PROVINCE_CODE = AREA.PROVINCE_CODE";
  $groupby = " GROUP BY PROVINCE.PROVINCE_CODE";
  $orderby = " ORDER BY PROVINCE.PROVINCE_CODE";
  $index_get = "PROVINCE_CODE";
}

$sql = " SELECT " . $select_field . ", " . $expect_report_array [$expect_report] . " as CNT FROM PROFILE";
$sql .= " INNER JOIN AREA ON AREA.PROFILE_CENTER_ID = PROFILE.PROFILE_CENTER_ID";
$sql .= $join;
// $sql .= " INNER JOIN ACTIVITY ON ACTIVITY.PROFILE_CENTER_ID = PROFILE.PROFILE_CENTER_ID";
$sql .= " INNER JOIN ACTIVITY ON ACTIVITY.AREA_ID = AREA.PROFILE_AREA_ID";
$sql .= " WHERE 1=1 ";
if (isset ( $_GET ["group-type"] ) and $_GET ["group-type"] != "") {
  $sql .= " AND ACTIVITY.TYPE_CODE IN  (SELECT TYPE_CODE FROM TYPE WHERE GROUP_CODE = " . (( int ) $_GET ["group-type"]) . " ) ";
}
if (isset ( $_GET ["detail"] ) and $_GET ["detail"] != "") {
  $sql .= " AND ACTIVITY.DETAIL_CODE = '" . $_GET ["detail"] . "'";
}
if ($_GET ["year"] != "" and isset ( $_GET ["year"] )) {
  $sql .= " AND SUBSTR(REGISTER_DATE,0, 4) = '" . $_GET ["year"] . "'";
}

if (isset ( $_GET ["age-1"] ) and isset ( $_GET ["age-2"] )) {
  if ($_GET ["age-1"] != "'" && $_GET ["age-2"] != "")
    $sql .= " AND (PROFILE_AGE  BETWEEN " . (( int ) $_GET ["age-1"]) . " AND " . (( int ) $_GET ["age-2"]) . " )";
}

if ($_GET ["area-type"] != "" and isset ( $_GET ["area-type"] )) {
  $sql .= " AND AREA.AREA_TYPE IN ( " . $_GET ["area-type"] . ")";
}

if ($_GET ["water"] != "" and isset ( $_GET ["water"] )) {
  $sql .= " AND WATER." . str_replace ( ' ', "", $_GET ["water"] ) . " = 1";
}

if (isset ( $_GET ['province'] ) and $_GET ["province"] != "") {
  if (isset ( $_GET ['amphur'] ) and $_GET ["amphur"] != "") {
    $sql .= "  AND TAMBON.PROVINCE_CODE = " . (( int ) $_GET ['province']) . " AND   TAMBON.AMPHUR_CODE = " . (( int ) $_GET ['amphur']);
  } else {
    $sql .= " AND AMPHUR.PROVINCE_CODE = " . (( int ) $_GET ['province']);
  }
}


$sql .= $groupby;
$sql .= $orderby;


if ($sql != "") {
  $result = oci_parse ( $conn, $sql );
  oci_execute ( $result );
  
  $sql_min = "SELECT MIN(CNT) AS MIN_CNT FROM (" . $sql . ")";
  $result_min = oci_parse ( $conn, $sql_min );
  oci_execute ( $result_min );
  $row = oci_fetch_array ( $result_min, OCI_BOTH );
  $num_min = $row ["MIN_CNT"];
  
  $sql_max = "SELECT MAX(CNT) AS MAX_CNT FROM (" . $sql . ")";
  $result_max = oci_parse ( $conn, $sql_max );
  oci_execute ( $result_max );
  $row = oci_fetch_array ( $result_max, OCI_BOTH );
  $num_max = $row ["MAX_CNT"];
  
  oci_free_statement ( $result_min );
  oci_free_statement ( $result_max );
}
if ($num_max > 0) {
  $intervals = IntervalInt ( $num_min, $num_max, $level );
}

$data = array (
    "intervals" => $intervals,
    "data" => array () 
);

while ( ($row = oci_fetch_array ( $result, OCI_BOTH )) != false ) {
  $data ["data"] [] = array (
      "id_code" => $row [$index_get],
      "cnt" => $row ["CNT"] 
  );
}

if (isset ( $result )) {
  oci_free_statement ( $result );
}

echo json_encode ( $data );

oci_close ( $conn );
?>