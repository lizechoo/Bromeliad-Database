<?php
require_once(__DIR__.'/dataset.php');

function getVisitsDataset($visit_ids) {
  $query = QB::table('visits')->select('visit_id', 'dataset_id', 'habitat');

  foreach ($visit_ids as $visit_id) {
    $query->orWhere('visit_id', $visit_id);
  }

  $visit_map = array();
  $habitat_map = array();

  foreach ($query->get() as $row) {
    $visit_map[$row->visit_id] = $row->dataset_id;
    $habitat_map[$row->visit_id] = $row->habitat;
  }


  $dataset_map = getDatasetNames(array_values($visit_map));


  foreach ($visit_map as $visit_id => $dataset_id) {
    $visit_map[$visit_id] = array(
      'habitat' => $habitat_map[$visit_id],
      'dataset_id' => $dataset_id,
      'dataset_name' => $dataset_map[$dataset_id]
    );
  }

  return $visit_map;
}

?>
