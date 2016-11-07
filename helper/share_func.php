<?php
  // function IntervalFloat($num_min, $num_max, $level) {
  //   $num_min = ceil($num_min);
  //   $num_max = ceil($num_max);
  //   $range = ceil((($num_max - $num_min) + 1)/$level);
  //   $num_max = $level*$range;
  //   $tmp = $num_min;
  //   $arr = array();
  //   for ($i=0; $i < $level; $i++) { 
  //     $first = $tmp;
  //     $last = ($first+$range)-1;
  //     $tmp = $last;
  //     $arr[] = (array($first, $last));
  //   }
  //   return $arr;
  // }


  function IntervalInt($num_min, $num_max, $level) {
    $num_min = floor($num_min);
    $num_max = ceil($num_max);
    $max_tmp = $num_max;
    $num_min = ceil($num_min);
    $num_max = ceil($num_max);
    $range = ceil((($num_max - $num_min) + 1)/$level);
    if ($num_min == 0) {
      $range += 1;
    }
    $num_max = $level*$range;
    if ($num_max < $max_tmp) {
      $range += 1;
    }
    $tmp = $num_min;
    $arr = array();
    for ($i=0; $i < $level; $i++) { 
      $first = $tmp;
      $last = ($first+$range)-1;
      $tmp = $last+1;
      $arr[] = array($first, $last);
    }
    return $arr;
  }
?>