<?php
/*
 * Get the dataset that a particular species belongs to.
 * Accepts
 *     species_ids: Array of species IDs, separated by comma (,)
 *
 */

if (!isset($get->species_ids))
    Response::error(400, 'Missing species_ids parameter');

$species_ids = $get->species_ids;

if (ctype_digit($species_ids))
    $species_ids = array((int) $species_ids);
else
    $species_ids = explode(',', $species_ids);

if (!is_array($species_ids))
    Response::error(400, 'Parameter species_ids must be an array');

foreach ($species_ids as $species_id) {
    if (!is_integer($species_id) && !ctype_digit($species_id))
        Response::error(400, "Species_ids must be an array of integer species_id");
}

$query = QB::table('measurements');
foreach ($species_ids as $species_id)
    $query->orWhere('measurements.species_id', $species_id);

$query->join('dataset_measurements', 'dataset_measurements.measurement_id', '=', 'measurements.measurement_id', 'left');
$query->join('datasets', 'datasets.dataset_id', '=', 'dataset_measurements.dataset_id', 'left');

$query->select('datasets.dataset_id', 'datasets.name', 'measurements.species_id');
$query->groupBy(array('datasets.dataset_id', 'measurements.species_id'));
$results = $query->get();

$response = array();
foreach ($results as $result) {
  $species_id = $result->species_id;
  $obj = new stdClass();
  $obj->dataset_id = $result->dataset_id;
  $obj->name = $result->name;

  if (isset($response[$species_id]))
    array_push($response[$species_id], $obj);
  else
    $response[$species_id] = array($obj);
}

Response::success($response);
?>
