<?php

function getDatasetNames($dataset_ids) {
  $query = QB::table('datasets')->select("dataset_id", "name");
  foreach ($dataset_ids as $dataset_id)
    $query->orWhere('dataset_id', $dataset_id);

  $results = $query->get();
  $map = array();

  foreach ($results as $row)
    $map[$row->dataset_id] = $row->name;

  foreach ($dataset_ids as $dataset_id) {
    if (!array_key_exists($dataset_id, $map))
      Response::error(400, "dataset_id: '$dataset_id' not found");
  }

  return $map;
}

?>
