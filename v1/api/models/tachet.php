<?php
require_once(__DIR__."/species.php");

function getTachetTraits() {
  try {
    $traits = QB::table('tachet_traits')->select('*')->get();
    $descriptions = array();
    foreach ($traits as $row) {
      $descriptions[$row->trait] = $row->description;
    }
    $results = array();

    $columns = QB::query("SHOW COLUMNS FROM species_tachet")->get();
    foreach ($columns as $column) {
      if ($column->Field == 'species_id') continue;
      $results[] = array('trait' => $column->Field, 'description' => $descriptions[$column->Field]);
    }
    return $results;
  } catch (PDOException $e) {
    Response::error(500, 'PDOException getting traits: '.$e->getMessage());
  }
}

function validateTraits($traits) {
  foreach ($traits as $key => $trait) {
    if (!is_array($trait))
      Response::error(400, "'traits' must be an array of objects");
    if (!isset($trait['description']) && !isset($trait['after']))
      Response::error(400, "'traits' array elements must contain 'description' or 'after' field");
    if (isset($trait['description']) && !is_string($trait['description']))
      Response::error(400, "'description' field must be a string");
    if (count(findTrait($key)) == 0)
      Response::error(400, "trait '$key' not found");
    if (isset($trait['after']) && !is_string($trait['after'])) {
      Response::error(400, "'after' field must be a string key");
      if (count(findTrait($trait['after'])) == 0) {
        $after = $trait['after'];
        Response::error(400, "'after' field trait '$after' not found");
      }
    }
  }
}

function validateTraitKey($trait) {
  $trait = strtolower($trait);
  if (in_array($trait, array('species_id', 'type', 'trait', 'value', 'order', 'as'))) return false;
  if (in_array($trait, Species::$columns)) return false;
  return true;
}

function findTrait($trait) {
  $query = QB::table('tachet_traits')->where('trait', $trait);
  try {
    return $query->get();
  } catch (PDOException $e) {
    Response::error(500, "PDOException finding traits: ".$e->getMessage());
  }
}

function updateTraits($traits) {
  foreach ($traits as $key => $trait) {
    if (isset($trait['description'])) {
      $data = array(
        'description' => $trait['description']
      );
      $query = QB::table('tachet_traits')->where('trait', $key);
      try {
        $query->update($data);
      } catch (PDOException $e) {
        Response::error(500, "PDOException updating traits: ".$e->getMessage());
      }
    }
    if (isset($trait['after'])) {
      try {
        $query = "ALTER TABLE species_tachet CHANGE ".$key." ".$key." INT(11) NULL DEFAULT NULL AFTER ".$trait['after'];
        QB::query($query);
      } catch (PDOException $e) {
        Response::error(500, "PDOException changing field order for $key");
      }
    }
  }
}

function deleteTraits($keys) {
  $query = QB::table('tachet_traits');
  foreach ($keys as $key) {
    $query->orWhere('trait', $key);
    try {
      $query->delete();
    } catch (PDOException $e) {
      Response::error(500, "PDOException deleting traits: ".$e->getMessage());
    }
  }
  foreach ($keys as $key) {
    QB::query("ALTER TABLE species_tachet DROP ".$key);
  }
}

function insertTraits($traits) {
  $inserts = array();
  foreach ($traits as $key => $trait) {
    $row = array('trait' => $key);
    if (isset($trait['description']))
      $row['description'] = $trait['description'];
    $inserts[] = $row;
  }
  $query = QB::table('tachet_traits');
  try {
    $query->insert($inserts);
  } catch (PDOException $e) {
    Response::error(500, "PDOException deleting traits: ".$e->getMessage());
  }
  foreach ($traits as $key => $trait) {
    if (isset($trait['after']))
      $afterQuery = " AFTER ".$trait['after'];
    else
      $afterQuery = "";
    QB::query("ALTER TABLE species_tachet ADD ".$key." INT NULL DEFAULT NULL".$afterQuery);
  }
}
?>
