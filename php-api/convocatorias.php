<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM convocatorias ORDER BY created_at DESC");
    $convocatorias = $stmt->fetchAll();
    echo json_encode($convocatorias);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM convocatorias WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Convocatoria eliminada exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? '');
    $fileUrl = trim($input['fileUrl'] ?? $input['pdfUrl'] ?? '');
    $status = trim($input['status'] ?? 'vigente');

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(["error" => "El título de la convocatoria es obligatorio"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE convocatorias SET title = :title, fileUrl = :fileUrl, status = :status WHERE id = :id");
        $stmt->execute([':title' => $title, ':fileUrl' => $fileUrl, ':status' => $status, ':id' => $id]);
    } else {
        $newId = 'c-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO convocatorias (id, title, fileUrl, status) VALUES (:id, :title, :fileUrl, :status)");
        $stmt->execute([':id' => $newId, ':title' => $title, ':fileUrl' => $fileUrl, ':status' => $status]);
    }

    echo json_encode(["message" => "Convocatoria guardada exitosamente"]);
    exit();
}

if ($method === 'DELETE') {
    verifyAuthToken();
    $id = $_GET['id'] ?? '';
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM convocatorias WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
    echo json_encode(["message" => "Convocatoria eliminada exitosamente"]);
    exit();
}
