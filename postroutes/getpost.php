<?php
header("Access-Control-Allow-Origin: https://nigeldwatkins.github.io");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

require_once(__DIR__ . "/../Manager/posts.php");
require_once(__DIR__ . "/../config/mysql.php");

$db = new Database($pdo);

$postManager = new Post($db, 'post');

if ($postManager) {
    $username = isset($_GET['username']) ? $_GET['username'] : null;
    $id = isset($_GET['id']) ? $_GET['id'] : null;

    $allPosts = $postManager->getAllPosts();

    // Filter posts based on the provided username
    if ($id) {
        $filteredPosts = array_filter($allPosts, function ($post) use ($id) {
            return $post['id'] == $id;
        });

        $allPosts = array_values($filteredPosts);
    } elseif ($username) {
        $filteredPosts = array_filter($allPosts, function ($post) use ($username) {
            return $post['username'] === $username;
        });

        $allPosts = array_values($filteredPosts);
    }

    header('Content-Type: application/json');
    echo json_encode($allPosts); 
} else {
    http_response_code(500);
    echo json_encode(array('error' => 'Failed to create post manager'));
    exit();
}
?>