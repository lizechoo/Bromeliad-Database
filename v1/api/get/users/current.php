<?php
$query = QB::table("users")->select("username", "name", "email", "role", "avatar");
$query->where("username", $user->username);

try {
  $users = $query->get();

  if (count($users) == 0)
    Response::error(404, "Current user not found");

  Response::success(array('user' => $users[0]));

} catch (PDOException $e) {
  Response::error(500, "Database error at species.php".$e->getMessage());
}

?>
