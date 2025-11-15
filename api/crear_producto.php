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

$stmt = $conn->prepare("INSERT INTO productos(nombre, descripcion, precio) 
VALUES(:n, :d, :p)");
$stmt->execute([
    ":n" => $data["nombre"],
    ":d" => $data["descripcion"],
    ":p" => $data["precio"]
]);

$producto_id = $conn->lastInsertId();

$stmt2 = $conn->prepare("INSERT INTO producto_categoria(producto_id, categoria_id) 
VALUES(:p, :c)");
$stmt2->execute([
    ":p" => $producto_id,
    ":c" => $data["categoria_id"]
]);

echo json_encode(["success" => true]);
