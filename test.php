<?php
  // $ldap = ldap_connect("192.168.1.4", "389") or die("Could not connect to LDAP");
  $ldap = ldap_connect("192.168.1.4", "389") or die("Could not connect to LDAP");
  // $ldapbind = ldap_bind($ldap, 'batman-oae@oae.intra', 'fa198f6ego');//or die("Could not bind to LDAP");
  $ldapbind = @ldap_bind($ldap, 'betime@oae.intra', 'Be@2016oae');//or die("Could not bind to LDAP");
  // @ldap_bind($ldap, $user, $password) or die("Could not bind to LDAP");

  if( $ldapbind )
{
  echo "Success";
} else {
  $errno = ldap_error( $ldap );
  echo $errno;
}
  // echo "Success";
?>