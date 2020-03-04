<?php
$post->expect('username');

if ($user->role != 'admin' && $post->username != $user->username)
  Response::error(403, "Role 'admin' required to edit user");

if (isset($post->role)) {
  if ($user->role != 'admin' && $post->role != $user->role)
    Response::error(403, "Role cannot be changed by non-admin");
}

$updated = array();

try {
  $editedUser = User::fromEdit($post->username);
  if (isset($post->password)) {
    $editedUser->setPassword($post->password);
    $updated['password'] = $editedUser->hash;
  }
  if (isset($post->email)) {
    $editedUser->setEmail($post->email);
    $updated['email'] = $editedUser->email;
  }
  if (isset($post->name)) {
    $editedUser->setName($post->name);
    $updated['name'] = $editedUser->name;
  }
  if (isset($post->role)) {
    $editedUser->setRole($post->role);
    $updated['role'] = $editedUser->role;
  }
} catch (UserException $e) {
  Response::error(400, $e->getMessage());
}

updateUser($editedUser, $updated);

?>
