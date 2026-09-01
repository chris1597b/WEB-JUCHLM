<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// Auto-migration: add documentUrl column if not present
try {
    $pdo->exec("ALTER TABLE normativas ADD COLUMN IF NOT EXISTS documentUrl VARCHAR(512) DEFAULT ''");
} catch (Exception $e) { /* already exists */ }

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM normativas ORDER BY created_at DESC");
    $normativas = $stmt->fetchAll();
    echo json_encode($normativas);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM normativas WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Normativa eliminada exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $documentUrl = trim($input['documentUrl'] ?? '');

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(["error" => "El título de la normativa es obligatorio"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE normativas SET title = :title, description = :description, documentUrl = :documentUrl WHERE id = :id");
        $stmt->execute([':title' => $title, ':description' => $description, ':documentUrl' => $documentUrl, ':id' => $id]);
    } else {
        $newId = 'n-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO normativas (id, title, description, documentUrl) VALUES (:id, :title, :description, :documentUrl)");
        $stmt->execute([':id' => $newId, ':title' => $title, ':description' => $description, ':documentUrl' => $documentUrl]);
    }

    echo json_encode(["message" => "Normativa guardada exitosamente"]);
    exit();
}
