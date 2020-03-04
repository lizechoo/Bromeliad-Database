<?php
$get->expect('bwg_name');
$bwg_name = trim($get->bwg_name);

$query = QB::table('species')->where('bwg_name', '=', $bwg_name);

Response::success(array(
  "bwg_name" => $bwg_name,
  "available" => $query->first() ? false: true
));
?>
