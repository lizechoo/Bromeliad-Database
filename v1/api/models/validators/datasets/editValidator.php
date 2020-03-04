<?php
require_once(__DIR__.'/../validator.php');

class DatasetEditValidator extends Validator {
  public $edit = true;

  public $fields = array(
    "name" => array("format" => "string", "required" => true),
    "country" => array("format" => "string", "required" => true),
    "location" => array("format" => "string", "required" => true),
    "year" => array("format" => "year", "required" => true),
    "lat" => array("format" => "lat"),
    "lng" => array("format" => "lng"),
    "owner_name" => array("format" => "string"),
    "owner_email" => array("format" => "string"),
    "owner2_name" => array("format" => "string"),
    "owner2_email" => array("format" => "string"),
    "bwg_release" => array("format" => "date"),
    "public_release" => array("format" => "date"),
    "faculty_name" => array("format" => "string"),
    "faculty_email" => array("format" => "string")
  );
}
?>
