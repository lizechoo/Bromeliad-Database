<?php
/*
{
  "measurements": {
    "1": {
      bromeliads: {
        "100": 5
        "101": 2
        "102": 'NA'
        "103": null
      }
    }
    "2": ...
    "3": ...
  }
}
*/
require_once(__DIR__.'./../../models/measurements.php');
$post->expect("measurements");

$measurements = $post->measurements;
validateMatrix($measurements);
try {
  updateMatrix($measurements);

  $dataset_map = measurementDatasetMap(array_keys($measurements));
  log_edit_matrix($dataset_map);

  Response::success();
} catch (PDOException $e) {
  $message = $e->getMessage();
  if ($e->errorInfo[1] == 1452) {
    if (strpos($message, "bromeliad_id") != false)
      Response::error(412, "Update failed: a bromeliad_id does not match any bromeliads in database");
    if (strpos($message, "measurement_id") != false)
      Response::error(412, "Update failed: a measurement_id does not match any measurements in database");
  } else {
    Response::error(500, "PDOException editing matrix: ".$message);
  }
}

function updateMatrix($measurements) {
  $abundances = array();
  foreach ($measurements as $measurement_id => $bromeliads) {
    foreach ($bromeliads['bromeliads'] as $bromeliad_id => $count) {
      if (is_string($count) && trim($count) == "")
        $count = null;
      $abundances[] = array(
        "bromeliad_id" => $bromeliad_id,
        "measurement_id" => $measurement_id,
        "count" => $count
      );
    }
  }
  updateAbundances($abundances);
}

function updateAbundances($abundances) {
  $query = QB::table('abundances')
  ->onDuplicateKeyUpdate(array("count" => QB::raw("VALUES(count)")))
  ->insert($abundances);
}

function validateMatrix($measurements) {
  foreach ($measurements as $measurement_id => $bromeliads) {
    if (!is_numeric($measurement_id) || $measurement_id % 1 != 0)
      Response::error(400, "'measurement_id' must be numeric keys");
    if (!isset($bromeliads['bromeliads']))
      Response::error(400, "Each measurement must have an object of bromeliads");
    validateBromeliads($bromeliads['bromeliads']);
  }
}

function validateBromeliads($bromeliads) {
  foreach ($bromeliads as $bromeliad_id => $count) {
    if (!is_numeric($bromeliad_id) || $bromeliad_id % 1 != 0)
      Response::error(400, "'bromeliad_id' must be numeric keys");
    if (!($count == 'NA' || ctype_digit($count)))
      Response::error(400, "'count' must be integer or 'NA'");
  }
}

?>
