<?php 
  include("./config/config.php");
  $connOracle = connectionOracleDB();
  $result_type = oci_parse($connOracle, 'SELECT TYPE_CODE, TYPE_NAME FROM TYPE');
  oci_execute($result_type);

  $result_year = oci_parse($connOracle, 'SELECT distinct SUBSTR(REGISTER_DATE,0, 4) as YEAR FROM PROFILE order by SUBSTR(REGISTER_DATE,0, 4)');
  oci_execute($result_year);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>OAE</title>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="assets/plugins/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/plugins/ol3/ol.css">
  <link rel="stylesheet" href="assets/plugins/select2-4.0.3/dist/css/select2.min.css">
</head>
<body>
<div class="row">
  <div class="col-md-8 col-sm-8" id="map" style="height:700px;"></div>
  <div class="col-md-4 col-sm-4" style="padding-right:40px;padding-top:20px;">
    <div class="form-group">
      <label for="report-type">รายงาน</label>
      <select id="report-type" class="form-control">
        <option value="1">ทะเบียนเกษตรกร</option>
      </select>
    </div>
    <div id="form-list">
      <form id="report-farmer">
        <div class="form-group">
          <label for="type">ปี</label>
          <select name="year" class="form-control" id="farmer-year" select2>
            <option value=""></option>
            <?php 
              while (($row = oci_fetch_array($result_year, OCI_BOTH)) != false) {
                echo "<option value='".$row["YEAR"]."'>".iconv('tis-620', 'utf-8', $row["YEAR"])."</option>";
              }
            ?>
          </select>
        </div> 
        <div class="form-group">
          <label for="type">กลุ่มสินค้า</label>
          <select id="farmer-type" name="type" class="form-control"  select2>
            <option value=""></option>
            <?php 
              while (($row = oci_fetch_array($result_type, OCI_BOTH)) != false) {
                echo "<option value='".$row["TYPE_CODE"]."'>".iconv('tis-620', 'utf-8', $row["TYPE_NAME"])."</option>";
              }
            ?>
          </select>
        </div>   
        <div class="form-group">
          <label for="report-farm-detail">สินค้า</label>
          <select name="detail" id="farmer-detail" class="form-control" select2>
          </select>
        </div> 
        <button type="submit" class="btn btn-primary">ค้นหา</button>
        <button type="button" id="link-report-farmer" class="btn btn-primary">รายงาน</button>    
      </form>
    </div>
  </div> 
</div>
<!-- Javascript -->
<script src="assets/plugins/lodash.js"></script>
<script src="assets/plugins/jquery-1.12.4.min.js"></script>
<script src="https://code.jquery.com/jquery-2.0.3.min.js"></script>
<script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
<script src="assets/plugins/select2-4.0.3/dist/js/select2.full.min.js"></script>
<script src="assets/plugins/ol3/ol.js"></script>  
<script src="assets/javascripts/config.js"></script>
<script src="assets/javascripts/report/map.js"></script>  
<script src="assets/javascripts/report/report.js"></script>  
<script>
  $(function(){
    $("#btn_toggle").click(function(){
      $("#tree").toggle(100);
    });
  });
</script>
</body>
</html>
<?php
  oci_free_statement($result_type);
  oci_close($connOracle);
?>