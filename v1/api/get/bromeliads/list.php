<?php
$query = QB::table('bromeliads')
  ->select('bromeliads.*')
  ->join('bromeliads_attr', 'bromeliads_attr.bromeliad_id', '=', 'bromeliads.bromeliad_id', 'left')
  ->select('bromeliads_attr.type', 'bromeliads_attr.value')
  ->join('bromeliads_detritus', 'bromeliads_detritus.bromeliad_id', '=', 'bromeliads.bromeliad_id', 'left')
  ->select('bromeliads_detritus.min', 'bromeliads_detritus.max', 'bromeliads_detritus.mass');

if (isset($get->visit_id) && isset($get->dataset_id))
  Response::error(400, "visit_id and dataset_id cannot be used at the same time");

if (isset($get->visit_id))
  $query->where('bromeliads.visit_id', $get->visit_id);

if (isset($get->dataset_id)) {
  $query->join('visits', 'visits.visit_id', '=', 'bromeliads.visit_id', 'inner');
  $query->where('visits.dataset_id', $get->dataset_id);
}

if (isset($get->bromeliad_id)) {
  $query->where('bromeliads.bromeliad_id', $get->bromeliad_id);
}

$stmt = $query->getPDOStatement();
$objects = array('attributes' => array('key' => 'type', 'value' => 'value'));

$bromeliads = groupArraysObjects($stmt, 'bromeliad_id', array(), array("detritus" => array("min", "max", "mass")), $objects, array());

try {
  Response::success($bromeliads);
} catch (PDOException $e) {
  Response::error(500, 'PDOException listing bromeliads: '.$e->getMessage());
}
?>
