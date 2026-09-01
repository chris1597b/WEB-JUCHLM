<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, title, description, imageUrl, active, created_at FROM avisos ORDER BY created_at DESC");
    $avisos = $stmt->fetchAll();
    // Convert active to boolean
    foreach ($avisos as &$a) {
        $a['active'] = (bool)($a['active'] ?? true);
    }
    echo json_encode($avisos);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'TOGGLE_MODAL_GLOBAL' || $action === 'TOGGLE_MODAL') {
        $stmt = $pdo->query("SELECT modalAvisosActive FROM site_config WHERE id = 1");
        $config = $stmt->fetch();
        $current = isset($config['modalAvisosActive']) ? (bool)$config['modalAvisosActive'] : true;
        $next = !$current;

        $update = $pdo->prepare("UPDATE site_config SET modalAvisosActive = :val WHERE id = 1");
        $update->execute([':val' => $next ? 1 : 0]);

        echo json_encode([
            "message" => "Modal de anuncios " . ($next ? "activado" : "desactivado") . " globalmente",
            "modalAvisosActive" => $next
        ]);
        exit();
    }

    if ($action === 'TOGGLE_ACTIVE' || $action === 'TOGGLE') {
        $id = $input['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(["error" => "ID requerido"]);
            exit();
        }
        $stmt = $pdo->prepare("SELECT active FROM avisos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch();
        if (!$row) {
            http_response_code(404);
            echo json_encode(["error" => "Anuncio no encontrado"]);
            exit();
        }
        $next = !((bool)$row['active']);
        $update = $pdo->prepare("UPDATE avisos SET active = :active WHERE id = :id");
        $update->execute([':active' => $next ? 1 : 0, ':id' => $id]);

        echo json_encode([
            "message" => "Anuncio " . ($next ? "activado" : "desactivado") . " exitosamente"
        ]);
        exit();
    }

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM avisos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Anuncio eliminado exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $imageUrl = trim($input['imageUrl'] ?? '');
    $active = isset($input['active']) ? ($input['active'] ? 1 : 0) : 1;

    if (empty($title) || empty($imageUrl)) {
        http_response_code(400);
        echo json_encode(["error" => "El título y la URL de imagen son obligatorios"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE avisos SET title = :title, description = :description, imageUrl = :imageUrl, active = :active WHERE id = :id");
        $stmt->execute([':title' => $title, ':description' => $description, ':imageUrl' => $imageUrl, ':active' => $active, ':id' => $id]);
    } else {
        $newId = 'a-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO avisos (id, title, description, imageUrl, active) VALUES (:id, :title, :description, :imageUrl, :active)");
        $stmt->execute([':id' => $newId, ':title' => $title, ':description' => $description, ':imageUrl' => $imageUrl, ':active' => $active]);
    }

    echo json_encode(["message" => "Anuncio guardado exitosamente"]);
    exit();
}

if ($method === 'DELETE') {
    verifyAuthToken();
    $id = $_GET['id'] ?? '';
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM avisos WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
    echo json_encode(["message" => "Anuncio eliminado exitosamente"]);
    exit();
}
