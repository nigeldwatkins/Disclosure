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

// DELETE for removing/deleting a user from database
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

    $id = $data['id'];

    // Validates data (you can add more validation here)
    if (!empty($id)) {
        $user = new userManager($db, $role);
        $result = $user->deleteUser($id);

        if ($result) {
            echo json_encode(['message' => 'User deleted successfully']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete user']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
}
?>