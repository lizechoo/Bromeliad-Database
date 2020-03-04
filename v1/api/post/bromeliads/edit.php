<?php
require_once(__DIR__.'./../../models/validators/bromeliads/editValidator.php');
require_once(__DIR__.'./../../models/bromeliad.php');

$post->expect('bromeliads');

if (!is_array($post->bromeliads))
  Response::error(400, "'bromeliads' must be an array");
if (count($post->bromeliads) < 1)
  Response::error(400, "'bromeliads' array must have at least one item");

validateIDExists($post->bromeliads);
validateBromeliads($post->bromeliads);
list($updated, $errors) = updateBromeliads($post->bromeliads);

if (count($post->bromeliads) == 1 && count($errors) == 1) {
  foreach ($errors as $bromeliad_id => $error)
    Response::error(500, $error);
}

$response = array("updated" => $updated);
if (count($errors) > 0)
  $response['errors'] = $errors;

log_edit_bromeliads($updated, count($updated), count($errors));

Response::success($response);

// Functions
//
//
// ============================================================================

function validateBromeliads($bromeliads) {
  foreach ($bromeliads as $id => $bromeliad) {
    if (!is_array($bromeliad))
      Response::error(400, "'bromeliads' array must contain objects");
    if (count($bromeliad) < 1)
      Response::error(400, "bromeliad_id '$id' has nothing to update");
    try {
      validateBromeliad($bromeliad, true);
    } catch (Exception $e) {
      if (count($bromeliads) > 1)
        Response::error(400, "bromeliad_id '$id': ".$e->getMessage());
      else
        Response::error(400, $e->getMessage());
    }
  }
}

function validateIDExists($bromeliads) {
  $query = QB::table('bromeliads')->select('bromeliad_id');
  $first = true;
  foreach ($bromeliads as $bromeliad_id => $bromeliad) {
    if (!is_numeric($bromeliad_id))
      Response::error(400, "'bromeliads' keys must be numbers");
    if ($first)
      $query->where('bromeliad_id', $bromeliad_id);
    else
      $query->orWhere('bromeliad_id', $bromeliad_id);
    $first = false;
  }
  $results = $query->get();
  $exists = array();
  foreach ($results as $row)
    $exists[] = $row->bromeliad_id;
  foreach ($bromeliads as $bromeliad_id => $bromeliad) {
    if (!in_array($bromeliad_id, $exists))
      Response::error(400, "bromeliad_id: '$bromeliad_id' not found");
  }
}

function updateBromeliads($bromeliads) {
  $updated = array();
  $errors = array();
  foreach ($bromeliads as $bromeliad_id => $bromeliad) {
    try {
      $updated[] = updateBromeliad($bromeliad_id, $bromeliad);
    } catch (PDOException $e) {
      if ($e->errorInfo[1] == 1452)
        $errors[$bromeliad_id] = "No bromeliad matches bromeliad_id";
      else if ($e->errorInfo[1] == 1062)
        $errors[$bromeliad_id] = "original_id is used by another bromeliad";
      else
        $errors[$bromeliad_id] = "PDOException: ".$e->getMessage();
    }
  }
  return array($updated, $errors);
}

function updateBromeliad($bromeliad_id, $bromeliad) {
  if (isset($bromeliad['attributes'])) {
    $attributes = $bromeliad['attributes'];
    unset($bromeliad['attributes']);
  }
  if (isset($bromeliad['detritus'])) {
    $detritus = $bromeliad['detritus'];
    unset($bromeliad['detritus']);
  }

  if (count($bromeliad) > 0) {
    $query = QB::table('bromeliads')
      ->where('bromeliad_id', $bromeliad_id)
      ->update($bromeliad);
  }

  if (isset($attributes))
    updateAttributes($bromeliad_id, $attributes);
  if (isset($detritus))
    updateDetritus($bromeliad_id, $detritus);

  return $bromeliad_id;
}

function updateAttributes($bromeliad_id, $attributes) {
  deleteAllAttributes($bromeliad_id);
  createAttributes($bromeliad_id, $attributes);
}

function updateDetritus($bromeliad_id, $detritus) {
  deleteAllDetritus($bromeliad_id);
  createDetritus($bromeliad_id, $detritus);
}

function deleteAllAttributes($bromeliad_id) {
  $query = QB::table('bromeliads_attr')
    ->where('bromeliad_id', $bromeliad_id)
    ->delete();
}

function deleteAllDetritus($bromeliad_id) {
  $query = QB::table('bromeliads_detritus')
    ->where('bromeliad_id', $bromeliad_id)
    ->delete();
}

?>
