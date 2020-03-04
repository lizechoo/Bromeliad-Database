<?php
$get->expect("type");

try {
  $markdowns = getMarkdowns($get->type);

  Response::success($markdowns);
} catch (PDOException $e) {
  Response::error(500, $e->getMessage());
}

function getMarkdowns($type) {
  return QB::table('markdowns')->where('type', $type)->select('*')
  ->get();
}

?>
