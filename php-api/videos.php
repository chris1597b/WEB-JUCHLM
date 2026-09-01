<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

function formatYouTubeUrl($url) {
    if (empty($url)) return "";
    $url = trim($url);

    // Si el usuario pegó el código iframe completo
    if (preg_match('/src=["\']([^"\']+)["\']/i', $url, $matches)) {
        $url = $matches[1];
    }

    // Extraer ID de video de 11 caracteres de cualquier formato de YouTube
    $pattern = '/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i';
    if (preg_match($pattern, $url, $matches)) {
        return 'https://www.youtube.com/embed/' . $matches[1];
    }

    return $url;
}

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM videos ORDER BY created_at DESC");
    $videos = $stmt->fetchAll();
    foreach ($videos as &$v) {
        if (!empty($v['videoUrl'])) {
            $v['videoUrl'] = formatYouTubeUrl($v['videoUrl']);
        }
    }
    echo json_encode($videos);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM videos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Video eliminado exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? '');
    $description = trim($input['description'] ?? '');
    $rawVideoUrl = trim($input['videoUrl'] ?? '');
    $category = trim($input['category'] ?? 'General');

    if (empty($title) || empty($rawVideoUrl)) {
        http_response_code(400);
        echo json_encode(["error" => "El título y la URL del video son obligatorios"]);
        exit();
    }

    $videoUrl = formatYouTubeUrl($rawVideoUrl);

    if ($id) {
        $stmt = $pdo->prepare("UPDATE videos SET title = :title, description = :description, videoUrl = :videoUrl, category = :category WHERE id = :id");
        $stmt->execute([':title' => $title, ':description' => $description, ':videoUrl' => $videoUrl, ':category' => $category, ':id' => $id]);
    } else {
        $newId = 'v-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO videos (id, title, description, videoUrl, category) VALUES (:id, :title, :description, :videoUrl, :category)");
        $stmt->execute([':id' => $newId, ':title' => $title, ':description' => $description, ':videoUrl' => $videoUrl, ':category' => $category]);
    }

    echo json_encode(["message" => "Video guardado exitosamente"]);
    exit();
}

