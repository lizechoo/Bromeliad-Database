<?php
require_once(__DIR__."/utils/prettyJSON.php");

function set_response_code($code) {
  header('Content-Type: application/json; charset=utf-8', true, $code);
}

class Response {

  public static function success($results = null) {
    set_response_code(200);
    $response = array("success" => true);
    if (isset($results))
      $response['results'] = $results;
    echo prettyPrint(json_encode($response));
    exit(0);
  }

  public static function error($code, $error) {
    set_response_code($code);
    $response = array("success" => false, "error" => $error);
    echo prettyPrint(json_encode($response));
    exit(0);
  }

}
?>
