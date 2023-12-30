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
     
    session_unset();

    session_destroy();

    // Returns success response 
    http_response_code(200);
    echo json_encode(['message' => 'User logged out successfully']);
    exit();
} else {
    // Handle unsupported HTTP methods
    http_response_code(405); // Method Not Allowed
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}
?>