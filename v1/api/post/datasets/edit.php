<?php
// {
//   "datasets": {
//     "1001": {
//       "name": "DATASET_NAME",
//       "country": "Canada",
//       "location": "Vancouver",
//       "year": 2015,
//       "lat": -90 ~ 90,
//       "lng": -180 ~ 180
//     }
//   }
// }
require_once(__DIR__.'./../../models/validators/datasets/editValidator.php');
require_once(__DIR__.'./../../models/dataset.php');

$post->expect('datasets');

if (!is_array($post->datasets))
  Response::error(400, "'datasets' must be an array");
if (count($post->datasets) < 1)
  Response::error(400, "'datasets' array must have at least one item");

validateDatasets($post->datasets);
$map = getDatasetNames(array_keys($post->datasets));

list($updated, $errors) = updateDatasets($post->datasets);

if (count($post->datasets) == 1 && count($errors) == 1) {
  foreach ($errors as $dataset_id => $error)
    Response::error(500, $errors[$dataset_id]);
}

$response = array("updated" => $updated);
if (count($errors) > 0)
  $response['errors'] = $errors;

log_edit_datasets($map, count($updated), count($errors));

Response::success($response);

// Functions
//
//
// ============================================================================

function validateDatasets($datasets) {
  foreach ($datasets as $id => $dataset) {
    if (!is_numeric($id))
      Response::error(400, "'datasets' keys must be numbers");
    if (!is_array($dataset))
      Response::error(400, "'datasets' object must contain objects");
    try {
      validateDataset($dataset);
    } catch (Exception $e) {
      if (count($datasets) > 1)
        Response::error(400, "dataset_id '$id': ".$e->getMessage());
      else
        Response::error(400, $e->getMessage());
    }
  }
}

function validateDataset($dataset) {
  $obj = new DatasetEditValidator($dataset);
}

function updateDatasets ($datasets) {
  $updated = array();
  $errors = array();
  foreach ($datasets as $id => $dataset) {
    try {
      updateDataset($id, $dataset);
      $updated[] = $id;
    } catch (PDOException $e) {
      if ($e->errorInfo[1] == 1062)
        $errors[$id] = "Another dataset has the same name";
      else
        $errors[$id] = "PDOException: ".$e->getMessage();
    }
  }
  return array($updated, $errors);
}

function updateDataset ($id, $dataset) {
  $query = QB::table('datasets');
  $query->where('dataset_id', $id);
  if (isset($dataset['lat']) && $dataset['lat'] == 'NA')
    $dataset['lat'] = null;
  if (isset($dataset['lng']) && $dataset['lng'] == 'NA')
    $dataset['lng'] = null;
  $query->update($dataset);
}

?>
