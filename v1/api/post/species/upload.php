<?php
if (!isset($_FILES['file']))
  Response::error(400, "Expected a file in form field 'file'");

$directory = new \Upload\Storage\FileSystem(__DIR__.'/../../files');
$file = new \Upload\File('file', $directory);

$name = $file->getNameWithExtension();

$new_file_name = uniqid();
$file->setName($new_file_name);

$record = array(
  "name" => $name,
  "size" => $file->getSize(),
  "extension" => $file->getExtension(),
  "unique_name" => $file->getNameWithExtension()
);

try {
  $file->upload();
} catch (Exception $e) {
  foreach ($file->getErrors() as $error) {
    if ($error == 'Invalid mimetype')
      Response::error(400, "File type unsupported. Supported file types: csv or tsv");
    else
      Response::error(500, "Error uploading files: ".$file->getErrors());
  }
}

try {
  $file_id = QB::table('files')->insert($record);
  Response::success(array(
    "file_id" => $file_id
  ));
} catch (PDOException $e) {
  Response::error(500, "Error updating file record: ".$e->getMessage());
}

?>
