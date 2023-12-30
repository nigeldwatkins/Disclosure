<?php
header("Access-Control-Allow-Origin: https://nigeldwatkins.github.io"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: https://nigeldwatkins.github.io");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Access-Control-Allow-Credentials: true");
    exit();
}

require_once(__DIR__ . "/../Manager/user.php");
require_once(__DIR__ . "/../config/mysql.php");

session_start();

// Handles POST request for logging out
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     
    setcookie('jwt_token', '', time() - 3600, '/', '.github.io', true, true);

    header("Content-Type: application/json");

    // Returns success response 
    http_response_code(200);
    echo json_encode(['message' => 'User logged out successfully']);
    exit();
}
?>