<?php
  function connectionDB() {
    $conn_string = "host=192.168.0.202 port=5432 dbname=oae user=postgres password=P@ssw0rd";
    $conn = pg_connect($conn_string);
    if (!$conn) {
      echo "Postgresql error occurred.\n";
      exit;
    }
    return $conn;
  }

  function connectionOracleDB() {
    putenv("NLS_LANG=AMERICAN_AMERICA.TH8TISASCII");
    $conn = oci_connect('OAE', 'AdminOae', '192.168.0.228/OAEDB');
    if (!$conn) {
      echo "Oracle error occurred.\n";
      exit;
    }
    return $conn;
  }

  function connectLDAP(){
    $ldap = ldap_connect("192.168.0.3", "389") or die("Could not connect to LDAP");
    return $ldap;
  }

  function uploadFile($name){
    $target_dir = "../uploads/";
    $ext = pathinfo($_FILES[$name]["name"],PATHINFO_EXTENSION);
    $file_name = (time()*rand(1,10000000)).".".$ext;
    $target_file = $target_dir.$file_name;
    $origin_name =  basename($_FILES[$name]["name"]);
    if (move_uploaded_file($_FILES[$name]["tmp_name"], $target_file)) {
      return array(
        "name" => $origin_name,
        "path" => "uploads/".$file_name,
      );
    } else {
      return false;
    }
  }

?>