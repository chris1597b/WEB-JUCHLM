<?php
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Por favor ingresa la contraseña"]);
    exit();
}

$pdo = getDbConnection();
$stmt = $pdo->prepare("SELECT adminPasswordHash FROM site_config WHERE id = 1");
$stmt->execute();
$config = $stmt->fetch();

if (!$config || empty($config['adminPasswordHash'])) {
    // Si no existe fila o hash, crear la por defecto con hash de admin123
    $defaultHash = password_hash('admin123', PASSWORD_BCRYPT);
    $insertStmt = $pdo->prepare("INSERT INTO site_config (id, adminPasswordHash) VALUES (1, :hash) ON DUPLICATE KEY UPDATE adminPasswordHash = :hash");
    $insertStmt->execute([':hash' => $defaultHash]);
    $hash = $defaultHash;
} else {
    $hash = $config['adminPasswordHash'];
}

// Verificar contraseña de manera segura
if (password_verify($password, $hash)) {
    $token = "token_jushmchl_" . bin2hex(random_bytes(16));
    echo json_encode([
        "message" => "Inicio de sesión exitoso",
        "token" => $token,
        "user" => ["username" => "admin", "role" => "administrador"]
    ]);
} else {
    http_response_code(401);
    echo json_encode(["error" => "Contraseña incorrecta"]);
}
