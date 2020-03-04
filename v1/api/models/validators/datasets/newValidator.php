<?php
require_once(__DIR__.'/../validator.php');

class DatasetNewValidator extends Validator {
  public $fields = array(
    "name" => array("required" => true, "format" => "string"),
    "country" => array("required" => true, "format" => "string"),
    "location" => array("required" => true, "format" => "string"),
    "year" => array("required" => true, "format" => "year"),
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
