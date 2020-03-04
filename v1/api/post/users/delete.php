<?php
$post->expect('username');

if ($user->role != 'admin' && $post->username != $user->username)
  Response::error(403, "Role 'admin' required to delete user");

if ($post->username == $user->username)
  Response::error(403, "Cannot delete yourself");

$username = $post->username;

checkUser($username);
deleteUser($username);

function checkUser($username) {
  $query = QB::table('users')->where('username', $username);
  if (!$query->count())
    Response::error(404, "User '".$username."' not found");
}

function deleteUser($username) {
  QB::table('users')->where('username', $username)->delete();
  Response::success();
}
