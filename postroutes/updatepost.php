<?php
header("Access-Control-Allow-Origin:  https://nigeldwatkins.github.io"); 
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

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $id = $_POST['id'];
    $title = $_POST['title'];
    $description = $_POST['description'];
    $location = $_POST['location'];

    if (empty($title) && empty($description) && empty($location)) {
        echo json_encode(['error' => 'All fields are empty']);
        exit;
    }

    $result = $post->updatePost($id, $title, $description, $location);

    echo json_encode($result);
}
?>