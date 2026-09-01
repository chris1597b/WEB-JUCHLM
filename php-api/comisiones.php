<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM comisiones ORDER BY name ASC");
    $comisiones = $stmt->fetchAll();
    echo json_encode($comisiones);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM comisiones WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Comisión eliminada exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $name = trim($input['name'] ?? '');
    $logo = trim($input['logo'] ?? '');
    $cover = trim($input['cover'] ?? '');
    $description = trim($input['description'] ?? '');
    $presidente = trim($input['presidente'] ?? '');
    $direccion = trim($input['direccion'] ?? '');
    $usuarios = trim($input['usuarios'] ?? '');
    $area = trim($input['area'] ?? '');

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(["error" => "El nombre de la comisión es obligatorio"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE comisiones SET name = :name, logo = :logo, cover = :cover, description = :description, presidente = :presidente, direccion = :direccion, usuarios = :usuarios, area = :area WHERE id = :id");
        $stmt->execute([
            ':name' => $name,
            ':logo' => $logo,
            ':cover' => $cover,
            ':description' => $description,
            ':presidente' => $presidente,
            ':direccion' => $direccion,
            ':usuarios' => $usuarios,
            ':area' => $area,
            ':id' => $id
        ]);
    } else {
        $newId = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $name)) ?: ('com-' . round(microtime(true) * 1000));
        $stmt = $pdo->prepare("INSERT INTO comisiones (id, name, logo, cover, description, presidente, direccion, usuarios, area) VALUES (:id, :name, :logo, :cover, :description, :presidente, :direccion, :usuarios, :area)");
        $stmt->execute([
            ':id' => $newId,
            ':name' => $name,
            ':logo' => $logo,
            ':cover' => $cover,
            ':description' => $description,
            ':presidente' => $presidente,
            ':direccion' => $direccion,
            ':usuarios' => $usuarios,
            ':area' => $area
        ]);
    }

    echo json_encode(["message" => "Comisión guardada exitosamente"]);
    exit();
}

if ($method === 'DELETE') {
    verifyAuthToken();
    $id = $_GET['id'] ?? '';
    if ($id) {
        $stmt = $pdo->prepare("DELETE FROM comisiones WHERE id = :id");
        $stmt->execute([':id' => $id]);
    }
    echo json_encode(["message" => "Comisión eliminada exitosamente"]);
    exit();
}
