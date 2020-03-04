<?php
// {
//   datasets: ["1000","1001", ...]
// }
require_once(__DIR__.'./../../models/dataset.php');

$post->expect("datasets");

validateDatasetArray($post->datasets);
$map = getDatasetNames($post->datasets);

try {
  deleteDatasets($post->datasets);
} catch (PDOException $e) {
  Response::error(500, 'PDOException deleting datasets: '.$e->getMessage());
}

log_delete_datasets($map, count($post->datasets), 0);

Response::success();

function deleteDatasets($dataset_ids) {
  $query = QB::table('datasets');

  foreach ($dataset_ids as $dataset_id)
    $query->orWhere('dataset_id', $dataset_id);

  $query->delete();
}

function validateDatasetArray($datasets) {
  if (!is_array($datasets))
    Response::error(400, "'datasets' must be an array");
  if (count($datasets) < 1)
    Response::error(400, "'datasets' array must contain at least one dataset_id");

  foreach ($datasets as $dataset_id) {
    if (!is_numeric($dataset_id))
      Response::error(400, "'datasets' must be an array of integers");
  }
}



?>
