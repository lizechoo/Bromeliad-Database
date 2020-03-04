<?php
require_once(__DIR__."/tachet.php");

$tachet_list;

function getTachetList() {
  global $tachet_list;

  if (isset($tachet_list)) return $tachet_list;
  require_once(__DIR__."/tachet.php");
  $tachet_list = array();

  $tachet_traits = getTachetTraits();
  foreach ($tachet_traits as $row) {
    $tachet_list[] = $row['trait'];
  }
  return $tachet_list;
}

function getSpeciesNamesFromID($species_ids) {
  $query = QB::table('species')->select('species_id', 'bwg_name');
  $speciesMap = array();

  foreach ($species_ids as $species_id)
    $query->orWhere('species_id', $species_id);

  foreach ($query->get() as $row)
    $speciesMap[$row->species_id] = $row->bwg_name;

  foreach ($species_ids as $species_id) {
    if (!array_key_exists($species_id, $speciesMap))
      Response::error(400, "species_id: '$species_id' not found");
  }

  return $speciesMap;
}

function validateSpeciesNames($names) {
  if (!is_array($names))
    throw new SpeciesException("'names' field must be an array");
  foreach ($names as $name) {
    if (!is_string($name))
      throw new SpeciesException("'names' field must be an array of string");
  }
}

function validateSpeciesTraits($traits) {
  if (!is_array($traits))
    throw new SpeciesException("'traits' field must be an object");
  foreach ($traits as $key => $trait) {
    if (!is_string($key))
      throw new SpeciesException("trait keys must be string");
  }
}

function validateSpeciesTachet($tachet) {
  $tachet_list = getTachetList();

  if (!is_array($tachet))
    throw new SpeciesException("'tachet' field must be an object");
  foreach ($tachet as $key => $value) {
    if (!is_string($key))
      throw new SpeciesException("tachet keys must be string");
    if (!in_array($key, $tachet_list))
      throw new SpeciesException("tachet $key does not exist");
    if (!isValidTachetValue($value)) {
      throw new SpeciesException("tachet value must be 'NA' or 0-3");
    }
  }
}

function isValidTachetValue($value) {
  if ($value == 'NA' || trim($value) == "")
    return true;
  if (ctype_digit((string) $value) && $value >= 0 && $value <= 3)
    return true;
  return false;
}

function insertSpeciesNames($species_id, $names) {
  $data = array();
  foreach ($names as $name) {
    if ($name != 'NA') {
      $data[] = array(
        'species_id' => $species_id,
        'name' => "'".addslashes($name)."'"
      );
    }
  }

  if (count($data) == 0) return;
  $query = build_insert_batch("species_names", $data);

  executeRawQuery($query);
}

function insertSpeciesTraits($species_id, $traits) {
  $data = array();
  foreach ($traits as $type => $value) {
    if ($value != 'NA') {
      $data[] = array(
        'species_id' => $species_id,
        'type' => "'$type'",
        'value' => "'$value'"
      );
    }
  }
  if (count($data) == 0) return;
  $query = build_insert_batch("species_traits", $data);

  executeRawQuery($query);
}

function insertSpeciesTachet($species_id, $tachet) {
  $data = $tachet;
  $data['species_id'] = $species_id;

  QB::table('species_tachet')->insert($data);
}


function updateSpeciesNames($species_id, $names) {
  $inserts = array();
  foreach ($names as $name) {
    if ($name != 'NA') {
      $inserts[] = array(
        'species_id' => $species_id,
        'name' => $name
      );
    }
  }
  try {
    QB::table('species_names')->where('species_id', $species_id)->delete();
    if (count($inserts) > 0)
      QB::table('species_names')->insert($inserts);
  } catch (PDOException $e) {
    Response::error(500, "Error updating names: ".$e->getMessage());
  }
}

function updateSpeciesTraits($species_id, $traits) {
  $inserts = array();
  foreach ($traits as $type => $value) {
    if ($value != 'NA') {
      $inserts[] = array(
        'species_id' => $species_id,
        'type' => $type,
        'value' => $value
      );
    }
  }
  try {
    QB::table('species_traits')->where('species_id', $species_id)->delete();
    if (count($inserts) > 0)
      QB::table('species_traits')->insert($inserts);
  } catch (PDOException $e) {
    Response::error(500, "Error updating traits: ".$e->getMessage());
  }
}

function updateSpeciesTachet($species_id, $tachet) {
  if (count($tachet) == 0) return;
  $tachet['species_id'] = $species_id;
  try {
    QB::table('species_tachet')->where('species_id', $species_id)->delete();
    QB::table('species_tachet')->insert($tachet);
  } catch (PDOException $e) {
    Response::error(500, "Error updating tachet traits: ".$e->getMessage());
  }
}

class SpeciesException extends Exception { }

class Species {
  public $bwg_name;
  public $class;
  public $ord;
  public $subord;
  public $family;
  public $subfamily;
  public $tribe;
  public $genus;
  public $species;
  public $subspecies;
  public $functional_group;
  public $realm;
  public $micro_macro;
  public $predation;

  public static $columns = array("bwg_name", "domain", "kingdom", "phylum",
  "subphylum", "class", "subclass", "ord", "subord", "family", "subfamily",
  "tribe", "genus", "species", "subspecies", "functional_group", "realm",
  "micro_macro", "predation");

  public $names = array();
  public $traits = array();
}
?>
