<?php
$search_fields =
  array('bwg_name', 'domain', 'kingdom', 'phylum', 'subphylum', 'class', 'subclass',
  'ord', 'subord', 'family', 'subfamily', 'tribe', 'genus', 'species', 'subspecies');

// accepts a QB query and LEFT JOIN common names table
function join_species_names ($query) {
  $query->join('species_names', 'species_names.species_id', '=', 'species.species_id', 'left');
  $query->select('species_names.name');
}

function join_traits ($query) {
  $query->join('species_traits', 'species_traits.species_id', '=', 'species.species_id', 'LEFT');
  $query->select('species_traits.type', 'species_traits.value');
}

function join_tachet ($query, $tachets) {
  $query->join('species_tachet', 'species_tachet.species_id', '=', 'species.species_id', 'LEFT');
  foreach ($tachets as $tachet) {
    $query->select("species_tachet.$tachet");
  }
}

function join_dataset ($subQuery, $dataset_id) {
  if (empty($dataset_id) || !is_numeric($dataset_id)) return;
  $subQuery->join("measurements", "measurements.species_id", "=", "species.species_id", "INNER");
  $subQuery->join("dataset_measurements", "dataset_measurements.measurement_id", "=", "measurements.measurement_id", "INNER");
  $subQuery->where("dataset_measurements.dataset_id", $dataset_id);
}

function search_where ($subQuery, $search_fields, $search_term) {
  if (empty($search_fields)) return;
  if (empty($search_term)) return;
  $fuzzy_search_term = '%'.$search_term.'%';
  $subQuery->where("species_names.name", 'LIKE', $fuzzy_search_term);
  foreach ($search_fields as $field) {
    $subQuery->orWhere("species.".$field, 'LIKE', $fuzzy_search_term);
  }
}

function order_by ($subQuery, $orderBy, $asc) {
  if (empty($orderBy)) return;
  $order = $asc ? 'ASC' : "DESC";
  $subQuery->orderBy($orderBy, $order);
}

function limit ($subQuery, $page, $limit) {
  if (empty($page)) return;
  if (empty($limit)) return;
  $offset = ($page - 1) * $limit;
  $subQuery->limit($limit);
  $subQuery->offset($offset);
}

function buildSubQuery () {
  $subQuery = QB::table('species')->select('species.*');
  join_species_names($subQuery);
  $subQuery->groupBy('species.species_id');
  return $subQuery;
}

function get_subquery () {
  global $subQuery;
  if (!isset($subQuery)) $subQuery = buildSubQuery();
  return $subQuery;
}

function get_count_subquery () {
  global $countSubQuery;
  if (!isset($countSubQuery)) $countSubQuery = buildSubQuery();
  return $countSubQuery;
}

// main query
$query = QB::table('species')->select('species.*');
join_species_names($query);

if (isset($get->traits) && $get->traits)
  join_traits($query);

if (isset($get->tachet) && $get->tachet) {
  require_once(__DIR__.'./../../models/tachet.php');

  $tachets = array();
  $tachetsArray = getTachetTraits();
  foreach ($tachetsArray as $tachet) {
    $tachets[] = $tachet['trait'];
  }

  join_tachet($query, $tachets);
}

// count query
$countQuery = QB::table('species');
$countSubQuery;

if (isset($get->species_id)) {
  get_subquery()->where('species.species_id', $get->species_id);
  get_count_subquery()->where('species.species_id', $get->species_id);
}

if (isset($get->dataset_id)) {
  join_dataset(get_subquery(), $get->dataset_id);
  join_dataset(get_count_subquery(), $get->dataset_id);
}

if (isset($get->search)) {
  search_where(get_subquery(), $search_fields, $get->search);
  search_where(get_count_subquery(), $search_fields, $get->search);
}

if (isset($get->orderBy) && isset($get->asc)) {
  order_by(get_subquery(), $get->orderBy, $get->asc);
  order_by(get_count_subquery(), $get->orderBy, $get->asc);
}

if (isset($get->page) && isset($get->limit)) {
  limit(get_subquery(), $get->page, $get->limit);
}

// main query
if (isset($subQuery))
  $query->join(QB::subQuery($subQuery, 'sub'), 'sub.species_id', '=', 'species.species_id');

// count query
if (isset($countSubQuery))
  $countQuery->join(QB::subQuery($countSubQuery, 'sub'), 'sub.species_id', '=', 'species.species_id');

$stmt = $query->getPDOStatement();

if (isset($get->traits) && $get->traits)
  $objects = array('traits' => array('key' => 'type', 'value' => 'value'));
else
  $objects = array();

if (isset($get->tachet) && $get->tachet)
  $columns = array('tachet' => $tachets);
else
  $columns = array();

$species = groupArraysObjects($stmt, 'species_id', array('name' => 'names'), array(), $objects, $columns);

$count = $countQuery->count();

$response = array(
  "total" => $count,
  "species" => $species
);
// Get all DISTINCT traits types
if (isset($get->traits) && $get->traits) {
  $types_query = QB::table('species_traits');
  $types = $types_query->selectDistinct(array('type'))->get();
  $typesArray = array();

  foreach ($types as $type) {
    $typesArray[] = $type->type;
  }
  $response['traits'] = $typesArray;
}

if (isset($get->tachet) && $get->tachet) {
  $response['tachet'] = getTachetTraits();
}

Response::success($response);

?>
