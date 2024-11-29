<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require_once '../config/database.php';
require_once 'controllers/CategoryController.php';
require_once 'controllers/ProductController.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get database connection
$database = new Database();
$conn = $database->connect();

if (!$conn) {
    echo json_encode(['error' => true, 'message' => 'Database connection failed']);
    exit();
}

// Parse the request URL
$request_uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$endpoints = explode('/', trim($request_uri, '/'));
$endpoint = end($endpoints);

// Route the request to the appropriate controller
try {
    switch ($endpoint) {
        case 'categories':
            $controller = new CategoryController($conn);
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $result = $controller->getAll();
                echo json_encode(['error' => false, 'data' => $result]);
            } else {
                throw new Exception('Method not allowed', 405);
            }
            break;

        case 'products':
            $controller = new ProductController($conn);
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $category = isset($_GET['category']) ? $_GET['category'] : null;
                $result = $controller->getAll($category);
                echo json_encode(['error' => false, 'data' => $result]);
            } else {
                throw new Exception('Method not allowed', 405);
            }
            break;

        default:
            throw new Exception('Endpoint not found', 404);
    }
} catch (Exception $e) {
    http_response_code($e->getCode() ?: 500);
    echo json_encode([
        'error' => true,
        'message' => $e->getMessage()
    ]);
}