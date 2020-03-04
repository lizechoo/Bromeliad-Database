<?php

$SETTINGS = array();

$SETTINGS['jwt_secret'] = "dMZDEeXGbgPvFdX5XqPL";

$SETTINGS['roles'] = array(
  "admin" => array("user"),
  "user" => array(),
);

$SETTINGS['access'] = array(
  "get" => array(
    "users" => array(
      "logout" => array("user"),
      "all" => array("admin"),
      "current" => array("user")
    ),
    "species" => array(
      "list" => array("user"),
      "traits-list" => array("user"),
      "check-species" => array("user"),
      "auto-complete" => array("user"),
      "log" => array("user"),
      "suggest" => array("user"),
      "dataset" => array("user")
    ),
    "datasets" => array(
      "list" => array("user")
    ),
    "visits" => array(
      "list" => array("user")
    ),
    "bromeliads" => array(
      "list" => array("user")
    ),
    "measurements" => array(
      "list" => array("user")
    ),
    "matrix" => array(
      "list" => array("user")
    ),
    "dashboard" => array(
      "summary" => array("user")
    ),
    "tachet" => array(
      "list" => array("user")
    ),
    "markdowns" => array(
      "list" => array("user")
    ),
    "logs" => array(
      "list" => array("user"),
      "comments" => array("user")
    ),
    "files" => array(
      "info" => array("user"),
      "retrieve" => array("user"),
      "image" => array()
    ),
    "admin" => array(
      "backup" => array("admin")
    )
  ),
  "post" => array(
    "users" => array(
      "login" => array(),
      "recover" => array(),
      "reset" => array(),
      "edit" => array("user"),
      "create" => array("admin"),
      "delete" => array("user"),
      "upload" => array("user"),
      "avatar" => array("user")
    ),
    "species" => array(
      "new" => array("user"),
      "edit" => array("user"),
      "delete" => array("user"),
      "upload" => array("user")
    ),
    "datasets" => array(
      "new" => array("user"),
      "edit" => array("user"),
      "delete" => array("admin")
    ),
    "visits" => array(
      "new" => array("user"),
      "edit" => array("user"),
      "delete" => array("user")
    ),
    "bromeliads" => array(
      "new" => array("user"),
      "edit" => array("user"),
      "delete" => array("user")
    ),
    "measurements" => array(
      "new" => array("user"),
      "edit" => array("user"),
      "delete" => array("user"),
      "deleteID" => array("user")
    ),
    "matrix" => array(
      "edit" => array("user")
    ),
    "tachet" => array(
      "new" => array("admin"),
      "edit" => array("admin"),
      "delete" => array("admin")
    ),
    "markdowns" => array(
      "edit" => array("admin"),
      "upload" => array("admin")
    ),
    "logs" => array(
      "comment" => array("user")
    ),
  )
);
?>
