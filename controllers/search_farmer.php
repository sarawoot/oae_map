<?php
  include("../config/config.php");
  $conn = connectionDB();
  
  $search = array();
  if ($_GET["province"] != "" and isset($_GET["province"])) {
    $search[] = "province_code in ('".join($_GET["province"], "', '")."')";
  }
  // if ($_GET["type"] != "" and isset($_GET["type"])) {
  //   $search[] = "type_code in ('".join($_GET["type"], "', '")."')";
  // }
  if ($_GET["detail"] != "" and isset($_GET["detail"])) {
    $search[] = "detail_name in ('".join($_GET["detail"], "', '")."')";
  }
  // if ($_GET["year"] != "" and isset($_GET["year"])) {
  //   $search[] = "SUBSTR(REGISTER_DATE,0, 4) = '".$_GET["year"]."'";
  // }
  if (count($search) > 0) {
    $search = " where ".join($search, " and ");
  } else {
    $search = "";
  }
  $sql_first = "select * from farmer_area ".$search;
  // echo $sql_first;
  // SQL Count Row
  if ($_GET["total"] == '1') {
    $sql_count = "select count(*) as n from (".$sql_first.") as tb;";
    $result = pg_query($conn, $sql_count);
    $row = pg_fetch_assoc($result);
  } else {
    $offset = 0;
    if ( isset($_GET['page']) ) {
      $offset = (intval($_GET['page']) - 1)*10;
    }
    // pagination
    $sql_first .= " limit 20 offset ".$offset;
    // SQL 
    $sql = "SELECT row_to_json(fc) as fc FROM ( "; 
    $sql .= "    SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ( ";
    $sql .= "      SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json(lp) As properties FROM farmer_area As lg  ";
    $sql .= "        INNER JOIN ( ";
    $sql .= $sql_first;
    $sql .= "        ) As lp ON lg.id = lp.id   ";
    $sql .= "    ) As f  ";
    $sql .= "  )  As fc; ";
    $result = pg_query($conn, $sql);
    $row = pg_fetch_assoc($result);
  }
  echo json_encode($row);
  pg_close($conn);
?>