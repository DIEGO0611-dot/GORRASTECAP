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

$gallery = [
    [
        'id' => 1,
        'image' => 'https://fabysport.com/wp-content/uploads/2023/05/gorra-america-roja-110P-A-min-700x700.webp',
        'title' => 'Edición Limitada'
    ],
    [
        'id' => 2,
        'image' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBU4lgGzub4gQBatXFYmeSK9607_3FLwzc0w&s',
        'title' => 'Lo Más Vendido'
    ],
    [
        'id' => 3,
        'image' => 'https://img.kwcdn.com/product/open/2023-04-13/1681375579598-f0a19e0250ce4582b917fe4005bd30e4-goods.jpeg?imageMogr2/auto-orient%7CimageView2/2/w/800/q/70/format/webp',
        'title' => 'Nuevos Colores'
    ],
];

echo json_encode($gallery);
