<?php
require_once(__DIR__.'./../../models/utils/logs_table_fields.php');

if (isset($get->types) && strlen(trim($get->types)) > 0)
  $types = parse_types(trim($get->types));
else
  $types = array();

check_types($types);

if (isset($get->start) && strlen(trim($get->start)) > 0)
  $start = parse_datetime(trim($get->start));

if (isset($get->end) && strlen(trim($get->end)) > 0)
  $end = parse_datetime(trim($get->end));

if (isset($get->user_id))
  $user_id = $get->user_id;


if (isset($get->page) && isset($get->limit)) {
  if ($get->page < 1)
    Response::error(400, "'page' param must be greater than 0");

  $subQuery = QB::table('logs')->limit($get->limit)->offset(($get->page - 1) * $get->limit)->select("logs.*");
  $subQuery->orderBy('logs.timestamp', 'DESC');
  if (count($types) > 0)
    $subQuery->whereIn("logs.type", $types);

  $query = QB::table(QB::subQuery($subQuery, 'logs'));
} else {
  $query = QB::table('logs');
}

select_join_table($query, "logs", $logs_table_fields);

$query->orderBy('logs.timestamp', 'DESC');

if (count($types) == 0 || in_array("species", $types)) {
  join_logs_table($query, "logs_species", $logs_species_table_fields);
  join_logs_table($query, "logs_files", $logs_files_table_fields);
}

if (count($types) == 0 || in_array("datasets", $types))
  join_logs_table($query, "logs_datasets", $logs_datasets_table_fields);

if (count($types) == 0 || in_array("visits", $types))
  join_logs_table($query, "logs_visits", $logs_visits_table_fields);

if (count($types) == 0 || in_array("bromeliads", $types))
  join_logs_table($query, "logs_bromeliads", $logs_bromeliads_table_fields);

if (count($types) == 0 || in_array("measurements", $types))
  join_logs_table($query, "logs_measurements", $logs_measurements_table_fields);

if (count($types) == 0 || in_array("matrix", $types))
  join_logs_table($query, "logs_matrix", $logs_matrix_table_fields);

if (isset($start))
  $query->where("logs.timestamp", ">=", $start);

if (isset($end))
  $query->where("logs.timestamp", "<=", $end);

$query->join('users', 'users.username', '=', 'logs.username', 'left');
select_join_table($query, "users", $logs_users_table_fields);

if (isset($user_id))
  $query->where("users.id", $user_id);

$results = array();

foreach ($query->get() as $row) {
  if (!isset($row->log_type))
    continue;

  if (!isset($results[$row->log_id]))
    $results[$row->log_id] = array(
      "log_id" => $row->log_id,
      "username" => $row->log_username,
      "user_id" => $row->user_id,
      "user_name" => $row->user_name,
      "type" => $row->log_type,
      "action" => $row->log_action,
      "num_success" => $row->log_num_success,
      "num_failure" => $row->log_num_failure,
      "timestamp" => $row->log_timestamp
    );

  if ($row->log_type == "species") {
    if (isset($row->files_file_id))
      $results[$row->log_id]['file_id'] = $row->files_file_id;

    if (!isset($results[$row->log_id]['species']))
      $results[$row->log_id]['species'] = array();
    $results[$row->log_id]['species'][] = array(
      "species_id" => $row->species_species_id,
      "bwg_name" => $row->species_bwg_name
    );
  } else if ($row->log_type == "datasets") {
    if (!isset($results[$row->log_id]['datasets']))
      $results[$row->log_id]['datasets'] = array();
    $results[$row->log_id]['datasets'][] = array(
      "dataset_id" => $row->datasets_dataset_id,
      "dataset_name" => $row->datasets_dataset_name
    );
  } else if ($row->log_type == "visits") {
    if (!isset($results[$row->log_id]['visits']))
      $results[$row->log_id]['visits'] = array();
    $results[$row->log_id]['visits'][] = array(
      "visit_id" => $row->visits_visit_id,
      "habitat" => $row->visits_habitat,
      "dataset_id" => $row->visits_dataset_id,
      "dataset_name" => $row->visits_dataset_name
    );
  } else if ($row->log_type == "bromeliads") {
    if (!isset($results[$row->log_id]['bromeliads']))
      $results[$row->log_id]['bromeliads'] = array();
    $results[$row->log_id]['bromeliads'][] = array(
      "bromeliad_id" => $row->bromeliads_bromeliad_id,
      "original_id" => $row->bromeliads_original_id,
      "visit_id" => $row->bromeliads_visit_id,
      "habitat" => $row->bromeliads_visit_habitat,
      "dataset_id" => $row->bromeliads_dataset_id,
      "dataset_name" => $row->bromeliads_dataset_name
    );
  } else if ($row->log_type == "measurements") {
    if (!isset($results[$row->log_id]['measurements']))
      $results[$row->log_id]['measurements'] = array();
    $results[$row->log_id]['measurements'][] = array(
      "dataset_id" => $row->measurements_dataset_id,
      "dataset_name" => $row->measurements_dataset_name
    );
  } else if ($row->log_type == "matrix") {
    if (!isset($results[$row->log_id]['matrix']))
      $results[$row->log_id]['matrix'] = array();
    $results[$row->log_id]['matrix'][] = array(
      "dataset_id" => $row->matrix_dataset_id,
      "dataset_name" => $row->matrix_dataset_name
    );
  }
}

