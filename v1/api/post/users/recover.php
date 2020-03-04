<?php
require_once(__DIR__."/../../models/utils/bcrypt.php");
require_once(__DIR__."/../../models/utils/jwt.php");

$post->expect("email");

try {
  $query = QB::table('users');
  $query->where('email', trim($post->email));
  $query->setFetchMode(PDO::FETCH_ASSOC);

  $results = $query->get();
  if (sizeof($results) == 0) {
    Response::error(400, "Email not found");
  } else {
    $firstUser = $results[0];
    $user = User::fromDatabase($firstUser);

    $token = $user->token;
    sendEmail($user->email, $token);

    Response::success("Email sent to ".$user->email);
  }
} catch (PDOException $e) {
  Response::error(500, "Server error: PDOException at recover.php");
}



// Send an email to the user with the password recovery token
function sendEmail($email, $token) {
  $subject = "BWGdb Password Reset";
  $message = "We received a password reset request of a user with this email.\n\n";
  $message.= "You may reset your password by following the link:\n\n";
  $message.= URL . "/#/recover/".$token;

  $headers = "From:no-reply@zoology.ubc.ca\r\n";
  try {
    mail($email, $subject, $message, $headers);
  } catch (Exception $e) {
    Response::error(500, "Unable to send password recovery email");
  }
}

?>
