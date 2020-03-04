<?php
require_once(__DIR__."/../../models/file.php");
$get->expect("file_id");

$file_id = $get->file_id;
if (!is_numeric($file_id))
  Response::error(400, "file_id must be a numeric key");

$file = getFile($file_id);
Response::success(array(
  "file" => $file
));

?>
