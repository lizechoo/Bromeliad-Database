<?php
require_once(__DIR__."/../response.php");

class Get {
  private $getInput;

  public function __construct() {
    $this->getInput = array();

    foreach ($_GET as $key => $value) {
      if ($key == "route" || $key == "action")
        continue;
      if ($value === 'true') $this->$key = true;
      else if ($value === 'false') $this->$key = false;
      else $this->$key = $value;
      $this->getInput[$key] = $value;
    }
  }

  public function expect() {
    $params = func_get_args();
    foreach ($params as $param) {
      if (!array_key_exists($param, $this->getInput))
        Response::error(400, "Missing '".$param."' field");
    }
  }
}

?>
