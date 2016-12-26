<?php
  include("../config/config.php");
  function get_members($filter, $user, $password) {
    $ldap_dn = "DC=oae,DC=intra";
    $ldap = connectLDAP();
    @ldap_bind($ldap, $user, $password) or die("Could not bind to LDAP");
    $attributes = array("*");
    $results = ldap_search($ldap, $ldap_dn, "(&(objectCategory=*)(displayName=$filter*))", $attributes,null,4);
    $entries = ldap_get_entries($ldap, $results);
    ldap_close($ldap);
    return $entries;
  }

  $data = array(
    "total_count" => 0,
    "incomplete_results" => false,
    "items" => array() 
  );
  if(($_GET["q"]) != "") {
    $Query = $_GET["q"];
    $i = 0;
    $res = get_members($Query, 'betime@oae.intra', 'Be@2016oae');
    foreach ($res as $row) {
      if (isset($row["displayname"][0])) {
        $data["items"][] = array(
            "id" => $row["displayname"][0],
            "full_name" => $row["displayname"][0],
            "name" => $row["displayname"][0],
            "samaccountname" => $row["samaccountname"][0]
        );
      }
    }
    $data["total_count"] += count($res);
  }
  echo json_encode($data);
?>
