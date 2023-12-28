<?php
use Firebase\JWT\JWT;
header("Access-Control-Allow-Origin:  https://nigeldwatkins.github.io"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

require_once(__DIR__ . "/../Manager/user.php");
require_once(__DIR__ . "/../config/mysql.php");


// Database connection
$db = new Database($pdo);

// User instance
$member = new userManager($db, 'user');

// UserAuthentication
$userAuth = new userAuthentication($db);

   // handles POST request for user login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];


    $user = $member->getUserByUsername($username) ?? $member->getUserByEmail($email);

    if ($user && password_verify($password, $user['password'])) {

      // Create a JWT token
      $secret_key = "testing"; 
      $token = JWT::encode(['username' => $username], $secret_key, 'HS256');

      // Set the JWT token as a cookie
      setcookie('jwt_token', $token, time() + 4800, '/', '.github.io', true, true);

      echo json_encode(['success' => true, 'token' => $token]);
        exit();
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
        exit();
    }
}
?>