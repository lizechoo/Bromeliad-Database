<?php
$query = QB::table('species_traits')->selectDistinct('type');
$query->setFetchMode(PDO::FETCH_ASSOC);

if (isset($get->search))
  $query->where('type', 'LIKE', '%'.$get->search.'%');

$results = array_values($query->get());
$types = array();
foreach ($results as $key => $value) {
  $types[] = $value['type'];
}

Response::success(array(
  "types" => $types
));
?>
