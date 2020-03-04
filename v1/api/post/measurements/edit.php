<?php
/*
{
  "measurements": {
    "1": {
      "value": "small",
      "biomass": {
        "biomass": 123,
        "dry_wet": "wet (or dry)",
        "unit": "g (or mg)"
      }
    },
    "2": {
      "min": 1,
      "max": 2,
      "unit": "g",
      "biomass": ...
    }
  }
}
*/
require_once(__DIR__.'./../../models/measurements.php');

$post->expect('measurements');
$measurements = $post->measurements;

validateUpdateMeasurements($measurements);

list($updated, $errors) = updateMeasurements($measurements);

if (count($errors) == 1 && count($measurements) == 1) {
  foreach ($errors as $error)
    Response::error(500, $error);
}

log_edit_measurements($updated, count($updated), count($errors));

if (count($errors) > 0) {
  Response::success(array(
    "message" => "Some measurements were not updated successfully",
    "errors" => $errors
  ));
} else {
  Response::success();
}

?>
