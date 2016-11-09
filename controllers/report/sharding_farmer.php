<?php
  include("../../config/config.php");
  include("../../helper/share_func.php");
  $conn = connectionOracleDB();
  $sql = "";
  $num_min = 0;
  $num_max = 0;
  $level = 3;
  $intervals = array();
  $result = array();
  $colors = array("#008000","FBFB58","#FF0000");
  $sql = " SELECT PROVINCE.PROVINCE_CODE, COUNT(DISTINCT PROFILE.PROFILE_IDCARD) as CNT FROM PROFILE";
  $sql .= " INNER JOIN AREA ON AREA.PROFILE_CENTER_ID = PROFILE.PROFILE_CENTER_ID";
  $sql .= " INNER JOIN PROVINCE ON PROVINCE.PROVINCE_CODE = AREA.PROVINCE_CODE";
  $sql .= " INNER JOIN ACTIVITY ON ACTIVITY.AREA_ID = AREA.PROFILE_AREA_ID";
  if (isset($_GET["type"]) and $_GET["type"] != "") {
    $sql .= " WHERE ACTIVITY.TYPE_CODE = '".$_GET["type"]."'"; 
  }
  if (isset($_GET["detail"]) and $_GET["detail"] != "") {
    $sql .= " AND ACTIVITY.DETAIL_CODE = '".$_GET["detail"]."'";
  }
  if ($_GET["year"] != "" and isset($_GET["year"])) {
    $sql .= " AND SUBSTR(REGISTER_DATE,0, 4) = '".$_GET["year"]."'";
  }

  $sql .= " GROUP BY PROVINCE.PROVINCE_CODE";
  $sql .= " ORDER BY PROVINCE.PROVINCE_CODE";

  if ($sql != "") {
    $result = oci_parse($conn, $sql);
    oci_execute($result);

    $sql_min = "SELECT MIN(CNT) AS MIN_CNT FROM (".$sql.")";
    $result_min = oci_parse($conn, $sql_min);
    oci_execute($result_min);
    $row = oci_fetch_array($result_min, OCI_BOTH);
    $num_min = $row["MIN_CNT"];

    $sql_max = "SELECT MAX(CNT) AS MAX_CNT FROM (".$sql.")";
    $result_max = oci_parse($conn, $sql_max);
    oci_execute($result_max);
    $row = oci_fetch_array($result_max, OCI_BOTH);
    $num_max = $row["MAX_CNT"];

    oci_free_statement($result_min);
    oci_free_statement($result_max);
  }
  if ($num_max > 0) {
    $intervals = IntervalInt($num_min, $num_max, $level);
  }

  $data = array(
    "intervals" => $intervals,
    "data" => array()
  );

  while (($row = oci_fetch_array($result, OCI_BOTH)) != false) {
    $data["data"][] = array(
      "province_code" => $row["PROVINCE_CODE"],
      "cnt" => $row["CNT"],
    );
  }

  if (isset($result)) {
    oci_free_statement($result);
  }

  echo json_encode($data);

  oci_close($conn);
?>