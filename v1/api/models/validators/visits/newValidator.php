<?php
require_once(__DIR__.'/../validator.php');

class VisitNewValidator extends Validator {
  public $fields = array(
    "dataset_id" => array("required" => true, "format" => "integer"),
    "habitat" => array("required" => true, "format" => "string"),
    "min_rainfall" => array("format" => "number", "less_than" => "max_rainfall", "min" => 0, "max" => 500),
    "max_rainfall" => array("format" => "number", "greater_than" => "min_rainfall", "min" => 0, "max" => 500),
    "min_temperature" => array("format" => "number", "less_than" => "max_temperature", "min" => 0, "max" => 50),
    "max_temperature" => array("format" => "number", "greater_than" => "min_temperature", "min" => 0, "max" => 50),
    "min_elevation" => array("format" => "number", "less_than" => "max_elevation", "min" => -10, "max" => 5000),
    "max_elevation" => array("format" => "number", "greater_than" => "min_elevation", "min" => -10, "max" => 5000),
    "date" => array("format" => "date"),
    "collection_method" => array("options" => array("NA", "washing", "pipet", "dissection", "beating", "incomplete")),
    "latitude" => array("format" => "lat"),
    "longitude" => array("format" => "lng"),
    "meta" => array("format" => "string")
  );
}
?>
