<?php 
  include("../config/config.php");
  // $conn = connectionOracleDB();
  // $result = oci_parse($conn, 'SELECT distinct SUBSTR(REGISTER_DATE,0, 4) as YEAR FROM PROFILE order by SUBSTR(REGISTER_DATE,0, 4)');
  // oci_execute($result);
  // $res = array();
  // while (($row = oci_fetch_array($result, OCI_BOTH)) != false) {
  //   $res[] =  array(
  //     "name" => iconv('tis-620', 'utf-8', $row["YEAR"]),
  //     "code" => $row["YEAR"]
  //   );
  // }
  // echo json_encode($res);
  // oci_free_statement($result);
  // oci_close($conn);

  $conn = connectionDB();
  $result = pg_query($conn, "SELECT distinct year FROM farmer_area order by year");
  $data = array();
  while ($row = pg_fetch_assoc($result)) {
    $data[] =  array(
      "name" => $row['year'],
      "code" => $row["year"]
    );
  }
  echo json_encode($data);
  pg_close($conn);

?>