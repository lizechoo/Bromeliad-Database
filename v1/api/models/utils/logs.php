<?php
require_once(__DIR__.'./../species.php');
require_once(__DIR__.'./../dataset.php');
require_once(__DIR__.'./../visit.php');
require_once(__DIR__.'./../bromeliad.php');
require_once(__DIR__.'./../measurements.php');

function create_species_log($file_id) {
  $log_id = create_log_entry("species", "create", 1, 0);

  create_logs_file($log_id, $file_id);
  return $log_id;
}

function log_create_species($speciesMap, $num_success, $num_failure, $log_id) {
  try {
    if (!isset($log_id))
      $log_id = create_log_entry("species", "create", $num_success, $num_failure);

    if (count($speciesMap) == 0)
      return;

    create_logs_species($log_id, $speciesMap, false);
  } catch (PDOException $e) {
    return;
  }
}

function log_edit_species($species_ids, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("species", "edit", $num_success, $num_failure);
    if (count($species_ids) == 0)
      return;

    $speciesMap = getSpeciesNamesFromID($species_ids);

    create_logs_species($log_id, $speciesMap, false);
  } catch (PDOException $e) {
    return;
  }
}

function log_delete_species($map, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("species", "delete", $num_success, $num_failure);
    if (count($map) == 0)
      return;

    create_logs_species($log_id, $map, true);
  } catch (PDOException $e) {
    return;
  }
}

