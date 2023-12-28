<?php
class Heroku
{
    private $connection;

    public function __construct($pdo)
    {
        $this->connection = $pdo;
    }

    public function prepare($sql)
    {
        return $this->connection->prepare($sql);
    }

    public function query($sql)
    {
        return $this->connection->query($sql);
    }

    public function fetch($result)
    {
        return $result->fetch(PDO::FETCH_ASSOC);
    }

    public function execute($sql)
    {
        return $this->connection->exec($sql);
    }
}

class Post
{
    private $db;
    private $role;

    public function __construct($db, $role)
    {
        $this->db = $db;
        $this->role = $role;
    }

    function createPost($username, $title, $description, $location, $file)
    {
        // Checks if the uploaded file is an image
        $imageInfo = getimagesize($file);
        if (!$imageInfo) {
            echo json_encode(['error' => 'Invalid file format. Only images are allowed.']);
            return false;
        }

        // Inserts a new post into the database
        $stmt = $this->db->prepare("INSERT INTO posts (username, title, description, location, file) VALUES (?, ?, ?, ?, ?)");
        $stmt->bindParam(1, $username);
        $stmt->bindParam(2, $title);
        $stmt->bindParam(3, $description);
        $stmt->bindParam(4, $location);
        $stmt->bindParam(5, $file);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    function getAllPosts()
    {
        $stmt = $this->db->prepare("SELECT id, username, title, description, location, file FROM posts");
        $stmt->execute();

        // Fetch all rows as associative arrays
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    function updatePost($id)
    {
        $stmt = $this->db->prepare("SELECT * FROM posts WHERE id = ?");
        $stmt->bindParam(1, $id);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result;
        } else {
            return null;
        }
    }

    function deletePost($id)
    {
        $stmt = $this->db->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->bindParam(1, $id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo "Post deleted successfully";
        } else {
            echo "Error deleting post";
        }
    }
}
