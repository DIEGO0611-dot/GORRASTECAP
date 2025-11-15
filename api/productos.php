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
include 'Database.php';

$db = new Database();
$conn = $db->connect();

$categoria_id = $_GET['categoria'] ?? null;

if ($categoria_id) {
    $stmt = $conn->prepare("
        SELECT p.*, pc.categoria_id 
        FROM productos p 
        JOIN producto_categoria pc ON p.id = pc.producto_id 
        WHERE pc.categoria_id = :categoria_id
    ");
    $stmt->bindParam(':categoria_id', $categoria_id);
} else {
    $stmt = $conn->prepare("SELECT * FROM productos");
}

$stmt->execute();
$productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($productos);
