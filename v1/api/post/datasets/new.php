<?php
// {
//   "datasets": [
//     {
//       "name": "DATASET_NAME",
//       "country": "Canada",
//       "location": "Vancouver",
//       "year": 2015,
//       "lat": -90 ~ 90,
//       "lng": -180 ~ 180
//     }
//   ]
// }
require_once(__DIR__.'./../../models/validators/datasets/newValidator.php');

$post->expect('datasets');

if (!is_array($post->datasets))
  Response::error(400, "'datasets' must be an array");
if (count($post->datasets) < 1)
  Response::error(400, "'datasets' array must have at least one item");

validateDatasets($post->datasets);
list($inserted, $errors, $map) = insertDatasets($post->datasets);

if (count($post->datasets) == 1 && count($errors) == 1) {
  foreach ($errors as $row => $error) {
    Response::error(500, $error);
  }
}

if (count($post->datasets) > 1 && count($inserted) == 0)
  Response::error(500, $errors);

$response = array("inserted" => $inserted);
if (count($errors) > 0)
  $response['errors'] = $errors;

/*
  write to log
*/
log_create_datasets($map, count($inserted), count($errors));

Response::success($response);

// Functions
//
//
//
// ==============================================================

function insertDatasets($datasets) {
  $inserted = array();
  $errors = array();
  $map = array();
  $i = 0;
  foreach ($datasets as $dataset) {
    try {
      $insert_id = (int) insertDataset($dataset);
      $inserted[] = $insert_id;

      $map[$insert_id] = $dataset['name'];

    } catch (Exception $e) {
      $errors["Row $i"] = $e->getMessage();
    }
    $i++;
  }
  return array($inserted, $errors, $map);
}

function insertDataset($dataset) {
  $query = QB::table('datasets');
  try {
    return $query->insert($dataset);
  } catch (PDOException $e) {
    if ($e->errorInfo[1] == 1062)
      throw new Exception("A dataset with the same 'name' already exists");
    else
      throw new Exception("PDOException inserting dataset: ".$e->getMessage());
  }
}

function validateDatasets($datasets) {
  foreach ($datasets as $dataset) {
    if (!is_array($dataset))
      Response::error(400, "'datasets' must be an array of objects");
    validateDataset($dataset);
  }
}

function validateDataset($dataset) {
  try {
    $dataset_obj = new DatasetNewValidator($dataset);
  } catch (Exception $e) {
    Response::error(400, $e->getMessage());
  }
}
?>
