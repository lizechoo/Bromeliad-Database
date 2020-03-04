<?php
require_once(__DIR__.'./../settings.php');

class UserException extends Exception {
  public $field;

  public static function invalid($field, $message) {
    $exception = new self();
    $exception->message = $message;
    $exception->field = $field;
    return $exception;
  }
}

class User {
  public $id;
  public $username;
  public $password;
  public $name;
  public $email;
  public $role;
  public $hash;
  public $token;

  public static function fromLogin($username, $password) {
    $instance = new self();
    $instance->setUsername($username);
    $instance->setPassword($password);
    return $instance;
  }

  public static function fromDatabase($row) {
    $instance = new self();
    $instance->setId($row['id']);
    $instance->setUsername($row['username']);
    $instance->setHash($row['password']);
    $instance->setEmail($row['email']);
    $instance->setRole($row['role']);
    $instance->setName($row['name']);
    $instance->setToken($row['token']);
    return $instance;
  }

  public static function fromEdit($username) {
    $instance = new self();
    $instance->setUsername($username);
    return $instance;
  }

  public static function create($username, $password, $email, $name, $role) {
    $instance = new self();
    $instance->setUsername($username);
    $instance->setPassword($password);
    $instance->setEmail($email);
    $instance->setRole($role);
    $instance->setName($name);
    $token = $instance->randomToken();
    $instance->setToken($token);
    return $instance;
  }

  public function setId($id) {
    $this->id = $id;
  }

  // secret for JWT token
  public function setToken($token) {
    $this->token = $token;
  }
  // hashed password stored in database
  public function setHash($hash) {
    $this->hash = $hash;
  }

  public function setHashFromPassword($password) {
    $this->hash = $this->hashPassword($password);
  }

  public function verifyPassword($password) {
    return hashPassword($password) === $this->hash;
  }

  public function setUsername($username) {
    if (!$this->isString($username))
      throw UserException::invalid('username', 'Username must be a string');
    $username = trim($username);
    if ($this->isEmpty($username))
      throw UserException::invalid('username', 'Username must not be empty');
    if (!$this->hasLength($username, 4))
      throw UserException::invalid('username', 'Username must have at least 4 characters');
    if (preg_match('/[^a-z_\-0-9]/i', $username))
      throw UserException::invalid('username', 'Username must contain only alphanumeric characters or underscore');
    $this->username = $username;
  }

  public function setPassword($password) {
    if (!$this->isString($password))
      throw UserException::invalid('password', 'Password must be a string');
    if ($this->isEmpty($password))
      throw UserException::invalid('password', 'Password must not be empty');
    if (!$this->hasLength($password, 4, 16))
      throw UserException::invalid('password', 'Password must be between 4 and 16 characters');
    $this->password = $password;
    $this->setHashFromPassword($password);
  }

  public function setEmail($email) {
    if (!$this->isString($email))
      throw UserException::invalid('email', 'Email must be a string');
    if ($this->isEmpty($email))
      throw UserException::invalid('email', 'Email must not be empty');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
      throw UserException::invalid('email', 'Email is invalid');
    $this->email = $email;
  }

  public function setName($name) {
    if (!$this->isString($name))
      throw UserException::invalid('name', 'Name must be a string');
    if ($this->isEmpty($name))
      throw UserException::invalid('name', 'Name must not be empty');
    $this->name = $name;
  }

  public function setRole($role) {
    global $SETTINGS;
    if (!array_key_exists ($role, $SETTINGS['roles']))
      throw UserException::invalid('role', 'Role is invalid');
    $this->role = $role;
  }

  public function toArray() {
    $array = array();
    if (isset($this->username))
      $array['username'] = $this->username;
    if (isset($this->email))
      $array['email'] = $this->email;
    if (isset($this->name))
      $array['name'] = $this->name;
    if (isset($this->role))
      $array['role'] = $this->role;
    return $array;
  }

  private function isString($input) {
    return is_string($input);
  }

  private function isEmpty($string) {
    return empty($string);
  }

  private function hasLength($string, $min, $max = INF) {
    $length = strlen($string);
    return $length >= $min && $length <= $max;
  }

  private function hashPassword($password) {
    return hash("sha256", $password);
  }

  public function getHash() {
      return $this->hash;
  }

  public function getToken() {
      return $this->token;
  }

  private function randomToken() {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < 15; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
  }

  public function setNewToken() {
      $this->setToken($this->randomToken());
  }

}

function updateUser($user, $updated) {
  $query = QB::table('users');
  $query->where("username", $user->username);
  try {
    $query->update($updated);
  } catch (PDOException $e) {
    Response::error(500, "User update failed: ".$e->getMessage());
  }
  Response::success();
}



?>
