<?php
require_once __DIR__ . '/db.php';
verifyAuthToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
$currentPassword = trim($input['currentPassword'] ?? '');
$newPassword = trim($input['newPassword'] ?? '');

if (empty($currentPassword) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode(["error" => "Se requiere la contraseña actual y la nueva contraseña"]);
    exit();
}

$pdo = getDbConnection();
$stmt = $pdo->prepare("SELECT adminPasswordHash FROM site_config WHERE id = 1");
$stmt->execute();
$config = $stmt->fetch();

$hash = $config['adminPasswordHash'] ?? '';

if (!password_verify($currentPassword, $hash)) {
    http_response_code(400);
    echo json_encode(["error" => "La contraseña actual es incorrecta"]);
    exit();
}

$newHash = password_hash($newPassword, PASSWORD_BCRYPT);
$updateStmt = $pdo->prepare("UPDATE site_config SET adminPasswordHash = :hash WHERE id = 1");
$updateStmt->execute([':hash' => $newHash]);

echo json_encode(["message" => "Contraseña actualizada con éxito"]);
