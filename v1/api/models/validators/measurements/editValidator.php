<?php
require_once(__DIR__.'/../validator.php');

class MeasurementEditValidator extends Validator {
  public $edit = true;

  public $fields = array(
    "dry_wet" => array("options" => array("dry", "wet")),
    "biomass" => array("format" => "number"),
    "value" => array("string"),
    "unit" => array("options" => array("mg", "g"))
  );
}
