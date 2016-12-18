<?php
include ("../../config/config.php");

$conn = connectionDB ();
if (isset ( $_GET ['tb_idn'] ) && $_GET ['tb_idn'] != '') {
  $sql = "SELECT CONCAT('จังหวัด ' || pv_tn || '<br>อำเภอ ' || ap_tn || '<br>ตำบล ' || tb_tn ) as n FROM public.tambons where tb_idn = '" . (( int ) $_GET ['tb_idn']) . "'";
} else if (isset ( $_GET ['ap_idn'] ) && $_GET ['ap_idn'] != '') {
  $sql = "SELECT CONCAT('จังหวัด ' || pv_tn ||( CASE WHEN pv_idn = '10' THEN '<br>เขต ' ELSE '<br>อำเภอ ' END ) || ap_tn  ) as n
          FROM public.amphoes where ap_idn ='" . (( int ) $_GET ['ap_idn']) . "'";
} else {
  $sql = "SELECT CONCAT('จังหวัด ' || name_thai   ) as n FROM provinces where prov_code = '" . (( int ) $_GET ['prov_code']) . "';";
}
$result = pg_query ( $conn, $sql );
$row = pg_fetch_assoc ( $result );
echo ($row ['n']);
?>