function log_create_datasets($datasets, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("datasets", "create", $num_success, $num_failure);

    if (count($datasets) == 0)
      return;

    foreach ($datasets as $dataset_id => $name) {
      create_logs_datasets_entry($log_id, $dataset_id, $name);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_edit_datasets($datasets, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("datasets", "edit", $num_success, $num_failure);
    if (count($datasets) == 0)
      return;
    foreach ($datasets as $dataset_id => $name) {
      create_logs_datasets_entry($log_id, $dataset_id, $name);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_delete_datasets($datasets, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("datasets", "delete", $num_success, $num_failure);
    if (count($datasets) == 0)
      return;
    foreach ($datasets as $dataset_id => $name) {
      create_logs_datasets_entry($log_id, null, $name);
    }
  } catch (PDOException $e) {
    return;
  }
}

/*
*  $visits is a map of (visit_id => habitat)
*/
function log_create_visits($visits, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("visits", "create", $num_success, $num_failure);
    if (count($visits) == 0)
      return;
    $visit_map = getVisitsDataset(array_keys($visits));

    foreach ($visits as $visit_id => $habitat) {
      $map = $visit_map[$visit_id];

      create_logs_visits_entry($log_id, $visit_id, $map['dataset_id'], $map['dataset_name'], $habitat);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_edit_visits($visits, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("visits", "edit", $num_success, $num_failure);
    if (count($visits) == 0)
      return;
    $visit_map = getVisitsDataset($visits);

    foreach ($visits as $visit_id) {
      $map = $visit_map[$visit_id];

      create_logs_visits_entry($log_id, $visit_id, $map['dataset_id'], $map['dataset_name'], $map['habitat']);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_delete_visits($visit_map, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("visits", "delete", $num_success, $num_failure);
    if (count($visit_map) == 0)
      return;

    foreach ($visit_map as $visit_id => $map) {
      create_logs_visits_entry($log_id, null, $map['dataset_id'], $map['dataset_name'], $map['habitat']);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_create_bromeliads($bromeliad_ids, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("bromeliads", "create", $num_success, $num_failure);
    if (count($bromeliad_ids) == 0)
      return;

    $bromeliads = getBromeliadVisitDataset($bromeliad_ids);

    foreach ($bromeliads as $bromeliad_id => $bromeliad) {
      create_logs_bromeliads_entry($log_id, $bromeliad_id, $bromeliad['original_id'],
      $bromeliad['visit_id'], $bromeliad['visit_habitat'], $bromeliad['dataset_id'],
      $bromeliad['dataset_name']);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_edit_bromeliads($bromeliad_ids, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("bromeliads", "edit", $num_success, $num_failure);
    if (count($bromeliad_ids) == 0)
      return;

    $bromeliads = getBromeliadVisitDataset($bromeliad_ids);

    foreach ($bromeliads as $bromeliad_id => $bromeliad) {
      create_logs_bromeliads_entry($log_id, $bromeliad_id, $bromeliad['original_id'],
      $bromeliad['visit_id'], $bromeliad['visit_habitat'], $bromeliad['dataset_id'],
      $bromeliad['dataset_name']);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_delete_bromeliads($bromeliad_map, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("bromeliads", "delete", $num_success, $num_failure);
    if (count($bromeliad_map) == 0)
      return;

    foreach ($bromeliad_map as $bromeliad_id => $bromeliad) {
      create_logs_bromeliads_entry($log_id, null, $bromeliad['original_id'],
      $bromeliad['visit_id'], $bromeliad['visit_habitat'], $bromeliad['dataset_id'],
      $bromeliad['dataset_name']);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_create_measurements($dataset_ids, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("measurements", "create", $num_success, $num_failure);

    if (count($dataset_ids) == 0)
      return;

    $dataset_map = getDatasetNames($dataset_ids);

    foreach ($dataset_map as $dataset_id => $dataset_name) {
      create_logs_measurements_entry($log_id, $dataset_id, $dataset_name);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_edit_measurements($measurement_ids, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("measurements", "edit", $num_success, $num_failure);

    if (count($measurement_ids) == 0)
      return;
    $dataset_map = measurementDatasetMap($measurement_ids);

    foreach ($dataset_map as $dataset_id => $dataset_name) {
      create_logs_measurements_entry($log_id, $dataset_id, $dataset_name);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_delete_measurements($dataset_map, $num_success, $num_failure) {
  try {
    $log_id = create_log_entry("measurements", "delete", $num_success, $num_failure);

    if (count($dataset_map) == 0)
      return;

    foreach ($dataset_map as $dataset_id => $dataset_name) {
      create_logs_measurements_entry($log_id, $dataset_id, $dataset_name);
    }
  } catch (PDOException $e) {
    return;
  }
}

function log_edit_matrix($dataset_map) {
  try {
    $log_id = create_log_entry("matrix", "edit", count($dataset_map), 0);
    if (count($dataset_map) == 0)
      return;

    foreach ($dataset_map as $dataset_id => $dataset_name) {
      create_logs_matrix_entry($log_id, $dataset_id, $dataset_name);
    }
  } catch (PDOException $e) {
    return;
  }
}

/*
Create an entry in logs table

@return log_id
@throws PDOException
*/
function create_log_entry($table, $action, $num_success, $num_failure) {
  global $user;

  $entry = array(
    "type" => $table,
    "action" => $action,
    "username" => $user->username
  );

  if (isset($num_success))
  $entry['num_success'] = $num_success;
  if (isset($num_failure))
  $entry['num_failure'] = $num_failure;

  return QB::table('logs')->insert($entry);
}

function create_logs_species($log_id, $species_map, $delete) {
  $entries = array();
  foreach ($species_map as $species_id => $bwg_name) {
    $entry = array(
      "log_id" => "'$log_id'",
      "bwg_name" => "'$bwg_name'"
    );

    if (!$delete)
      $entry['species_id'] = "'$species_id'";
    $entries[] = $entry;
  }

  $query = build_insert_batch("logs_species", $entries);
  return executeRawQuery($query);
}

function create_logs_datasets_entry($log_id, $dataset_id, $name) {
  $entry = array(
    "log_id" => $log_id,
    "dataset_id" => $dataset_id,
    "name" => $name
  );

  return QB::table('logs_datasets')->insert($entry);
}

function create_logs_visits_entry($log_id, $visit_id, $dataset_id, $dataset_name, $habitat) {
  $entry = array(
    "log_id" => $log_id,
    "visit_id" => $visit_id,
    "dataset_id" => $dataset_id,
    "dataset_name" => $dataset_name,
    "habitat" => $habitat
  );

  return QB::table('logs_visits')->insert($entry);
}

function create_logs_bromeliads_entry($log_id, $bromeliad_id, $original_id, $visit_id, $visit_habitat, $dataset_id, $dataset_name) {
  $entry = array(
    'log_id' => $log_id,
    'bromeliad_id' => $bromeliad_id,
    'original_id' => $original_id,
    'visit_id' => $visit_id,
    'visit_habitat' => $visit_habitat,
    'dataset_id' => $dataset_id,
    'dataset_name' => $dataset_name
  );

  return QB::table('logs_bromeliads')->insert($entry);
}

function create_logs_measurements_entry($log_id, $dataset_id, $dataset_name) {
  $entry = array(
    'log_id' => $log_id,
    'dataset_id' => $dataset_id,
    'dataset_name' => $dataset_name
  );

  return QB::table('logs_measurements')->insert($entry);
}

function create_logs_matrix_entry($log_id, $dataset_id, $dataset_name) {
  $entry = array(
    'log_id' => $log_id,
    'dataset_id' => $dataset_id,
    'dataset_name' => $dataset_name
  );

  return QB::table('logs_matrix')->insert($entry);
}

function create_logs_file($log_id, $file_id) {
  $entry = array(
    "log_id" => $log_id,
    "file_id" => $file_id
  );

  return QB::table('logs_files')->insert($entry);
}

?>
