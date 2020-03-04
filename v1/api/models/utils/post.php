<?php
require_once(__DIR__."/../response.php");
require_once(__DIR__."/jsonHandler.php");

class Post {
  public function __construct() {
    if (isset($_FILES) && count($_FILES) > 0)
      return;

    $inputJSON = file_get_contents('php://input');
    try {
      $this->postInput = JsonHandler::decode($inputJSON);
      foreach ($this->postInput as $key => $value) {
        $this->$key = $value;
      }
    } catch (RuntimeException $e) {
      if ($e->getMessage() == 'No error has occurred') {
        Response::error(400, "POST data body is empty");
      } else {
        Response::error(400, "Invalid JSON: ".$e->getMessage());
      }
    }
  }

  public function expect() {
    $params = func_get_args();
    foreach ($params as $param) {
      if (!array_key_exists($param, $this->postInput))
        Response::error(400, "Missing '".$param."' field");
    }
  }
}

?>
