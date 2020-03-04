<?php
/*
{
  "measurements": [
    {
      "dataset_id": 123,
      "species": "all" // delete all measurement from this dataset
    },
    {
      "dataset_id": 321,
      "species": [111,222,333] // only these species will be deleted
    }
  ]
}
*/
require_once(__DIR__.'./../../models/measurements.php');
require_once(__DIR__.'./../../models/dataset.php');

$post->expect('measurements');
$measurements = $post->measurements;

if (!is_array($measurements))
  Response::error(400, "'measurements' field must be an array");
if (count($measurements) == 0)
  Response::error(400, "'measurements' array must have at least 1 element");

validateDeleteMeasurements($measurements);

try {

  $deleted = deleteMeasurements($measurements);

  $dataset_map = getDatasetNames($deleted);
  log_delete_measurements($dataset_map, null, 0);

  Response::success();

} catch (PDOException $e) {
  Response::error(500, "PDOException deleting measurements: ".$e->getMessage());
}

function validateKey($value) {
  return is_numeric($value) && ($value % 1 == 0);
}

function validateDeleteMeasurements($measurements) {
  foreach ($measurements as $dataset) {
    if (!isset($dataset['dataset_id']))
      Response::error(400, "Each measurement object must have 'dataset_id' field");
    if (!validateKey($dataset['dataset_id']))
      Response::error(400, "'dataset_id' must be an integer key");
    if (!isset($dataset['species']))
      Response::error(400, "Each measurement object must have 'species' field");
    if (is_array($dataset['species'])) {
      if (count($dataset['species']) == 0)
        Response::error(400, "'species' array must have at least 1 species_id");
      foreach ($dataset['species'] as $species_id) {
        if (!validateKey($species_id))
          Response::error(400, "'species' must be an array of integer keys");
      }
    } else if ($dataset['species'] != 'all') {
      Response::error(400, "'species' must either be an array of integer keys or 'all'");
    }
  }
}

function deleteMeasurements($measurements) {
  $deleted = array();

  foreach ($measurements as $dataset) {
    $dataset_id = $dataset['dataset_id'];

    if ($dataset['species'] == 'all')
      removeAllMeasurements($dataset_id);
    else {
      foreach ($dataset['species'] as $species_id) {
        removeMeasurements($species_id, $dataset_id);
      }
    }

    $deleted[] = $dataset_id;
  }

  return $deleted;
}

?>
