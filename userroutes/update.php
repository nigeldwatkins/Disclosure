<?php
header("Access-Control-Allow-Origin:  https://nigeldwatkins.github.io"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
exit();
}

require_once (__DIR__ . "/../models/user.php");
require_once(__DIR__ . "/../Auth/userauth.php");
require_once(__DIR__ . "/../database/database.php");
require_once(__DIR__ . "/../config/db.php");

// Database connection
$db = new Database($conn);

// User instance
$user = new userManager($db, 'user');

// UserAuthentication
$userAuth = new UserAuthentication($db);

// PUT for updating a user information
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

    $id = $data['id'];
    $name = $data['name'];
    $username = $data['username'];
    $email = $data['email'];

    // Validate data (you can add more validation here)
    if (!empty($id) && !empty($name) && !empty($username) && !empty($email)) {
        $user = new userManager($db, $role);
        $result = $user->updateUser($id, $name, $username, $email);

        if ($result) {
            echo json_encode(['message' => 'User updated successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update user']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
}
?>