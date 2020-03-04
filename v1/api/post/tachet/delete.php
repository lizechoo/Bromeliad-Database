<?php
require_once(__DIR__.'./../../models/tachet.php');

$post->expect('traits');
$traits = $post->traits;

validateTraitKeys($traits);
deleteTraits($traits);

Response::success();

function validateTraitKeys($traits) {
  if (!is_array($traits))
    Response::error(400, "'traits' must be an array");

  foreach ($traits as $trait) {
    if (!is_string($trait))
      Response::error(400, "'traits' must be an array of strings");
    if (count(findTrait($trait)) != 1)
      Response::error(400, "trait '$trait' does not exist");
  }
}

?>
