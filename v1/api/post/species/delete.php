<?php
/*
Expects array of species_id
{
  "species": ["1000", "1001"]
}
*/
$post->expect('species');
$species = $post->species;

if (!is_array($species))
  Response::error(400, "'species' must be an array");

validateArray($species);
$map = getSpeciesNamesFromID($species);

try {
  deleteSpecies($species);

  log_delete_species($map, count($map), 0);
} catch (PDOException $e) {
  Response::error(500, "PDOException deleting species".$e->getMessage());
}

Response::success();

function validateArray($species) {
  if (count($species) < 1) {
    Response::error(400, "No 'species_id' in species array");
  }
  foreach ($species as $species_id) {
    if (!is_numeric($species_id))
      Response::error(400, "'species' must be an array of numeric species_id");
  }
}

function deleteSpecies($species) {
  $query = QB::table('species');

  foreach ($species as $species_id)
    $query->orWhere('species_id', $species_id);

  $query->delete();
}

?>
