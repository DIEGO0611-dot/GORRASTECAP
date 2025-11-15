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

$db = new Database();
$conn = $db->connect();

$method = $_SERVER["REQUEST_METHOD"];
$action = $_GET["action"] ?? null;

if ($method === "POST" && $action === "register") {
    $data = json_decode(file_get_contents("php://input"), true);

    $nombre = $data["nombre"] ?? "";
    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";

    if (!$nombre || !$email || !$password) {
        echo json_encode(["error" => "Faltan datos"]);
        exit;
    }

    // Rol cliente por defecto (id=2)
    $rol = 2;

    try {
        $sql = "INSERT INTO usuarios (nombre, email, password, rol_id) 
                VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$nombre, $email, $password, $rol]);

        echo json_encode(["success" => true, "message" => "Usuario registrado", "user" => $stmt->fetch(PDO::FETCH_ASSOC)]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "El email ya está registrado"]);
    }
    exit;
}

if ($method === "POST" && $action === "login") {
    $data = json_decode(file_get_contents("php://input"), true);

    $email = $data["email"] ?? "";
    $password = $data["password"] ?? "";

    if (!$email || !$password) {
        echo json_encode(["error" => "Faltan datos"]);
        exit;
    }

    $sql = "SELECT * FROM usuarios WHERE email = ? LIMIT 1";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);



    // Comparación directa (texto plano)
    if (isset($user["password"]) && $user["password"] === $password) {
        unset($user["password"]); // nunca devolver la contraseña
        echo json_encode([
            "success" => true,
            "user" => $user
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "error" => "Credenciales inválidas"
        ]);
    }

    exit;
}

echo json_encode(["error" => "Petición inválida"]);
