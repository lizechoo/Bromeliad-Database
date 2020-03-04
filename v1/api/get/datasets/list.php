<?php
$query = QB::table('datasets')
  ->join('visits', 'visits.dataset_id', '=', 'datasets.dataset_id', 'LEFT')
  ->join('bromeliads', 'bromeliads.visit_id', '=', 'visits.visit_id', 'LEFT')
  ->join('dataset_measurements', 'dataset_measurements.dataset_id', '=', 'datasets.dataset_id', 'LEFT')
  ->join('measurements', 'measurements.measurement_id', '=', 'dataset_measurements.measurement_id', 'LEFT')
  ->join('species', 'species.species_id', '=', 'measurements.species_id', 'LEFT')
  ->select('datasets.*')
  ->select(QB::raw('COUNT(DISTINCT species.species_id) as num_species'))
  ->select(QB::raw('COUNT(DISTINCT visits.visit_id) as num_visits'))
  ->select(QB::raw('COUNT(DISTINCT bromeliads.bromeliad_id) as num_bromeliads'))
  ->groupBy('datasets.dataset_id', 'species.species_id');

if (isset($get->dataset_id))
  $query->where('datasets.dataset_id', $get->dataset_id);

try {
  Response::success($query->get());
} catch (PDOException $e) {
  Response::error(500, 'GET /datasets (PDOException: '.$e->getMessage().')');
}
?>
