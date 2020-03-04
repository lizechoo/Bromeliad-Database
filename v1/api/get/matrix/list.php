<?php
/*
{
  "species": {
    "1": {
      "bwg_name": "Coleopetra.1",
      "type": "categories",
      "biomass": {
        "small": 1,
        "medium": 10
      },
      "measurements": {
        "small": {
          "measurement_id": 1,
          "bromeliads": {
            "1": 23,
            "2": 32
            ...
          },
        },
        "medium": {...}
        "large": {...}
      }
    }
  }
}
*/



$get->expect('dataset_id');
$dataset_id = $get->dataset_id;
try {
  $measurements = getMeasurements($dataset_id);
  $bromeliads = getBromeliads($dataset_id);
  $abundances = getAbundances($dataset_id);
} catch (PDOException $e) {
  Response::error(500, 'PDOException loading matrix: '.$e->getMessage());
}

$results = array();

// foreach ($bromeliads as $bromeliad) {
//   $bromeliad_id = $bromeliad['bromeliad_id'];
//   $results[$bromeliad_id] = array("original_id" => $bromeliad['original_id']);
//   // $results[$bromeliad_id]['measurements']
// }
$bromeliads_array = array();

foreach ($bromeliads as $bromeliad) {
  $bromeliads_array[$bromeliad->bromeliad_id] = null;
}

$abundances_map = array();

foreach ($abundances as $abundance) {
  $bromeliad_id = $abundance->bromeliad_id;
  $measurement_id = $abundance->measurement_id;
  if (!isset($abundances_map[$bromeliad_id]))
    $abundances_map[$bromeliad_id] = array();
  $abundances_map[$bromeliad_id][$measurement_id] = $abundance->count;
}

foreach ($measurements as $measurement) {
  $species_id = $measurement->species_id;

  if (!isset($results[$species_id])) {
    $results[$species_id] = array(
      "bwg_name" => $measurement->bwg_name,
      "measurements" => array());
  }

  $abundances_array = array();
  foreach ($bromeliads_array as $bromeliad_id => $value) {
    if (isset($abundances_map[$bromeliad_id][$measurement->measurement_id]))
      $abundances_array[$bromeliad_id] = $abundances_map[$bromeliad_id][$measurement->measurement_id];
    else {
      $abundances_array[$bromeliad_id] = "NA";
    }
  }

  $mObj = array();
  if ($measurement->category_range == 'category')
    $mObj = array('value' => $measurement->category_value);
  else
    $mObj = array('min' => $measurement->range_min, 'max' => $measurement->range_max, 'unit' => $measurement->range_unit);

  $results[$species_id]["measurements"][$measurement->measurement_id] =
    array("category_range" => $measurement->category_range,
          "measurement" => $mObj,
          "bromeliads" => $abundances_array);
}


Response::success(array("species" => $results));

function getMeasurements($dataset_id) {
  return QB::table('measurements')
    ->select('measurements.measurement_id', 'measurements.species_id',
    'measurements.category_range', 'measurements.range_min', 'measurements.range_max',
    'measurements.range_unit', 'measurements.category_value')
    ->join('dataset_measurements', 'dataset_measurements.measurement_id', '=',
    'measurements.measurement_id', 'inner')
    ->where('dataset_measurements.dataset_id', $dataset_id)
    ->join('species', 'species.species_id', '=', 'measurements.species_id', 'inner')
    ->select('species.bwg_name')
    ->get();
}

function getBromeliads($dataset_id) {
   $res = QB::table('bromeliads')
    ->select('bromeliads.bromeliad_id', 'bromeliads.original_id')
    ->join('visits', 'visits.visit_id', '=', 'bromeliads.visit_id', 'inner')
    ->where('visits.dataset_id', $dataset_id)
    ->get();

   if (count($res) < 1)
     Response::error(412, "NO_BROMELIADS");
   else
     return $res;
}

function getAbundances($dataset_id) {
  return QB::table('abundances')
    ->select('abundances.*')
    ->join('dataset_measurements', 'dataset_measurements.measurement_id', '=',
    'abundances.measurement_id', 'inner')
    ->where('dataset_measurements.dataset_id', $dataset_id)
    ->get();
}

?>
