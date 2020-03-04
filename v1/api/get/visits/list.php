<?php
$query = QB::table('visits')
  ->select('visits.*')
  ->select(QB::raw('datasets.name AS dataset_name'))
  ->join('datasets', 'visits.dataset_id', '=', 'datasets.dataset_id', 'inner');

if (isset($get->dataset_id)) {
  $query->where('visits.dataset_id', $get->dataset_id);
}

if (isset($get->visit_id))
  $query->where('visits.visit_id', $get->visit_id);

try {
  Response::success($query->get());
} catch (PDOException $e) {
  Response::error(500, 'PDOException listing visits: '.$e->getMessage());
}
?>
