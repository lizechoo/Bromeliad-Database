<?php
require_once(__DIR__.'/validators/bromeliads/editValidator.php');
require_once(__DIR__.'/validators/bromeliads/newValidator.php');

function getBromeliadVisitDataset($bromeliad_ids) {
  $query = QB::table('bromeliads')->select('bromeliads.bromeliad_id', 'bromeliads.original_id', 'bromeliads.visit_id');

  foreach ($bromeliad_ids as $bromeliad_id)
    $query->orWhere('bromeliads.bromeliad_id', $bromeliad_id);

  $query->join('visits', 'bromeliads.visit_id', '=', 'visits.visit_id', 'left');
  $query->select('visits.visit_id', 'visits.habitat');

  $query->join('datasets', 'visits.dataset_id', '=', 'datasets.dataset_id', 'left');
  $query->select('datasets.dataset_id', 'datasets.name');

  $bromeliads = array();
  /* mappify the query results */
  foreach ($query->get() as $row) {
    $bromeliads[$row->bromeliad_id] = array(
      'original_id' => $row->original_id,
      'visit_id' => $row->visit_id,
      'visit_habitat' => $row->habitat,
      'dataset_id' => $row->dataset_id,
      'dataset_name' => $row->name
    );
  }

  return $bromeliads;
}

function validateBromeliad($bromeliad, $edit) {
  if (isset($bromeliad['attributes'])) {
    $attributes = $bromeliad['attributes'];
    unset($bromeliad['attributes']);
  }

  if (isset($bromeliad['detritus'])) {
    $detritus = $bromeliad['detritus'];
    unset($bromeliad['detritus']);
  }
  if ($edit)
    $validator = new BromeliadEditValidator($bromeliad);
  else
    $validator = new BromeliadNewValidator($bromeliad);
  if (isset($attributes))
    validateAttributes($attributes, $validator->fields);
  if (isset($detritus))
    validateDetritus($detritus);
}


function validateAttributes($attributes, $fields) {
  if (!is_array($attributes))
    throw new Exception("'attributes' must be an object");
  foreach ($attributes as $key => $value) {
    if (is_numeric($key))
      throw new Exception("attribute types cannot be a number");
    if ($key == 'type')
      throw new Exception("attribute types cannot be named as 'type'");
    if ($key == 'value')
      throw new Exception("attribute types cannot be named as 'value'");
    if (array_key_exists($key, $fields))
      throw new Exception("attribute types cannot be one of the standard fields");
  }
}

function validateDetritus($detritus) {
  if (!is_array($detritus))
    throw new Exception("'detritus' must be an array");

  $lastMax = null;

  foreach ($detritus as $row) {
    if (isset($row['min']) && (!is_numeric($row['min']) || !ctype_digit((string) $row['min'])))
      throw new Exception("'min' for detritus dry mass must be an integer");
    if (isset($row['max']) && trim($row['max']) != "")
      if (!is_numeric($row['max']) || !ctype_digit((string) $row['max']))
        throw new Exception("'max' for detritus dry mass must be an integer");
    if (isset($row['mass']) && (!is_numeric($row['mass']) || !($row['mass'] >= 0)))
      throw new Exception("'mass' for detritus dry mass must be a number");
    if (isset($row['min']) && (isset($row['max']) && trim($row['max']) != "") && $row['max'] <= $row['min'])
      throw new Exception("'max' cannot be smaller than 'min'");

    if (isset($row['min']) && isset($lastMax) && $row['min'] != $lastMax)
        throw new Exception("'max' of a row must follow the min of the last row");
    $lastMax = isset($row['max']) ? $row['max'] : null;
  }
}

function createAttributes($bromeliad_id, $attributes) {
  if (count($attributes) == 0)
    return;
  $inserts = array();
  foreach ($attributes as $type => $value) {
    $inserts[] = array(
      "bromeliad_id" => $bromeliad_id,
      "type" => $type,
      "value" => $value
    );
  }
  try {
    QB::table('bromeliads_attr')->insert($inserts);
  } catch (PDOException $e) {
    throw new Exception("PDOException inserting bromeliad attributes: ".$e->getMessage());
  }
}

function createDetritus($bromeliad_id, $detritus) {
  if (count($detritus) == 0) return;

  $inserts = array();
  foreach ($detritus as $row) {
    $inserts[] = array(
      "bromeliad_id" => $bromeliad_id,
      "min" => isset($row['min']) && trim($row['min']) != "" ? $row['min'] : null,
      "max" => isset($row['max']) && trim($row['max']) != "" ? $row['max'] : null,
      "mass" => isset($row['mass']) && trim($row['mass']) != "" ? $row['mass'] : null
    );
  }

  QB::table('bromeliads_detritus')->insert($inserts);
}

?>
