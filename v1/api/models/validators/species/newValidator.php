<?php
require_once(__DIR__.'/../validator.php');

class SpeciesNewValidator extends Validator {
  public $fields = array(
    "bwg_name" => array("format" => "string", "required" => true),
    "domain" => array("format" => "string"),
    "kingdom" => array("format" => "string"),
    "phylum" => array("format" => "string"),
    "subphylum" => array("format" => "string"),
    "class" => array("format" => "string"),
    "subclass" => array("format" => "string"),
    "ord" => array("format" => "string"),
    "subord" => array("format" => "string"),
    "family" => array("format" => "string"),
    "subfamily" => array("format" => "string"),
    "tribe" => array("format" => "string"),
    "genus" => array("format" => "string"),
    "species" => array("format" => "string"),
    "subspecies" => array("format" => "string"),
    "functional_group" => array("options" => array("NA", "gatherer", "scraper", "shredder", "filter.feeder", "piercer", "engulfer")),
    "realm" => array("options" => array("NA", "aquatic", "terrestrial")),
    "micro_macro" => array("options" => array("NA", "micro", "macro")),
    "predation" => array("options" => array("NA", "predator", "prey")),
    "barcode" => array("format" => "string")
  );
}
?>
