<?php
require_once(__DIR__.'/../validator.php');

class BromeliadEditValidator extends Validator {
  public $edit = true;

  public $fields = array(
    "visit_id" => array("format" => "integer"),
    "original_id" => array("format" => "string"),
    "species" => array("format" => "string"),
    "actual_water" => array("format" => "number", "min" => 0, "max" => 10000, "less_than_eq" => "max_water"),
    "max_water" => array("format" => "number", "min" => 0, "max" => 10000),
    "longest_leaf" => array("format" => "number", "min" => 0, "max" => 300),
    "num_leaf" => array("format" => "integer", "min" => 1, "max" => 150),
    "height" => array("format" => "number"),
    "diameter" => array("format" => "number"),
    "extended_diameter" => array("format" => "number"),
    "leaf_width" => array("format" => "number"),
    "collection_date" => array("format" => "date")
  );
}
