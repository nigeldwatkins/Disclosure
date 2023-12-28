<?php
// Load Composer autoloader
require_once __DIR__ . '/vendor/autoload.php';

use FastRoute\RouteCollector;
use FastRoute\Dispatcher;

// Include route for users files

include_once(__DIR__ . "/userroutes/login.php");
include_once(__DIR__ . "/userroutes/logout.php");


// includes routes for post files
include_once(__DIR__ . "/postroutes/createpost.php");
include_once(__DIR__ . "/postroutes/getpost.php");


// Include your classes
include_once(__DIR__ . "/Manager/user.php");
include_once(__DIR__ . "/Manager/posts.php");


// Create a route collector
$router = new RouteCollector(new \FastRoute\RouteParser\Std(), new \FastRoute\DataGenerator\GroupCountBased());



// Dispatch the request
$httpMethod = $_SERVER['REQUEST_METHOD'];
$uri = $_SERVER['REQUEST_URI'];

$dispatcher = new Dispatcher\GroupCountBased($router->getData());

$routeInfo = $dispatcher->dispatch($httpMethod, $uri);


switch ($routeInfo[0]) {
    case Dispatcher::NOT_FOUND:
        http_response_code(404);
        
       
       
        break;
    case Dispatcher::METHOD_NOT_ALLOWED:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
    case Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        // Call the handler with the matched variables
        call_user_func_array($handler, $vars);
        break;
    default:
        http_response_code(500);
        echo json_encode(['error' => 'Internal server error']);
        break;
}
?>