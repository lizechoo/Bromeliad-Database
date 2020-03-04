<?php
require_once(__DIR__."/../../models/utils/bcrypt.php");
require_once(__DIR__."/../../models/utils/jwt.php");

$post->expect("username", "password");

try {
  $user = User::fromLogin($post->username, $post->password);
} catch (Exception $e) {
  Response::error(400, $e->getMessage());
}

checkUser($user, $SETTINGS['jwt_secret']);

function checkUser($user, $secret) {
  $query = QB::table('users');
  $query->setFetchMode(PDO::FETCH_ASSOC);
  $query->where('username', $user->username);
  $query->where('password', $user->hash);

  $results = $query->get();
  if (sizeof($results) == 0) {
    Response::error(403, "Username and/or password does not exist");
  } else {
    $firstUser = $results[0];
    $token = $firstUser['token'];
    $username = $firstUser['username'];
    $bcrypt = new Bcrypt(8);
    $hash = array(
      "username" => $user->username,
      "token" => $bcrypt->hash($token)
    );
    $jwt = JWT::encode($hash, $secret);
    Response::success(array("token" => $jwt));
  }
}

?>
