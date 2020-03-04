<?php
$get->expect('log_id');
$query = QB::table('logs_comments')->select("*")->where("log_id", $get->log_id);

Response::success(array(
  "comments" => $query->get()
));
?>
