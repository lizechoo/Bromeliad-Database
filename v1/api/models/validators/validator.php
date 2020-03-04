<?php
class Validator {
  public function __construct($input) {
    $this->validate($input);
  }

  public $fields;
  public $edit = false;

  private function validate($input) {
    foreach ($input as $key => $value) {
      if (!array_key_exists($key, $this->fields))
        throw new Exception("Unknown field '$key'");
    }
    foreach ($this->fields as $key => $value) {
      $checks = $this->fields[$key];

      if (isset($checks['required'])) {
        if (isset($input[$key])) {
          if (is_string($input[$key])) {
            if (trim($input[$key]) == 'NA' || trim($input[$key]) == '')
              throw new Exception("Field '$key' cannot be empty or 'NA'");
          }
        } else {
          if (!$this->edit || !isset($input[$key]))
            throw new Exception("Field '$key' is required");
        }
      }

      if (!array_key_exists($key, $input) || !isset($input[$key]))
        continue;

      if (is_string($input[$key]) && strlen(trim($input[$key])) < 1)
        throw new Exception("Field '$key' must not be an empty string");
      if (isset($checks['format'])) {
        switch ($checks['format']) {
          case "string":
            $this->validate_string($key, $input[$key]);
            break;
          case "integer":
            $this->validate_integer($key, $input[$key]);
            break;
          case "number":
            $this->validate_number($key, $input[$key]);
            break;
          case "lat":
            $this->validate_latitude($key, $input[$key]);
            break;
          case "lng":
            $this->validate_longitude($key, $input[$key]);
            break;
          case "date":
            $this->validate_date($key, $input[$key]);
            break;
          case "year":
            $this->validate_year($key, $input[$key]);
            break;
        }
      }
      if (isset($checks['options']))
        $this->validate_options($key, $checks['options'], $input[$key]);

      // Validate field less than or greater than another field
      if (isset($checks['less_than']) && array_key_exists($checks['less_than'], $input))
        $this->validate_less_than($key, $checks['less_than'], $input[$key], $input[$checks['less_than']]);
      if (isset($checks['greater_than']) && array_key_exists($checks['greater_than'], $input))
        $this->validate_greater_than($key, $checks['greater_than'], $input[$key], $input[$checks['greater_than']]);

      // Validate field less than or greater than another field
      if (isset($checks['less_than_eq']) && array_key_exists($checks['less_than_eq'], $input))
        $this->validate_less_than($key, $checks['less_than_eq'], $input[$key], $input[$checks['less_than_eq']], true);
      if (isset($checks['greater_than_eq']) && array_key_exists($checks['greater_than_eq'], $input))
        $this->validate_greater_than($key, $checks['greater_than_eq'], $input[$key], $input[$checks['greater_than_eq']], true);

      // Validate field min and max
      if (isset($checks['min']))
        $this->validate_min($key, $input[$key], $checks['min']);
      if (isset($checks['max']))
        $this->validate_max($key, $input[$key], $checks['max']);

    }
  }

  private function validate_integer($key, $value) {
    if (!is_numeric($value) || $value != round($value))
      throw new Exception("Field '$key' must be an integer");
  }

  private function validate_string($key, $value) {
    if (!is_string($value))
      throw new Exception("Field '$key' must be a string");
  }

  private function validate_number($key, $value) {
    if (!is_numeric($value))
      throw new Exception("Field '$key' must be a number");
  }

  private function validate_latitude($key, $value) {
    if ($value == 'NA') return;
    if (!is_numeric($value))
      throw new Exception("Field '$key' must be a number");
    $floatVal = floatval($value);
    if ($floatVal < -90 || $floatVal > 90)
      throw new Exception("Field '$key' must be between -90 and 90");
  }

  private function validate_longitude($key, $value) {
    if ($value == 'NA') return;
    if (!is_numeric($value))
      throw new Exception("Field '$key' must be a number");
    $floatVal = floatval($value);
    if ($floatVal < -180 || $floatVal > 180)
      throw new Exception("Field '$key' must be between -180 and 180");
  }

  private function validate_date($key, $value) {
    $parts = explode("-", $value);
    if (count($parts) != 3)
      throw new Exception("Field '$key' must be in the format YYYY-MM-DD");
    list($year, $month, $date) = $parts;
    if (!is_numeric($year))
      throw new Exception("Field '$key' year must be a number");
    if (!is_numeric($month))
      throw new Exception("Field '$key' month must be a number");
    if (!is_numeric($date))
      throw new Exception("Field '$key' date must be a number");
    if ($year < 1900 || $year > 2100)
      throw new Exception("Field '$key' year must be between 1900 to 2100");
    if ($month < 0 || $month > 12)
      throw new Exception("Field '$key' month must be between 1 to 12");
    if ($date < 1)
      throw new Exception("Field '$key' date is invalid");
    if (in_array(intval($month), array(1,3,5,7,8,10,12)) && $date > 31)
      throw new Exception("Field '$key' date is invalid for the month");
    if (in_array(intval($month), array(4,6,9,11)) && $date > 30)
      throw new Exception("Field '$key' date is invalid for the month");
    if ($month == 2 && $date > 29)
      throw new Exception("Field '$key' date is invalid for the month");
  }

  private function validate_options($key, $options, $value) {
    if (!in_array($value, $options)) {
      $message = "Field '$key' must be one of the options: ";
      $message.= implode(", ", $options);
      throw new Exception($message);
    }
  }

  private function validate_year($key, $value) {
    if (!is_numeric($value))
      throw new Exception("Field '$key' must be a number");
    if ($value < 1900 || $value > 2100)
      throw new Exception("Field '$key' must be between 1900 and 2100");
  }

  private function validate_min($key, $value, $min) {
    if (!is_numeric($value))
      throw new Exception("Field '$key' must be a number");
    if (floatval($value) < $min)
      throw new Exception("Field '$key' must be larger than or equal to $min");
  }

  private function validate_max($key, $value, $max) {
    if (!is_numeric($value))
      throw new Exception("Field '$key' must be a number");
    if (floatval($value) > $max)
      throw new Exception("Field '$key' must be smaller than or equal to $max");
  }

  private function validate_less_than($key, $less_than, $value, $less_than_value, $equal = false) {
    if (!isset($less_than_value)) return;
    if ($equal)
      $check = $value <= $less_than_value;
    else
      $check = $value < $less_than_value;

    $orEqualTo = $equal ? "or equal to " : "";

    if (!$check)
      throw new Exception("Field '$key' must be less than $orEqualTo'$less_than'");
  }

  private function validate_greater_than($key, $greater_than, $value, $greater_than_value, $equal = false) {
    if (!isset($greater_than_value)) return;
    if ($equal)
      $check = $value >= $greater_than_value;
    else
      $check = $value > $greater_than_value;

    $orEqualTo = $equal ? "or equal to " : "";

    if (!$check)
      throw new Exception("Field '$key' must be greater than $orEqualTo'$greater_than'");
  }

}
?>
