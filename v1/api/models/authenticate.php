<?php
require_once(__DIR__."/utils/bcrypt.php");
require_once(__DIR__."/utils/jwt.php");
require_once(__DIR__."/utils/user.php");

function authorize() {
  $required = roles_required(); // required permissions (roles)
  if (empty($required)) // page is public
    return;
  $HEADERS = getallheaders();
  if (!isset($HEADERS['Authorization']))
    Response::error(403, "Missing Authorization header");
  $auth_header = $HEADERS['Authorization'];
  if (!(substr($auth_header, 0, 7) === "bearer "))
    Response::error(403, "Bad Authorization header");
  $auth_token = substr($auth_header, 7);
  $user = getUser($auth_token);

  $roles_coverage = roles_coverage($user->role);
  $roles_intersect = array_intersect($roles_coverage, $required);

  if (empty($roles_intersect))
    Response::error(403, "Access denied for your role: ".$user->role);

  return $user;
}

function roles_required() {
  global $SETTINGS, $verb, $route, $action;
  $access_settings = $SETTINGS['access'];

  $verb_lower = strtolower($verb);
  $routes = $access_settings[$verb_lower];
  $actions = $routes[$route];

  return $actions[$action];
}
// given $role, return array of all roles that are under $role
function roles_coverage($role) {
  global $SETTINGS, $verb, $route, $action;
  $roles_settings = $SETTINGS['roles'];

  $coverage = array();
  $unresolved = array($role);
  while (!empty($unresolved)) {
    $first = array_shift($unresolved);
    array_push($coverage, $first);
    $under = $roles_settings[$first];
    $unresolved = array_unique(array_merge($under, $unresolved));
  }

  return $coverage;
}

function getUser($auth_token) {
  global $SETTINGS, $db;

  JWT::$leeway = 60; // $leeway in seconds
  try {
    $decoded = (array) JWT::decode($auth_token, $SETTINGS['jwt_secret'], array('HS256'));
  } catch (Exception $e) {
    Response::error(403, "Authorization failed: failed to decrypt token");
  }

  $query = "SELECT * FROM users WHERE username = :username";
  $stmt = $db->prepare($query);
  $stmt->bindParam(":username", $decoded['username']);
  $stmt->execute();

  $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
  if (sizeof($results) == 0) {
    Response::error(403, "Authorization failed: user not found");
  }
  $firstUser = $results[0];
  try {
    $user = User::fromDatabase($firstUser);
  } catch (UserException $e) {
    Response::error(500, "User in database is invalid");
  }
  $token = $user->token;
  $bcrypt = new Bcrypt(8);
  if (!$bcrypt->verify($token, $decoded['token'])) {
    Response::error(403, "Authorization failed: failed to match token");
  }
  return $user;
}

?>
