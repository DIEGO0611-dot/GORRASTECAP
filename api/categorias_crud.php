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

$action = $_GET['action'] ?? '';

switch($action) {
    case 'create':
        $nombre = $_POST['nombre'] ?? '';
        $stmt = $conn->prepare("INSERT INTO categorias(nombre) VALUES(:nombre)");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;
    
    case 'update':
        $id = $_POST['id'] ?? 0;
        $nombre = $_POST['nombre'] ?? '';
        $stmt = $conn->prepare("UPDATE categorias SET nombre = :nombre WHERE id = :id");
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;

    case 'delete':
        $id = $_POST['id'] ?? 0;
        $stmt = $conn->prepare("DELETE FROM categorias WHERE id = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        echo json_encode(["success" => true]);
        break;

    default:
        echo json_encode(["error" => "Acción no válida"]);
        break;
}
