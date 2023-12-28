<?php

// Use JAWSDB_URL for database connection if available
$dbUrl = getenv('JAWSDB_URL') ?: "";
if (!empty($dbUrl)) {
    $dbParams = parse_url($dbUrl);

    $host = $dbParams['host'];
    $port = $dbParams['port'];
    $username = $dbParams['user'];
    $password = $dbParams['pass'];
    $database = ltrim($dbParams['path'], '/');
} else {
    // Fallback to manual configuration if JAWSDB_URL is not available
    $host = getenv('DB_SERVERNAME') ?: "";
    $username = getenv('DB_USERNAME') ?: "";
    $password = getenv('DB_PASSWORD') ?: "";
    $database = getenv('DB_DATABASE') ?: "";
    $port = getenv('DB_PORT') ?: 3306;
}



$dsn = "mysql:host=$host;dbname=$database;port=$port;charset=utf8";


try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("set names utf8");

} catch (PDOException $e) {
    // Log the error
    error_log("Connection failed: " . $e->getMessage());

    // Return a generic error message to the client
    die("Connection failed. Error details: " . $e->getMessage());
}
?>