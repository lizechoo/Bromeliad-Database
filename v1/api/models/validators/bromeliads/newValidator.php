<?php
require_once(__DIR__.'/../validator.php');

class BromeliadNewValidator extends Validator {
  public $fields = array(
    "visit_id" => array("required" => true, "format" => "integer"),
    "original_id" => array("required" => true, "format" => "string"),
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
