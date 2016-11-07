<?php
  session_start();
  if (!isset($_SESSION['user_id'])) {
    header( "location: /oae/login.php" );
    $_SESSION['error'] = 'กรุณาทำการเข้าสู่ระบบก่อน';
  }

  function admin() {
    return $_SESSION['role'] == 'admin';
  }

  function guest() {
    return $_SESSION['role'] == 'guest';
  }

  function roleAdmin($value='') {
    if (!admin()) {
      header( "location: /oae/index.php" );
    }
  }
?>