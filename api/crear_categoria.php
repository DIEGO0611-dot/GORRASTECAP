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
require "Database.php";
$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"), true);
$nombre = $data["nombre"];

$stmt = $conn->prepare("INSERT INTO categorias(nombre) VALUES(:n)");
$stmt->execute([":n" => $nombre]);

echo json_encode(["success" => true]);
