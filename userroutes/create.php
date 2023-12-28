<?php
header("Access-Control-Allow-Origin:  https://nigeldwatkins.github.io"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


require_once(__DIR__ . "/../config/mysql.php");
require_once(__DIR__ . "/../Manager/user.php");


// Database connection
$db = new Database($pdo);

// User instance
$user = new userManager($db, 'user');

// UserAuthentication
$userAuth = new UserAuthentication($db);

// Handles POST request for user creation
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Decodes JSON data to associative array
    $data = json_decode(file_get_contents('php://input'), true);
   
    if ($data === null) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit();
    }

    $name = $data['name'];
    $username = $data['username'];
    $email = $data['email'];
    $password = $data['password'];

    // Check if username already exists
    if ($user->isUsernameTaken($username) || $user->isEmailTaken($email)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username is already taken']);
        exit();
    }

    $member = $user->validateUserInput($username, $email, $password);

    // Hash the password using bcrypt
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $role = 'user';
    
    // Create a new user instance by passing the database connection and role
    $user = new userManager($db, $role);
    $result = $user->createUser($name, $username, $email, $hashedPassword);

    if ($result) {
        echo json_encode(['message' => 'User created successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create user']);
    }
}
?>