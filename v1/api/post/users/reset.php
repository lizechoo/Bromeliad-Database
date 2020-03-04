<?php
$post->expect('token', 'password');

try {
    $query = QB::table("users");
    $query->where("token", $post->token);
    $query->setFetchMode(PDO::FETCH_ASSOC);

    $users = $query->get();
    if (sizeof($users) == 0) {
        Response::error(400, "Token invalid");
    }

    $firstUser = $users[0];
    $user = User::fromDatabase($firstUser);

    $user->setNewToken();
    $user->setPassword($post->password);

    $updated = array();
    $updated['password'] = $user->getHash();
    $updated['token'] = $user->getToken();

    updateUser($user, $updated);

    Response::success("Password successfully reset");

    // Update the user with the new token and password
} catch (PDOException $e) {
    Response::error(500, "Unable to reset user's password");
}
