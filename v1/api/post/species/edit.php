<?php
// POST JSON body:
// {
//   "species": {
//     "1234": {
//       "changed_field": "new_value"
//       "traits": {
//         "original": "value",
//         "new": "value",
//         ...
//       },
//       "names": ["original", "new", ...]
//     }
//   }
// }
require_once(__DIR__.'./../../models/species.php');
require_once(__DIR__."/../../models/validators/species/editValidator.php");

$post->expect('species');
$species = $post->species;
$errors = array();

if (!is_array($species) || count($species) < 1)
  Response::error(400, "'species' must have at least one row");

$errors = validateInput($species);

if (count($species) == 1 && count($errors) == 1)
  foreach ($errors as $species_id => $error)
    Response::error(400, $error);

if (count($errors) > 0)
  Response::error(400, $errors);

$errors = array();
$updated = array();

try {
  list($errors, $updated) = updateSpecies($species);
} catch (PDOException $e) {
  Response::error(500, $e->getMessage());
}

$response = array();

if (count($species) == 1 && count($errors) > 0) {
  foreach ($errors as $species_id => $error)
    Response::error(500, $error);
}

if (count($errors) > 0)
  $response["errors"] = $errors;
if (count($updated) > 0)
  $response["updated"] = $updated;

log_edit_species($updated, count($updated), count($errors));

Response::success($response);


# HELPERS
# ===============

# validation logic, returns errors array
function validateInput($species) {
  $errors = array();

  getSpeciesNamesFromID(array_keys($species));

  foreach ($species as $species_id => $row) {
    try {
      validateSpecies($row);
    } catch (Exception $e) {
      $errors[$species_id] = $e->getMessage();
    }
  }
  return $errors;
}

function validateSpecies($row) {
  if (isset($row['names'])) {
    $names = $row['names'];
    unset($row['names']);
  }
  if (isset($row['traits'])) {
    $traits = $row['traits'];
    unset($row['traits']);
  }
  if (isset($row['tachet'])) {
    $tachet = $row['tachet'];
    unset($row['tachet']);
  }
  $validator = new SpeciesEditValidator($row);

  if (isset($names))
    validateSpeciesNames($names);
  if (isset($traits))
    validateSpeciesTraits($traits);
  if (isset($tachet))
    validateSpeciesTachet($tachet);
}

function updateSpecies($species) {
  $errors = array();
  $updated = array();
  foreach ($species as $species_id => $row) {
    $data = selectColumns($row);

    $error = NULL;

    if (count($data) > 0) {
      try {
        QB::table('species')->where('species_id', $species_id)->update($data);
      } catch (PDOException $e) {
        if (isset($e->errorInfo) && isset($e->errorInfo[1]) && $e->errorInfo[1] == "1062") {
          if (isset($row['bwg_name']))
            $error = "'".$row['bwg_name']."' is used by another species";
          else
            $error = "Unknown 1062 error ".$e->getMessage();
        } else {
          $error = 'PDOException: '.$e->getMessage();
        }
      }
    }

    if (!isset($error)) {
      try {
        if (isset($row['names']))
          updateSpeciesNames($species_id, $row['names']);
        if (isset($row['traits']))
          updateSpeciesTraits($species_id, $row['traits']);
        if (isset($row['tachet']))
          updateSpeciesTachet($species_id, $row['tachet']);
      } catch (PDOException $e) {
        $error = "Error updating Species: ".$e->getMessage();
      }
    }

    if (isset($error)) {
      $errors[$species_id] = $error;
    } else {
      $updated[] = $species_id;
    }
  }
  return array($errors, $updated);
}

function selectColumns($species) {
  $selected = array();
  foreach (Species::$columns as $column) {
    if (isset($species[$column]))
      $selected[$column] = $species[$column];
  }
  return $selected;
}
?>
