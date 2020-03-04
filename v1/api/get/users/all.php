<?php
$query = QB::table('users')->select('*');
try {
  $users = $query->get();
} catch (PDOException $e) {
  Response::error(500, "Database error at species.php".$e->getMessage());
}

Response::success(array("users" => $users));
?>
