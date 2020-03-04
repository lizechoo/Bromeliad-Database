<?php
require_once(__DIR__."/models/response.php");
require_once(__DIR__."/models/settings.php");
require_once(__DIR__."/models/database.php");
require_once(__DIR__."/models/utils/logs.php");
$get_routes = array(
  "species" => array("species")
);
$post_routes = array(
  "users" => array("login", "create", "edit", "delete")
);

$verb = $_SERVER['REQUEST_METHOD'];

if (!isset($_GET['route']) or !isset($_GET['action']))
  Response::error(404, "Route and action undefined");
$route = $_GET['route'];
$action = $_GET['action'];

if ($verb == 'GET') {
  $routes = $SETTINGS['access']['get'];
  require_once(__DIR__."/models/utils/get.php");
  $get = new Get();
} else if ($verb == 'POST') {
  require_once(__DIR__."/models/utils/get.php");
  $get = new Get();
  $routes = $SETTINGS['access']['post'];
  require_once(__DIR__."/models/utils/post.php");
  $post = new Post();
} else {
  Response::error(404, "Unsupported HTTP verb: ".$verb);
}

if (!isset($routes[$route]))
  Response::error(404, "Route not found");

$actions = $routes[$route];
if (!isset($actions[$action]))
  Response::error(404, "Action not found");

$user = authorize();
require_once(__DIR__."/".strtolower($verb)."/".$route."/".$action.".php");
?>
