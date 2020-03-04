<?php
$post->expect("type");
$post->expect("markdown");

try {
  updateMarkdown($post->type, $post->markdown);

  Response::success();
} catch (PDOException $e) {
  Response::error(500, $e->getMessage());
}

function updateMarkdown($type, $markdown) {
  QB::table('markdowns')->where('type', $type)->update(array('markdown' => $markdown));
}
?>
