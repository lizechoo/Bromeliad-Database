<?php
require_once(__DIR__.'./../../models/tachet.php');

$post->expect('traits');
$traits = $post->traits;
validateTraits($traits);

updateTraits($traits);

Response::success();
?>
