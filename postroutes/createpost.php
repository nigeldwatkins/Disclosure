<?php
header("Access-Control-Allow-Origin: https://nigeldwatkins.github.io"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");


require_once(__DIR__ . "/../Manager/posts.php");
require_once(__DIR__ . "/../config/mysql.php");

// Database connection
$db = new Database($pdo);

// Post instance
$role = 'post';
$post = new Post($db, 'post');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $username = $_POST['username'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $location = $_POST['location'];
    
    $file = $_FILES['file'];
    
    
    if (empty($title) && empty($description) && empty($location) && empty($_FILES['file']['name'])) {
        echo json_encode(['error' => 'ALL fields are empty']);
        exit;
    }

    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['error' => 'File upload failed']);
        exit;
    }

    $uploadDir = __DIR__ . '/../uploads'; 
    $uploadPath = $uploadDir  . '/' . basename($_FILES['file']['name']);

    if (move_uploaded_file($_FILES['file']['tmp_name'], $uploadPath)) {
        $file = base64_encode(file_get_contents($uploadPath));
    }
    
    $result = $post->createPost($username, $title, $description, $location, $file);

    echo json_encode($result);
}
?>