if (isset($get->comments) && $get->comments) {
  $results = get_comments($results);
}

Response::success(array('logs' => array_values($results)));

// Define table fields: field_name => alias

function join_logs_table($query, $table, $fields) {
  $query->join($table, "$table.log_id", "=", "logs.log_id", "left");
  select_join_table($query, $table, $fields);
}

function select_join_table($query, $table, $fields) {
  foreach ($fields as $field => $alias)
    $query->select(QB::raw("$table.$field as $alias"));
}

function subset_fields($log, $fields) {
  $result = array(
    "username" => $log->log_username,
    "type" => $log->log_type,
    "action" => $log->log_action,
    "num_success" => $log->log_num_success,
    "num_failure" => $log->log_num_failure,
    "timestamp" => $log->log_timestamp
  );

  foreach ($fields as $original => $alias)
    $result[$original] = $log->$alias;

  return $result;
}

function check_types($types) {
  $valid_types = array("datasets", "visits", "species", "bromeliads", "measurements", "matrix");

  foreach ($types as $type) {
    if (!in_array($type, $valid_types))
      Response::error(400, "Invalid type: '$type'");
  }
}

function parse_datetime($dt_string) {
  $datetime = DateTime::createFromFormat("Y/m/d G:i:s e", $dt_string);
  return $datetime->format("Y-m-d G:i:s");
}

/*
*   Query comments and attach to each entry
*
*/
function get_comments($logs) {
  if (count($logs) == 0)
    return $logs;

  $results = $logs;
  $log_ids = array_keys($results);

  $query = QB::table('logs_comments')->select('logs_comments.*')->whereIn('log_id', $log_ids);
  $query->orderBy('logs_comments.timestamp', 'ASC');
  $query->join('users', 'users.username', '=', 'logs_comments.username', 'left')->select('users.id');
  $query->join('files', 'files.file_id', '=', 'users.avatar', 'left')->select('files.unique_name');
  foreach ($query->get() as $row) {
    if (!isset($results[$row->log_id]['comments']))
      $results[$row->log_id]['comments'] = array();

    $comment = array(
      "comment_id" => $row->comment_id,
      "username" => $row->username,
      "comment" => $row->comment,
      "timestamp" => $row->timestamp
    );

    if (isset($row->id))
      $comment['user_id'] = $row->id;

    if (isset($row->unique_name))
      $comment['avatar'] = $row->unique_name;

    $results[$row->log_id]['comments'][] = $comment;
  }

  return $results;
}

?>
