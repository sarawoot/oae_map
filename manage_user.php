<?php
  include("./config/auth.php");
  roleAdmin();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OAE</title>
  <link rel="stylesheet" href="assets/plugins/bootstrap/css/bootstrap.min.css">
  <link rel="stylesheet" href="assets/plugins/font-awesome/css/font-awesome.min.css">
  <link rel="stylesheet" href="assets/plugins/select2-4.0.3/dist/css/select2.min.css">
  <link rel="stylesheet" href="assets/plugins/select2-4.0.3/dist/css/s2-docs.css">
  <link rel="stylesheet" href="assets/plugins/bootstrap-select-1.11.2/dist/css/bootstrap-select.min.css">
  <link rel="stylesheet" href="assets/plugins/Datatables/datatables.min.css"/>
  <style>
    body, html {
      padding-top: 50px;
    }
  </style>
</head>
<body>
  <nav class="navbar navbar-fixed-top navbar-default" role="navigation">
    <div class="container">
      <!-- Brand and toggle get grouped for better mobile display -->
      <div class="navbar-header">
        <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        </button>
        <a class="navbar-brand" href="/oae">OAE Map</a>
      </div>
      <!-- Collect the nav links, forms, and other content for toggling -->
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">
          <li class="dropdown">
            <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><?php echo $_SESSION['full_name']; ?> <span class="caret"></span></a>
            <ul class="dropdown-menu">
              <?php if (admin()) { ?>
              <li><a href="manage_user.php">จัดการผู้ใช้งาน</a></li>
              <?php } ?>
              <li><a href="controllers/logout.php">ออกจากระบบ</a></li>
            </ul>
            </li>
        </ul>
        </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
    </div>
  </nav>
  <div class="container">
    <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#add-user">เพิ่ม</button>
    <div style="clear:both;"></div><br>

    <div id="add-user" class="collapse">
      <form method="POST" id="form">
        <div class="col-md-6">
          <div class="form-group">
            <label>เลือก</label>
            <select class="js-data-example-ajax" id="select2" style="width:100%;z-index: 500;">
            </select>
          </div>
          <div class="form-group">
            <label>ชื่อ - นามสกุล</label>
            <input type="text" class="form-control" id="full_name" readonly name="full_name">
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>ชื่อผู้ใช้งาน</label>
            <input type="text" class="form-control" id="username" readonly  name="username">
          </div>
          <div class="form-group">
            <label>สิทธิการใช้งาน</label><br />
            <select class="selectpicker" name="role" id="role">
              <option value="admin">ผู้ดูแลระบบ</option>
              <option value="guest">ผู้ใช้งานทั่วไป</option>
            </select>&nbsp;&nbsp;&nbsp;&nbsp;
          </div>
        </div>
        <input type="submit" class="btn btn-primary" value="เพิ่มข้อมูล" id="Submit" onclick="javascripts: return check();">
      </form>
      <br><br>
    </div>
    <div id="dttable"></div>
</div>
  <script src="assets/plugins/lodash.js"></script>
  <script src="assets/plugins/jquery-1.12.4.min.js"></script>
  <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
  <script src="assets/plugins/select2-4.0.3/dist/js/select2.min.js"></script>
  <script src="assets/plugins/bootstrap-select-1.11.2/dist/js/bootstrap-select.min.js"></script>
  <script type="text/javascript" src="assets/plugins/DataTables/datatables.min.js"></script>
  <script src="assets\plugins\bootbox.min.js"></script>
  <script src="assets\javascripts\users.js"></script>
</body>
</html>
