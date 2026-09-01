<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_file = __DIR__ . '/db.json';

function get_json_db($db_file) {
    if (!file_exists($db_file)) return [];
    $content = file_get_contents($db_file);
    return json_decode($content, true) ?: [];
}

function save_json_db($db_file, $data) {
    file_put_contents($db_file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];

$pdo = null;
if (file_exists(__DIR__ . '/db.php')) {
    require_once __DIR__ . '/db.php';
    if (function_exists('getDbConnection')) {
        try {
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
        } catch (Exception $e) {
            $pdo = null;
        }
    }
}

if ($method === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM noticias ORDER BY created_at DESC");
            $rows = $stmt->fetchAll();
            if ($rows !== false) {
                echo json_encode($rows, JSON_UNESCAPED_UNICODE);
                exit();
            }
        } catch (Exception $e) {}
    }

    $db = get_json_db($db_file);
    $noticias = isset($db['noticias']) ? $db['noticias'] : [];
    echo json_encode($noticias, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    if (function_exists('verifyAuthToken')) {
        verifyAuthToken();
    }
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $db = get_json_db($db_file);
    if (!isset($db['noticias'])) $db['noticias'] = [];

    $action = isset($input['action']) ? $input['action'] : '';

    if ($action === 'DELETE') {
        $id = isset($input['id']) ? $input['id'] : '';
        if ($pdo) {
            try {
                $stmt = $pdo->prepare("DELETE FROM noticias WHERE id = :id");
                $stmt->execute([':id' => $id]);
            } catch (Exception $e) {}
        }
        $db['noticias'] = array_values(array_filter($db['noticias'], function($n) use ($id) {
            return $n['id'] !== $id;
        }));
        save_json_db($db_file, $db);

        echo json_encode(["message" => "Noticia eliminada exitosamente", "noticias" => $db['noticias']], JSON_UNESCAPED_UNICODE);
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

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO noticias (id, title, category, date, summary, imageUrl) 
                VALUES (:id, :title, :category, :date, :summary, :imageUrl)
                ON DUPLICATE KEY UPDATE 
                title=:title, category=:category, date=:date, summary=:summary, imageUrl=:imageUrl");
            $stmt->execute([
                ':id' => $id,
                ':title' => $title,
                ':category' => $category,
                ':date' => $date,
                ':summary' => $summary,
                ':imageUrl' => $imageUrl
            ]);
        } catch (Exception $e) {}
    }

    $found = false;
    foreach ($db['noticias'] as $index => $item) {
        if ($item['id'] === $id) {
            $db['noticias'][$index] = $newItem;
            $found = true;
            break;
        }
    }
    if (!$found) {
        array_unshift($db['noticias'], $newItem);
    }
    save_json_db($db_file, $db);

    echo json_encode(["message" => "Noticia guardada exitosamente", "noticias" => $db['noticias']], JSON_UNESCAPED_UNICODE);
    exit();
}
