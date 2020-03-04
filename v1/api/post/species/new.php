<?php
// POST JSON body:
// {
//   "species": [
//     {
//       bwg_name: "XYZ", ...
//     },
//     ...
//   ]
// }
require_once(__DIR__."/../../models/validators/species/newValidator.php");
require_once(__DIR__.'./../../models/species.php');

if (isset($get->log_id) && !is_numeric($get->log_id))
  Response::error(400, "log_id must be numeric");

if (isset($get->log_id))
  $log_id = $get->log_id;
else
  $log_id = NULL;


$post->expect("species");
$species = $post->species;
$errors = array();

$errors = validateInput($species); // $errors is an stdClass object

if (count((array) $errors) > 0)
  Response::error(400, array_values((array) $errors)[0]);

$duplicates = NULL;
$inserted = array();

try {
  list($inserted, $duplicates) = insertSpecies($species);
} catch (PDOException $e) {
  Response::error(500, $e->getMessage());
}

if (count($species) == 1 && count($duplicates) > 0) {
  $bwg_code = $species[0]['bwg_name'];
  Response::error(500, "A species with BWG code '$bwg_code' already exists");
}

log_create_species($inserted, count($inserted), count($duplicates), $log_id);

Response::success(array(
  "inserted" => array_keys($inserted),
  "duplicates" => $duplicates
));

# HELPERS
# ===============

# validation logic, returns errors object
function validateInput($species) {
  if (!is_array($species))
    Response::error(400, "'species' must be an array");
  if (count($species) == 0)
    Response::error(400, "'species' must have at least one row");

  $count = 0;
  $errors = new stdClass();
  foreach ($species as $row) {
    try {
      validateSpecies($row);
    } catch (Exception $e) {
      $errors->{$count} = $e->getMessage();
    }
    $count++;
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
  $validator = new SpeciesNewValidator($row);
  if (isset($names))
    validateSpeciesNames($names);
  if (isset($traits))
    validateSpeciesTraits($traits);
  if (isset($tachet))
    validateSpeciesTachet($tachet);
}

function insertSpecies($species) {
  $duplicates = array();
  $inserted = array();
  $i = 0;
  foreach ($species as $row) {
    $insert = selectColumns($row);
    $update = array(
      "species_id" => QB::raw('species_id')
    );
    $species_id = QB::table('species')->onDuplicateKeyUpdate($update)->insert($insert);
    if (isset($species_id)) {
      $inserted[$species_id] = $row['bwg_name'];
      if (isset($row['names']))
        insertSpeciesNames($species_id, $row['names']);
      if (isset($row['traits']))
        insertSpeciesTraits($species_id, $row['traits']);
      if (isset($row['tachet']))
        insertSpeciesTachet($species_id, $row['tachet']);
    } else {
      $duplicates[] = $i;
    }
    $i++;
  }
  return array($inserted, $duplicates);
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
