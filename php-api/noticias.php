<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

require_once __DIR__ . '/db.php';
$pdo = getDbConnection();
$pdo->exec("CREATE TABLE IF NOT EXISTS noticias (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) DEFAULT 'Institucional',
    date VARCHAR(50),
    summary TEXT,
    imageUrl VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT id, title, category, date, summary, imageUrl FROM noticias ORDER BY created_at DESC");
    echo json_encode($stmt->fetchAll(), JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true) ?: [];

    $action = isset($input['action']) ? $input['action'] : '';

    if ($action === 'DELETE') {
        $id = isset($input['id']) ? $input['id'] : '';
        $stmt = $pdo->prepare("DELETE FROM noticias WHERE id = :id");
        $stmt->execute([':id' => $id]);

        echo json_encode(["message" => "Noticia eliminada exitosamente"], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $id = isset($input['id']) && !empty($input['id']) ? $input['id'] : "n-" . time();
    $title = isset($input['title']) ? $input['title'] : '';
    $category = isset($input['category']) ? $input['category'] : 'Institucional';
    $date = isset($input['date']) ? $input['date'] : date("d/m/Y");
    $summary = isset($input['summary']) ? $input['summary'] : '';
    $imageUrl = isset($input['imageUrl']) ? $input['imageUrl'] : '';

    $newItem = [
        "id" => $id,
        "title" => $title,
        "category" => $category,
        "date" => $date,
        "summary" => $summary,
        "imageUrl" => $imageUrl
    ];

    $stmt = $pdo->prepare("INSERT INTO noticias (id, title, category, date, summary, imageUrl)
        VALUES (:id, :title, :category, :date, :summary, :imageUrl)
        ON DUPLICATE KEY UPDATE
        title=VALUES(title),
        category=VALUES(category),
        date=VALUES(date),
        summary=VALUES(summary),
        imageUrl=VALUES(imageUrl)");
    $stmt->execute([
        ':id' => $id,
        ':title' => $title,
        ':category' => $category,
        ':date' => $date,
        ':summary' => $summary,
        ':imageUrl' => $imageUrl
    ]);

    echo json_encode(["message" => "Noticia guardada exitosamente", "noticia" => $newItem], JSON_UNESCAPED_UNICODE);
    exit();
}
