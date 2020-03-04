<?php
/*
*   Create a species log entry for batched species uploads
*/
$get->expect("file_id");
$file_id = $get->file_id;

try {
  $log_id = create_species_log($file_id);
  Response::success(array(
    "log_id" => $log_id
  ));
} catch (PDOException $e) {
  Response::error(500, "PDOException creating species log: ".$e->getMessage());
}
?>
