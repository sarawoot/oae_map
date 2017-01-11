<?php
  include("./config/config.php");
  include("./config/auth.php");
  $conn = connectionDB();
  $province = pg_query($conn, "select distinct province_code, province_name from farmer_area order by province_name");
  $detail = pg_query($conn, "select distinct detail_name from farmer_area order by detail_name");
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
  <title>OAE MAP</title>
  <?php require 'templates/stylesheets.php'; ?>
</head>
<body>
  <div class="container">
    <nav class="navbar navbar-fixed-top navbar-default" role="navigation">
      <div class="container">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="./">OAE Map</a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="navbar-collapse">
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown"><span data-type="label_layer"></span> <b class="caret"></b></a>
              <ul class="dropdown-menu" data-type="container_layers" style="z-index:46;">
              </ul>
            </li>
            <li><a href="javascript:void(0)" id="toggle_toolbar">ซ่อนแถบเครื่องมือ</a></li>
          </ul>
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

  <div class="navbar-offset"></div>
  <div id="map"></div>
  <?php require 'templates/map_tool.php'; ?>
  <?php require 'templates/left_menu.php'; ?>
  
  <div id="dialog" title=""></div>
  <?php require 'templates/js_templates/all.php'; ?>
  <script type="text/javascript">
    var role = '<?php echo $_SESSION['role']; ?>';
  </script>
  <?php require 'templates/javascript.php'; ?>

</body>
</html>
<?php
  pg_close($conn);
?>
