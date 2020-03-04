<?php
$get->expect('dataset_id');

$query = QB::table('measurements')
  ->select('measurements.*')
  ->join('dataset_measurements', 'dataset_measurements.measurement_id', '=', 'measurements.measurement_id', 'inner')
  ->where('dataset_measurements.dataset_id', $get->dataset_id)
  ->join('species', 'species.species_id', '=', 'measurements.species_id', 'inner')
  ->select('species.bwg_name');

$query->setFetchMode(PDO::FETCH_ASSOC);
try {
  $rows = $query->get();
} catch (PDOException $e) {
  Response::error("PDOException getting measurements: ".$e->getMessage());
}
$results = array();

foreach ($rows as $row) {
  $species_id = $row['species_id'];
  $value = array(
    "measurement_id" => $row['measurement_id']
  );

  if (isset($row['biomass'])) {
    $value['biomass'] = array(
      'value' => $row['biomass'],
      'dry_wet' => $row['dry_wet'],
      'unit' => $row['unit']
    );
  }

  $type = $row['category_range'] == 'category' ? 'categories' : 'ranges';
  if ($type == 'categories') {
    $value['value'] = $row['category_value'];
  } else {
    $value['min'] = $row['range_min'];
    $value['max'] = $row['range_max'];
    $value['unit'] = $row['range_unit'];
  }

  if (!isset($results[$species_id])) {
    $results[$species_id] = array(
      "species_id" => $species_id,
      "bwg_name" => $row['bwg_name']
    );
    $results[$species_id][$type] = array($value);
  } else {
    $results[$species_id][$type][] = $value;
  }
}

try {
  Response::success(array_values($results));
} catch (PDOException $e) {
  Response::error(500, "GET /measurements: PDOException: ".$e->getMessage());
}

?>
