<?php
include ("./config/config.php");

$connOracle = connectionOracleDB ();
$result_type = oci_parse ( $connOracle, 'SELECT DISTINCT GROUP_CODE,GROUP_NAME FROM TYPE' );
oci_execute ( $result_type );

$result_year = oci_parse ( $connOracle, 'SELECT distinct SUBSTR(REGISTER_DATE,0, 4) as YEAR FROM PROFILE order by SUBSTR(REGISTER_DATE,0, 4)' );
oci_execute ( $result_year );
?>
<!DOCTYPE html>
<html lang="en">
<head>
<title>OAE</title>
<meta charset="utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport"
	content="width=device-width, initial-scale=1, user-scalable=no" />
<link rel="stylesheet"
	href="assets/plugins/bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" href="assets/plugins/ol3/ol.css">
<link rel="stylesheet"
	href="assets/plugins/select2-4.0.3/dist/css/select2.min.css">
</head>

<body>
	<form id="report-farmer">
		<div class="row">
			<div class="col-md-8 col-sm-8" id="map" style="height: 700px;"></div>

			<div class="col-md-4 col-sm-4"
				style="padding-right: 40px; padding-top: 20px;">
				<div class="form-group">
					<label for="report-type">รายงาน</label> <select id="report-type"
						class="form-control">
						<option value="1">ทะเบียนเกษตรกร</option>
					</select>
				</div>
				<div id="form-list">
					<div class="form-group">
						<label for="type">ปี</label> <select name="year"
							class="form-control" id="farmer-year" select2>
							<option value=""></option>
            <?php
												while ( ($row = oci_fetch_array ( $result_year, OCI_BOTH )) != false ) {
													echo "<option value='" . $row ["YEAR"] . "'>" . iconv ( 'tis-620', 'utf-8', $row ["YEAR"] ) . "</option>";
												}
												?>
          </select>
					</div>
					<div class="form-group">
						<label for="type">ที่ตั้ง</label> <select class="form-control"
							select2>
							<option>ที่ตั้งแปลง</option>
							<option>ที่อยู่ติดต่อ</option>
						</select>
					</div>
					<div class="form-group">
						<label for="type">กลุ่มสินค้า</label> <select
							id="farmer-group-type" name="group-type" class="form-control"
							select2>
							<option value=""></option>
<?php
while ( ($row = oci_fetch_array ( $result_type, OCI_BOTH )) != false ) {
	echo "<option value='" . $row ["GROUP_CODE"] . "'>" . iconv ( 'tis-620', 'utf-8', $row ["GROUP_NAME"] ) . "</option>";
}
?>
          				</select>
					</div>
					<div class="form-group">
						<label for="report-farm-detail">สินค้า</label> <select
							name="detail" id="farmer-detail" class="form-control" select2>
						</select>
					</div>
					<div class="form-group">
						<label for="type">ช่วงอายุ</label>
						<p>
							<select id="farmer-type" style="width: 100px" name="type"
								class="form-control" select2>
							<?php for($i = 1;$i < 130;$i++){?><option value="<?php echo $i?>"><?php echo $i?></option><?php }?></select>
							ถึง <select id="farmer-type" style="width: 100px" name="type"
								class="form-control" select2>
							<?php for($i = 1;$i < 130;$i++){?><option value="<?php echo $i?>"><?php echo $i?></option><?php }?>
						</select>
						</p>
					</div>
					<div class="form-group">
						<label for="type">การถือครองที่ดิน</label>
					</div>
					<div class="form-group">
						<label for="type">แหล่งน้ำ</label>
					</div>


					<button type="submit" class="btn btn-primary">ค้นหา</button>
					<button type="button" id="link-report-farmer"
						class="btn btn-primary">รายงาน</button>

				</div>
			</div>

		</div>
	</form>
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
	<script type="text/javascript">
	$("#farmer-group-type").change(function(){
	    $.ajax({
	      url: "controllers/detail.php",
	      type: 'GET',
	      dataType: "json",
	      data: {
	    	group_code: this.value
	      },
	      success: function(res){
	        var elem = $("#farmer-detail");
	        elem.empty();
	        elem.append($("<option>",{
	          text: '',
	          value: ''
	        }));
	        _.each(res, function(item){
	          elem.append($("<option>",{
	            text: item.name,
	            value: item.code
	          }));
	        });
	      }
	    });
  });
	
  $(function(){
    $("#btn_toggle").click(function(){
      $("#tree").toggle(100);
    });
  });
</script>
</body>
</html>
<?php
oci_free_statement ( $result_type );
oci_close ( $connOracle );
?>