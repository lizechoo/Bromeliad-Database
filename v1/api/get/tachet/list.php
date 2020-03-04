<?php
require_once(__DIR__.'./../../models/tachet.php');
$traits = getTachetTraits();

Response::success(array('traits' => $traits));
?>
