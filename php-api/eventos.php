<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM eventos ORDER BY eventDate ASC");
    $eventos = $stmt->fetchAll();
    echo json_encode($eventos);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM eventos WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Evento eliminado exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $title = trim($input['title'] ?? '');
    $eventDate = trim($input['eventDate'] ?? date('Y-m-d'));
    $location = trim($input['location'] ?? 'Sede Principal');
    $category = trim($input['category'] ?? 'General');
    $desc = trim($input['desc'] ?? $input['description'] ?? '');
    $time = trim($input['time'] ?? 'Todo el día');
    $color = trim($input['color'] ?? '#2563eb');
    $label = trim($input['label'] ?? $category);

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(["error" => "El título del evento es obligatorio"]);
        exit();
    }

    $ts = strtotime($eventDate) ?: time();
    $day = (int)date('j', $ts);
    $month = (int)date('n', $ts) - 1;
    $year = (int)date('Y', $ts);

    if ($id) {
        $stmt = $pdo->prepare("UPDATE eventos SET title = :title, eventDate = :eventDate, day = :day, month = :month, year = :year, location = :location, category = :category, `desc` = :desc, time = :time, color = :color, label = :label WHERE id = :id");
        $stmt->execute([
            ':title' => $title,
            ':eventDate' => $eventDate,
            ':day' => $day,
            ':month' => $month,
            ':year' => $year,
            ':location' => $location,
            ':category' => $category,
            ':desc' => $desc,
            ':time' => $time,
            ':color' => $color,
            ':label' => $label,
            ':id' => $id
        ]);
    } else {
        $newId = 'e-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO eventos (id, title, eventDate, day, month, year, location, category, `desc`, time, color, label) VALUES (:id, :title, :eventDate, :day, :month, :year, :location, :category, :desc, :time, :color, :label)");
        $stmt->execute([
            ':id' => $newId,
            ':title' => $title,
            ':eventDate' => $eventDate,
            ':day' => $day,
            ':month' => $month,
            ':year' => $year,
            ':location' => $location,
            ':category' => $category,
            ':desc' => $desc,
            ':time' => $time,
            ':color' => $color,
            ':label' => $label
        ]);
    }

    echo json_encode(["message" => "Evento guardado exitosamente"]);
    exit();
}
