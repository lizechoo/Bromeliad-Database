<?php
/*
{
  "measurements": [
    {
      "dataset_id": 123
      "species": {
        "1": { "categories": [{'value': 'small'}, {'value': 'medium'}, { "value": "large", "biomass": { "unit": "mg", "value": 12, "dry_wet": "wet" } }] }
        "2": { "ranges": [{ "min": "1", "max": "2", unit: "g", "biomass": { "unit": "mg", "value": 12, "dry_wet": "wet" } }, ...] }
      }
    },
    ..
  ]
}
*/
require_once(__DIR__.'./../../models/measurements.php');

$post->expect('measurements');
$measurements = $post->measurements;

validateMeasurements($measurements);

list($inserted, $errors) = insertMeasurements($measurements, false);

log_create_measurements($inserted, count($inserted), count($errors));

if (count($errors) > 0) {
  Response::success(array(
    "message" => "Some measurements were not inserted because of the following errors",
    "errors" => $errors
  ));
}

Response::success();

?>
