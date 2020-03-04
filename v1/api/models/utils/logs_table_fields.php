<?php
$logs_table_fields = array(
  "log_id" => "log_id",
  "username" => "log_username",
  "type" => "log_type",
  "action" => "log_action",
  "num_success" => "log_num_success  ",
  "num_failure" => "log_num_failure",
  "timestamp" => "log_timestamp"
);

$logs_species_table_fields = array(
  "species_id" => "species_species_id",
  "bwg_name" => "species_bwg_name",
);

$logs_datasets_table_fields = array(
  "dataset_id" => "datasets_dataset_id",
  "name" => "datasets_dataset_name"
);

$logs_visits_table_fields = array(
  "visit_id" => "visits_visit_id",
  "habitat" => "visits_habitat",
  "dataset_id" => "visits_dataset_id",
  "dataset_name" => "visits_dataset_name"
);

$logs_bromeliads_table_fields = array(
  "bromeliad_id" => "bromeliads_bromeliad_id",
  "original_id" => "bromeliads_original_id",
  "visit_id" => "bromeliads_visit_id",
  "visit_habitat" => "bromeliads_visit_habitat",
  "dataset_id" => "bromeliads_dataset_id",
  "dataset_name" => "bromeliads_dataset_name"
);

$logs_measurements_table_fields = array(
  "dataset_id" => "measurements_dataset_id",
  "dataset_name" => "measurements_dataset_name",
);

$logs_matrix_table_fields = array(
  "dataset_id" => "matrix_dataset_id",
  "dataset_name" => "matrix_dataset_name",
);

$logs_files_table_fields = array(
  "file_id" => "files_file_id"
);

$logs_users_table_fields = array(
  "id" => "user_id",
  "name" => "user_name"
);

function parse_types($types_string) {
  $results = array();
  if (strpos($types_string, ",") == 0) {
    if (trim($types_string) == ",")
      return array();
    return array($types_string);
  } else {
    $types = explode(",", $types_string);
    foreach ($types as $type) {
      if (strlen(trim($type)) > 0)
        $results[trim($type)] = 1;
    }
    return array_keys($results);
  }
}
 ?>
