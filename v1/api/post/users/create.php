<?php
$post->expect("username", "password", "email", "name", "role");

isExisting("username", $post->username);
isExisting("email", $post->email);

try {
  $user = User::create($post->username, $post->password, $post->email, $post->name, $post->role);
} catch (UserException $e) {
  Response::error(400, $e->getMessage());
}

createUser($user);

function isExisting($field, $value) {
  $query = QB::table('users');
  $query->select('*');
  $query->setFetchMode(PDO::FETCH_ASSOC);
  $query->where($field, $value);
  try {
    $results = $query->get();
    if (sizeof($results) > 0) {
      Response::error(400, "A user with this ".$field." already exists");
    }
  } catch (PDOException $e) {
    Response::error(500, "PDOException at user/create".$e->getMessage());
  }
}

function createUser($user) {
  $query = QB::table('users');
  $insert = array(
    "username" => $user->username,
    "password" => $user->hash,
    "email" => $user->email,
    "name" => $user->name,
    "role" => $user->role,
    "token" => $user->token
  );
  try {
    $query->insert($insert);
    Response::success(array(
      "user" => array(
        "username" => $user->username,
        "email" => $user->email,
        "name" => $user->name,
        "role" => $user->role
      )
    ));
  } catch (PDOException $e) {
    Response::error(500, "Server error: PDOException at create.php");
  }
}
?>
