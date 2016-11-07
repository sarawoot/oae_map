<?php
  include("../config/config.php");
  $conn = connectionDB();
  
  // SQL intersect
  $sql_intersect = "select id from (select id,";
  $sql_intersect .= "ST_Intersection('SRID=4326;".$_GET["wkt"]."'::geometry,geom) as clipped_geom ";
  $sql_intersect .= "from farmer_area) as tb1 where not ST_IsEmpty(tb1.clipped_geom) ";
  $sql_intersect = "select * from farmer_area where id in (".$sql_intersect.") ";
  // SQL Count Row
  if ($_GET["total"] == '1') {
    $sql_count = "select count(*) as n from (".$sql_intersect.") as tb;";
    $result = pg_query($conn, $sql_count);
    $row = pg_fetch_assoc($result);
  } else {
    $offset = 0;
    if ( isset($_GET['page']) ) {
      $offset = (intval($_GET['page']) - 1)*10;
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


