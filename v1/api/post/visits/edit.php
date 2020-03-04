<?php
require_once(__DIR__.'./../../models/validators/visits/editValidator.php');

$post->expect('visits');

if (!is_array($post->visits))
  Response::error(400, "'visits' must be an array");
if (count($post->visits) < 1)
  Response::error(400, "'visits' array must have at least one item");

validateIDExists($post->visits);
validateVisits($post->visits);
list($updated, $errors) = updateVisits($post->visits);

if (count($post->visits) == 1 && count($errors) == 1) {
  foreach ($errors as $visit_id => $error)
    Response::error(500, $error);
}

$response = array("updated" => $updated);
if (count($errors) > 0)
  $response['errors'] = $errors;

log_edit_visits($updated, count($updated), count($errors));

Response::success($response);

// Functions
//
//
// ============================================================================

function validateVisits($visits) {
  foreach ($visits as $id => $visit) {
    if (!is_numeric($id))
      Response::error(400, "'visits' keys must be numbers");
    if (!is_array($visit))
      Response::error(400, "'visits' array must contain objects");
    if (count($visit) < 1)
      Response::error(400, "visit_id '$id' has nothing to update");
    try {
      validateVisit($visit);
    } catch (Exception $e) {
      if (count($visits) > 1)
        Response::error(400, "visit_id '$id': ".$e->getMessage());
      else
        Response::error(400, $e->getMessage());
    }
  }
}

function validateIDExists($visits) {
  $query = QB::table('visits')->select('visit_id');
  foreach ($visits as $visit_id => $visit)
    $query->orWhere('visit_id', $visit_id);

  $results = $query->get();
  $exists = array();
  foreach ($results as $row)
    $exists[] = $row->visit_id;
  foreach ($visits as $visit_id => $visit) {
    if (!in_array($visit_id, $exists))
      Response::error(400, "visit_id: '$visit_id' not found");
  }
}

function validateVisit($visit) {
  $visitEdit = new VisitEditValidator($visit);
}

function updateVisits($visits) {
  $updated = array();
  $errors = array();
  foreach ($visits as $visit_id => $visit) {
    try {
      updateVisit($visit_id, $visit);
      $updated[] = $visit_id;
    } catch (PDOException $e) {
      if ($e->errorInfo[1] == 1452)
        $errors[$visit_id] = "No dataset with dataset_id is found";
      else if ($e->errorInfo[1] == 1062)
        $errors[$visit_id] = "Duplicate habitat in this dataset";
      else
        $errors[$visit_id] = "PDOException: ".$e->getMessage();
    }
  }
  return array($updated, $errors);
}

function updateVisit($visit_id, $visits) {
  $query = QB::table('visits');
  $query->where('visit_id', $visit_id);
  $query->update($visits);
}

?>
