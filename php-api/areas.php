<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM areas ORDER BY title ASC");
    $areas = $stmt->fetchAll();
    echo json_encode($areas);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM areas WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Área eliminada exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? $input['name'] ?? '');
    $description = trim($input['description'] ?? '');
    $icon = trim($input['icon'] ?? 'bi-gear');
    $color = trim($input['color'] ?? '#20c997');

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(["error" => "El nombre del área es obligatorio"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE areas SET title = :title, description = :description, icon = :icon, color = :color WHERE id = :id");
        $stmt->execute([':title' => $title, ':description' => $description, ':icon' => $icon, ':color' => $color, ':id' => $id]);
    } else {
        $newId = 'area-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO areas (id, title, description, icon, color) VALUES (:id, :title, :description, :icon, :color)");
        $stmt->execute([':id' => $newId, ':title' => $title, ':description' => $description, ':icon' => $icon, ':color' => $color]);
    }

    echo json_encode(["message" => "Área guardada exitosamente"]);
    exit();
}
