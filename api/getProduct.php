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
require_once "Database.php";

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID de producto no proporcionado']);
    exit;
}

$productId = intval($_GET['id']);

try {
    $db = new Database();
    $conn = $db->connect();

    $stmt = $conn->prepare("SELECT id, nombre, descripcion, precio, stock, imagen FROM productos WHERE id = :id");
    $stmt->bindParam(':id', $productId, PDO::PARAM_INT);
    $stmt->execute();
    $product = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($product) {
        echo json_encode($product);
    } else {
        echo json_encode(['error' => 'Producto no encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
