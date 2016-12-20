<?php
  include("../config/config.php");
  $conn = connectionDB();
  
  // SQL intersect
  $sql_intersect = "select id from (select id,";
  $sql_intersect .= "ST_Intersection('SRID=4326;".$_POST["wkt"]."'::geometry,geom) as clipped_geom ";
  $sql_intersect .= "from farmer_area) as tb1 where not ST_IsEmpty(tb1.clipped_geom) ";
  $sql_intersect = "select * from farmer_area where id in (".$sql_intersect.") ";
  if (isset($_POST['year']) and $_POST['year'] != '') {
    $sql_intersect .= " and year = ".$_POST['year'];
  }
  if ($_POST["type"] != "" and isset($_POST["type"])) {
    $sql_intersect .= " and type_code in ('".join($_POST["type"], "', '")."') ";
  }
  if ($_POST["detail"] != "" and isset($_POST["detail"])) {
    $sql_intersect .= " and detail_name in ('".join($_POST["detail"], "', '")."') ";
  }
  // SQL Count Row
  if ($_POST["total"] == '1') {
    $sql_count = "select count(*) as n from (".$sql_intersect.") as tb;";
    $result = pg_query($conn, $sql_count);
    $row = pg_fetch_assoc($result);
  } else {
    $offset = 0;
    if ( isset($_POST['page']) ) {
      $offset = (intval($_POST['page']) - 1)*10;
    }
    // pagination
    $sql_intersect .= "limit 20 offset ".$offset;
    // SQL 
    $sql = "SELECT row_to_json(fc) as fc FROM ( "; 
    $sql .= "    SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features FROM ( ";
    $sql .= "      SELECT 'Feature' As type, ST_AsGeoJSON(lg.geom)::json As geometry, row_to_json(lp) As properties FROM farmer_area As lg  ";
    $sql .= "        INNER JOIN ( ";
    $sql .= $sql_intersect;
    $sql .= "        ) As lp ON lg.id = lp.id   ";
    $sql .= "    ) As f  ";
    $sql .= "  )  As fc; ";
    $result = pg_query($conn, $sql);
    $row = pg_fetch_assoc($result);
  }
  echo json_encode($row);
  pg_close($conn);
?>


