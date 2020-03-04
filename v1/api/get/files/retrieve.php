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

header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="'.basename($name).'"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($path));
readfile($path);
exit;

?>
