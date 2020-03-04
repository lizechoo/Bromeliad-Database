<?php
require_once(__DIR__."/../../models/file.php");

$get->expect("file_id");

$file_id = $get->file_id;
if (!is_numeric($file_id))
  Response::error(400, "file_id must be a numeric key");

$file = getFile($file_id);
$unique_name = $file->unique_name;
$name = $file->name;
$path = __DIR__."/../../files/$unique_name";

if (!file_exists($path))
  Response::error(404, "File not found in system");

$mime = mime_content_type($path);

header('Content-Type:'.$mime);
header('Content-Length: ' . filesize($path));
readfile($path);
exit;
?>
