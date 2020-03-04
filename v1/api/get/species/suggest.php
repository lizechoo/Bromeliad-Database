<?php
$get->expect('prefix');
$prefix = $get->prefix;

if (!strlen($prefix))
  Response::error(400, "'prefix' must be provided");

$query = QB::query("SELECT bwg_name FROM species WHERE LOWER(bwg_name) LIKE ?", array("$prefix%"));
$results = $query->get();

if (!count($results))
  Response::success(array(
    "prefix" => ucfirst($prefix),
    "suggestion" => "1"
  ));

$suffices = array();

foreach ($results as $result) {
  $suffix = substr($result->bwg_name, strlen($prefix));

  if (ctype_digit($suffix)) {
    $suffix = intval($suffix);
    $suffices[] = $suffix;
  }
}

if (!count($suffices))
  Response::success(array(
    "prefix" => ucfirst($prefix),
    "suggestion" => "1"
  ));

sort($suffices, SORT_NUMERIC);

Response::success(array(
  "prefix" => ucfirst($prefix),
  "suggestion" => (string) ($suffices[count($suffices) - 1] + 1)
));

?>
