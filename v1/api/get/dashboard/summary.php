<?php
$response = array(
  'users' => QB::table('users')->count(),
  'species' => QB::table('species')->count(),
  'datasets' => QB::table('datasets')->count(),
  'bromeliads' => QB::table('bromeliads')->count()
);

Response::success($response);
?>
