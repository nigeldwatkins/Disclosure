<?php
class Database
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

    public function execute($sql, $params = [])
    {
        $stmt = $this->connection->prepare($sql);
        return $stmt->execute($params);
    }
}
class userManager
{
    private $db;
    private $role;

    public function __construct($db, $role)
    {
        $this->db = $db;
        $this->role = $role;
    }

    public function createUser($name, $username, $email, $password)
    {
        $stmt = $this->db->prepare("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)");
        $params = [$name, $username, $email, $password];

        if ($this->db->execute($stmt, $params)) {
            return true;
        } else {
            return false;
        }
    }

    // Checks if email/username and password are provided or empty
    public function validateUserInput($username, $email, $password)
    {
        if (empty($username) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid data']);
            exit();
        }

        // Validate username format
        if (!preg_match("/^[a-zA-Z0-9_]+$/", $username)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid username format']);
            exit();
        }

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid email format']);
            exit();
        }

        // Validate password length 
        if (strlen($password) < 8) {
            http_response_code(400);
            echo json_encode(['error' => 'Password must be at least 8 characters long']);
            exit();
        }
    }

    public function getUserByEmail($email)
    {
        global $db;

        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $member = $result->fetch_assoc();
            return $member;
        } else {
            return false;
        }
    }

    public function isEmailTaken($email)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        if ($result->num_rows > 0) {
            $result->close();
            return true;
        } else {
            $result->close();
            return false;
        }
    }

    public function getUserByUsername($username)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($result) {
            return $result[0];
        } else {
            return false;
        }
    }

    public function isUsernameTaken($username)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            echo "Error: Username is already taken.";
            $stmt->close();
            return true;
        } else {
            $stmt->close();
            return false;
        }
    }

    public function getUserById($userId)
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $member = $result->fetch_assoc();
            return $member;
        } else {
            return false;
        }
    }

    public function login($username, $email, $password)
    {
        $stmt = $this->db->prepare("SELECT id, username, email, password FROM users WHERE username = ? OR email = ?");
        $params = [$username, $email];

        $result = $this->db->query($stmt, $params);
        $member = $this->db->fetch($result);

        if ($member && password_verify($password, $member['password'])) {
            $_SESSION['logged_in'] = [
                'username' => $member['username'],
                'email' => $member['email'],
            ];
            return true;
        }

        return false;
    }

    public function userData($name, $username, $email)
    {
        // Retrieves user data from database
        $stmt = $this->db->prepare("SELECT * FROM users WHERE name = ? AND username = ? AND email = ?");
        $stmt->bind_param("sss", $name, $username, $email);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Fetches and return user data
            $member = $result->fetch_assoc();
            return $member;
        } else {
            return false;
        }
    }

    public function updateUser($id, $name, $username, $email)
    {
        // Update user in the database based on user ID
        $stmt = $this->db->prepare("UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $name, $username, $email, $id);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteUser($id)
    {
        // Delete user from the database based on user ID
        $stmt = $this->db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    public function logout()
    {
    }
}

class userAuthentication
{
    private Database $db;

    public function __construct(Database $db)
    {
        $this->db = $db;
    }
}

class sessionManager
{

    private $db;

    public $role;
    public $username;
    public $id;

    public function __construct($db, $role, $username, $id)
    {
        $_SESSION['logged_in'] = $id;
    }

    public function createSession($member)
    {
        session_start();
        $logged_in = $_SESSION['logged_in'] ?? false;
    }

    function login()
    {
        session_regenerate_id(true); // Update session
        $_SESSION['logged_in'] = true;
    }

    function create()
    {
        session_regenerate_id(true); // Update session
        $_SESSION['user_id'] = true;
    }

    function require_login($logged_in)
    {
        if ($logged_in == false) {
            header('Location: login.php');
            exit;
        }
    }

    function logout()
    {
        $_SESSION = []; // Clear contents of array
        $params = session_get_cookie_params();
        setcookie('PHPSESSID', '', time() - 3600, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        session_destroy();
    }
}
?>