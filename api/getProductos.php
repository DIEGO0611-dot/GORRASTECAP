<?php
// Habilitar CORS para todos los orígenes y métodos
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Manejo del preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'Database.php';

$db = new Database();
$conn = $db->connect();

try {
    $stmt = $conn->prepare("SELECT id, nombre AS name, precio, imagen FROM productos");
    $stmt->execute();
    $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($productos);
} catch(PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
