<?php
  session_start();
  include('config/config.php');
  if (isset($_POST['username']) and isset($_POST['password'])) {
    $ldap = connectLDAP();
    $ldapbind = ldap_bind($ldap, $_POST['username'], $_POST['password']);
    ldap_close($ldap);
    if ($ldapbind) {
      $conn = connectionDB();
      $res = pg_query($conn, "Select * from users where username = '".$_POST['username']."'");
      $user = pg_fetch_assoc($res);
      if ($user) {
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['full_name'] = $user['full_name'];
        header( "location: ./index.php" );
        exit;
      } else {
        $_SESSION['error'] = 'กรุณาตรวจสอบ ชื่อผู้ใช้งาน และ รหัสผ่าน อีกครั้ง';
      }
      pg_close($conn);
    } else {
      $_SESSION['error'] = 'กรุณาตรวจสอบ ชื่อผู้ใช้งาน และ รหัสผ่าน อีกครั้ง';
    }
  }
  if (isset($_SESSION['user_id'])) {
    header('Location: ./index.php');
  }
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OAE</title>
  <link rel="stylesheet" href="assets/plugins/bootstrap/css/bootstrap.min.css">
  <style>
    body, html {
      height: 100%;
      background-repeat: no-repeat;
      background-image: linear-gradient(rgb(104, 145, 162), rgb(12, 97, 33));
    }

    .card-container.card {
      max-width: 350px;
      padding: 40px 40px;
    }

    .btn {
      font-weight: 700;
      height: 36px;
      -moz-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      cursor: default;
    }

    .card {
      background-color: #F7F7F7;
      /* just in case there no content*/
      padding: 20px 25px 30px;
      margin: 0 auto 25px;
      margin-top: 50px;
      /* shadows and rounded borders */
      -moz-border-radius: 2px;
      -webkit-border-radius: 2px;
      border-radius: 2px;
      -moz-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
      -webkit-box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
      box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
    }

    .profile-img-card {
      width: 96px;
      height: 96px;
      margin: 0 auto 10px;
      display: block;
      -moz-border-radius: 50%;
      -webkit-border-radius: 50%;
      border-radius: 50%;
    }

    /*
     * Form styles
     */
    .profile-name-card {
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      margin: 10px 0 0;
      min-height: 1em;
    }

    .reauth-email {
      display: block;
      color: #404040;
      line-height: 2;
      margin-bottom: 10px;
      font-size: 14px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .form-signin #inputUsername,
    .form-signin #inputPassword {
      direction: ltr;
      height: 44px;
      font-size: 16px;
    }

    .form-signin input[type=email],
    .form-signin input[type=password],
    .form-signin input[type=text],
    .form-signin button {
      width: 100%;
      display: block;
      margin-bottom: 10px;
      z-index: 1;
      position: relative;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }

    .form-signin .form-control:focus {
      border-color: rgb(104, 145, 162);
      outline: 0;
      -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgb(104, 145, 162);
      box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px rgb(104, 145, 162);
    }

    .btn.btn-signin {
      /*background-color: #4d90fe; */
      background-color: rgb(104, 145, 162);
      /* background-color: linear-gradient(rgb(104, 145, 162), rgb(12, 97, 33));*/
      padding: 0px;
      font-weight: 700;
      font-size: 14px;
      height: 36px;
      -moz-border-radius: 3px;
      -webkit-border-radius: 3px;
      border-radius: 3px;
      border: none;
      -o-transition: all 0.218s;
      -moz-transition: all 0.218s;
      -webkit-transition: all 0.218s;
      transition: all 0.218s;
    }

    .btn.btn-signin:hover,
    .btn.btn-signin:active,
    .btn.btn-signin:focus {
      background-color: rgb(12, 97, 33);
    }

    .forgot-password {
      color: rgb(104, 145, 162);
    }

    .forgot-password:hover,
    .forgot-password:active,
    .forgot-password:focus{
      color: rgb(12, 97, 33);
    }    
  </style>
</head>
<body>
  <div class="container">
    <div class="card card-container">
      <img id="profile-img" class="profile-img-card" src="assets/images/avatar_2x.png" />
      <p id="profile-name" class="profile-name-card"></p>
      <?php if (isset($_SESSION['error'])) { ?>
      <div class="alert alert-danger" role="alert"><?php echo $_SESSION['error'] ?></div>
      <?php 
          unset($_SESSION['error']);
        } ?>
      <form class="form-signin" method="post">
        <span id="reauth-email" class="reauth-email"></span>
        <input type="text" id="inputUsername" name="username" class="form-control" placeholder="ชื่อผู้ใช้งาน" required autofocus value="<?php echo $_POST['username']; ?>">
        <input type="password" id="inputPassword" name="password" class="form-control" placeholder="รหัสผ่าน" required>
        <button class="btn btn-lg btn-primary btn-block btn-signin" type="submit">เข้าสู่ระบบ</button>
      </form><!-- /form -->
    </div><!-- /card-container -->
  </div><!-- /container -->

  <!-- Javascript -->
  <script src="assets/plugins/jquery-1.12.4.min.js"></script>
  <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
  <script>
    $( document ).ready(function() {
      loadProfile();
    });

    function getLocalProfile(callback){
      var profileImgSrc      = localStorage.getItem("PROFILE_IMG_SRC");
      var profileName        = localStorage.getItem("PROFILE_NAME");
      var profileReAuthEmail = localStorage.getItem("PROFILE_REAUTH_EMAIL");

      if(profileName !== null
          && profileReAuthEmail !== null
          && profileImgSrc !== null) {
        callback(profileImgSrc, profileName, profileReAuthEmail);
      }
    }

    function loadProfile() {
      if(!supportsHTML5Storage()) { return false; }
      
      getLocalProfile(function(profileImgSrc, profileName, profileReAuthEmail) {
        $("#profile-img").attr("src",profileImgSrc);
        $("#profile-name").html(profileName);
        $("#reauth-email").html(profileReAuthEmail);
        $("#inputUsername").hide();
      });
    }

    function supportsHTML5Storage() {
      try {
          return 'localStorage' in window && window['localStorage'] !== null;
      } catch (e) {
          return false;
      }
    }

    function testLocalStorageData() {
      if(!supportsHTML5Storage()) { return false; }
      localStorage.setItem("PROFILE_IMG_SRC", "//lh3.googleusercontent.com/-6V8xOA6M7BA/AAAAAAAAAAI/AAAAAAAAAAA/rzlHcD0KYwo/photo.jpg?sz=120" );
      localStorage.setItem("PROFILE_NAME", "César Izquierdo Tello");
      localStorage.setItem("PROFILE_REAUTH_EMAIL", "oneaccount@gmail.com");
    }    
  </script>
</body>
</html>