<?php
$get->expect('bwg_name');
$bwg_name = $get->bwg_name;

$query = QB::table('species')
  ->select('species_id', 'bwg_name')
  ->where('bwg_name', 'LIKE', "%$bwg_name%");

if (isset($get->limit)) {
  if (!is_numeric($get->limit))
    Response::error(400, "'limit' must be an integer");
  $query->limit($get->limit);
}

try {
  Response::success($query->get());
} catch (PDOException $e) {
  Response::error(500, $e->getMessage());
}
?>
