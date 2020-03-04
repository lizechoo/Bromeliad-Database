<?php
require_once(__DIR__.'./../../models/validators/visits/newValidator.php');

$post->expect('visits');

if (!is_array($post->visits))
  Response::error(400, "'visits' must be an array");
if (count($post->visits) < 1)
  Response::error(400, "'visits' array must have at least one item");

validateVisits($post->visits);
list($inserted, $errors, $map) = createVisits($post->visits);

if (count($inserted) == 0)
  Response::error(500, $errors[0]);
else {
  $response = array("inserted" => $inserted);
  if (count($errors) > 0)
    $response['errors'] = $errors;

  log_create_visits($map, count($inserted), count($errors));

  Response::success($response);
}

function validateVisits($visits) {
  $i = 0;
  foreach ($visits as $visit) {
    if (!is_array($visit))
      Response::error(400, "'datasets' must be an array of objects");
    try {
      validateVisit($visit);
    } catch (Exception $e) {
      if (count($visits) > 1)
        Response::error(400, "Row $i: ".$e->getMessage());
      else
        Response::error(400, $e->getMessage());
    }
    $i++;
  }
}

function validateVisit($visit) {
  $obj = new VisitNewValidator($visit);
}

function createVisits($visits) {
  $inserted = array();
  $errors = array();
  $map = array();

  $i = 0;
  foreach ($visits as $visit) {
    try {
      $insert = QB::table('visits')->insert($visit);

      $map[$insert] = $visit['habitat'];
      $inserted[] = $insert;
    } catch (PDOException $e) {
      if ($e->errorInfo[1] == 1452)
        $errors["$i"] = "Dataset with 'dataset_id' not found";
      else if ($e->errorInfo[1] == 1062)
        $errors["$i"] = "Duplicate habitat in this dataset";
      else
        $errors["$i"] = "PDOException inserting visit: ".$e->getMessage();
    }
    $i++;
  }
  return array($inserted, $errors, $map);
}

?>
