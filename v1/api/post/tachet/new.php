<?php
require_once(__DIR__.'./../../models/tachet.php');

$post->expect('traits');
$traits = $post->traits;

foreach ($traits as $key => $trait) {
  if (!validateTraitKey($key))
    Response::error(400, "trait '$key' cannot be used");
  if (!is_array($trait))
    Response::error(400, "'traits' must be an array of objects");
  if (isset($trait['description']) && !is_string($trait['description']))
    Response::error(400, "'desciption' field must be a string");
  if (count(findTrait($key)) > 0)
    Response::error(400, "trait '$key' already exists");
  if (isset($trait['after']) && !is_string($trait['after'])) {
    Response::error(400, "'after' field must be a string key");
    if (count(findTrait($trait['after'])) == 0) {
      $after = $trait['after'];
      Response::error(400, "'after' field trait '$after' not found");
    }
  }
}
insertTraits($traits);

Response::success();
?>
