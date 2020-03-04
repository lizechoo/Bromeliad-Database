<?php
require_once(__DIR__.'./../../models/validators/bromeliads/newValidator.php');
require_once(__DIR__.'./../../models/bromeliad.php');

$post->expect('bromeliads');

if (!is_array($post->bromeliads))
  Response::error(400, "'bromeliads' must be an array");
if (count($post->bromeliads) < 1)
  Response::error(400, "'bromeliads' array must have at least one item");

validateBromeliads($post->bromeliads);
list($inserted, $errors) = createBromeliads($post->bromeliads);

if (count($post->bromeliads) == 1 && count($errors) == 1)
  Response::error(500, $errors[0]);

$response = array("inserted" => $inserted);
if (count($errors) > 0)
  $response["errors"] = $errors;

log_create_bromeliads($inserted, count($inserted), count($errors));

Response::success($response);

// Functions
// ===============================================================
function validateBromeliads($bromeliads) {
  $i = 0;
  foreach ($bromeliads as $bromeliad) {
    if (!is_array($bromeliad))
      Response::error(400, "'bromeliads' must be an array of objects");
    try {
      validateBromeliad($bromeliad, false);
    } catch (Exception $e) {
      if (count($bromeliads) > 1)
        Response::error(400, "Row $i: ".$e->getMessage());
      else
        Response::error(400, $e->getMessage());
    }
    $i++;
  }
}

function createBromeliads($bromeliads) {
  $inserted = array();
  $errors = array();
  $i = 0;
  foreach ($bromeliads as $bromeliad) {
    try {
      $inserted[] = createBromeliad($bromeliad);
    } catch (Exception $e) {
      $errors["$i"] = $e->getMessage();
    }
    $i++;
  }
  return array($inserted, $errors);
}

function createBromeliad($bromeliad) {
  if (isset($bromeliad['attributes'])) {
    $attributes = $bromeliad['attributes'];
    unset($bromeliad['attributes']);
  }
  if (isset($bromeliad['detritus'])) {
    $detritus = $bromeliad['detritus'];
    unset($bromeliad['detritus']);
  }
  try {
    $bromeliad_id = QB::table('bromeliads')->insert($bromeliad);
    if (isset($attributes))
      createAttributes($bromeliad_id, $attributes);
    if (isset($detritus))
      createDetritus($bromeliad_id, $detritus);
  } catch (PDOException $e) {
    if ($e->errorInfo[1] == 1452)
      throw new Exception("Visit with 'visit_id' not found");
    else if ($e->errorInfo[1] == 1062)
      throw new Exception("'original_id' is used by another bromeliad");
    else
      throw new Exception("PDOException inserting: ".$e->getMessage());
  }
  return $bromeliad_id;
}

?>
