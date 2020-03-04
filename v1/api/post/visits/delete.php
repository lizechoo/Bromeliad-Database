<?php
require_once(__DIR__.'./../../models/visit.php');
$post->expect('visits');

if (!is_array($post->visits))
  Response::error(400, "'visits' must be an array");

validateArray($post->visits);

$visit_map = getVisitsDataset($post->visits);

try {
  deleteVisits($post->visits);
} catch (PDOException $e) {
  Response::error(500, "PDOException deleting visits".$e->getMessage());
}

log_delete_visits($visit_map, count($post->visits), 0);

Response::success();

function deleteVisits($visits) {
  $query = QB::table('visits');
  $query->where('visit_id', $visits[0]);
  foreach (array_slice($visits, 1) as $visit_id)
    $query->orWhere('visit_id', $visit_id);
  $query->delete();
}

function validateArray($visits) {
  if (count($visits) < 1) {
    Response::error(400, "No 'visit_id' in bromeliad array");
  }
  foreach ($visits as $visits_id) {
    if (!is_numeric($visits_id))
      Response::error(400, "'visits' must be an array of numeric 'visit_id'");
  }
}

?>
