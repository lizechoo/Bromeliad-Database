<?php
$get->expect("file_id");
$file_id = $get->file_id;
try {
  $files = QB::table('files')->where('file_id', $file_id)->get();
  if (count($files) == 0)
    Response::error(404, "File with file_id: $file_id not found");

  $file = $files[0];

  QB::table('users')->where('id', $user->id)->update(array(
    "avatar" => $get->file_id
  ));

  Response::success($file->unique_name);
} catch (PDOException $e) {
  Response::error(500, "Error setting avatar: ".$e->getMessage());
}
?>
