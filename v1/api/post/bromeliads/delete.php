<?php
require_once(__DIR__.'./../../models/bromeliad.php');

$post->expect('bromeliads');

if (!is_array($post->bromeliads))
  Response::error(400, "'bromeliads' must be an array");

validateArray($post->bromeliads);

$bromeliad_map = getBromeliadVisitDataset($post->bromeliads);

try {
  deleteBromeliads($post->bromeliads);
} catch (PDOException $e) {
  Response::error(500, "PDOException deleting bromeliads".$e->getMessage());
}

log_delete_bromeliads($bromeliad_map, count($post->bromeliads), 0);

Response::success();

function deleteBromeliads($bromeliads) {
  $query = QB::table('bromeliads');
  $query->where('bromeliad_id', $bromeliads[0]);
  foreach (array_slice($bromeliads, 1) as $bromeliad_id)
    $query->orWhere('bromeliad_id', $bromeliad_id);
  $query->delete();
}

function validateArray($bromeliads) {
  if (count($bromeliads) < 1) {
    Response::error(400, "No 'bromeliad_id' in bromeliads array");
  }
  foreach ($bromeliads as $bromeliad_id) {
    if (!is_numeric($bromeliad_id))
      Response::error(400, "'bromeliads' must be an array of numeric 'bromeliad_id'");
  }
}

?>
