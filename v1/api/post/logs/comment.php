<?php
$get->expect('log_id');
$log_id = $get->log_id;

$post->expect('comment');
$comment = $post->comment;

$entry = array(
  "log_id" => $log_id,
  "username" => $user->username,
  "comment" => $comment
);

try {
  $comment_id = QB::table('logs_comments')->insert($entry);

  Response::success(array(
    "comment_id" => $comment_id
  ));
} catch (PDOException $e) {
  Response::error(500, "Error inserting comment: ".$e->getMessage());
}

?>
