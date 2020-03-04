<?php
require_once(__DIR__.'./../../models/measurements.php');

$post->expect('measurements');
$measurements = $post->measurements;

validateDeleteMeasurements($measurements);
try {
  $measurementDatasetMap = measurementDatasetMap($measurements);

  deleteMeasurements($measurements);
  log_delete_measurements($measurementDatasetMap, count($measurements), 0);

} catch (PDOException $e) {
  Response::error(500, "PDOException deleting measurements: ".$e->getMessage());
}

Response::success();

function validateDeleteMeasurements($measurements) {
  if (!is_array($measurements) || !isset($measurements[0]))
    Response::error(400, "'measurements' must be an array");
  foreach ($measurements as $measurement_id) {
    if (!is_numeric($measurement_id) || !ctype_digit((string) $measurement_id))
      Response::error(400, "'measurements' must be an array of integer measurement_id");
  }
}
function deleteMeasurements($measurements) {
  $query = QB::table('measurements');
  foreach ($measurements as $measurement_id) {
    $query->orWhere('measurement_id', $measurement_id);
  }
  $query->delete();
}

?>
