<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM galeria ORDER BY created_at DESC");
    $galeria = $stmt->fetchAll();
    echo json_encode($galeria);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM galeria WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Imagen eliminada de la galería"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $imageUrl = trim($input['imageUrl'] ?? '');

    if (empty($title) || empty($imageUrl)) {
        http_response_code(400);
        echo json_encode(["error" => "El título y la URL de imagen son obligatorios"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE galeria SET title = :title, description = :description, imageUrl = :imageUrl WHERE id = :id");
        $stmt->execute([':title' => $title, ':description' => $description, ':imageUrl' => $imageUrl, ':id' => $id]);
    } else {
        $newId = 'g-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO galeria (id, title, description, imageUrl) VALUES (:id, :title, :description, :imageUrl)");
        $stmt->execute([':id' => $newId, ':title' => $title, ':description' => $description, ':imageUrl' => $imageUrl]);
    }

    echo json_encode(["message" => "Imagen guardada en la galería"]);
    exit();
}
