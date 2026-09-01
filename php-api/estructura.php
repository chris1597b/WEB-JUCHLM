<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();

// Ensure table exists
$pdo->exec("CREATE TABLE IF NOT EXISTS estructura_organizacional (
    id VARCHAR(50) PRIMARY KEY,
    code VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    badge VARCHAR(100),
    icon VARCHAR(100) DEFAULT 'bi-diagram-3',
    color VARCHAR(50) DEFAULT '#20c997',
    items JSON
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

// Check if table is empty and seed initial data if needed
$check = $pdo->query("SELECT COUNT(*) FROM estructura_organizacional")->fetchColumn();
if ($check == 0) {
    $initialData = [
        [
            'id' => 'organo-a',
            'code' => 'a',
            'title' => 'Órganos de Dirección',
            'badge' => 'Dirección',
            'icon' => 'bi-award-fill',
            'color' => '#0d6efd',
            'items' => json_encode([
                ['code' => 'a.1', 'title' => 'Asamblea General'],
                ['code' => 'a.2', 'title' => 'Consejo Directivo'],
                ['code' => 'a.3', 'title' => 'De la Presidencia'],
                ['code' => 'a.4', 'title' => 'De la Gerencia']
            ])
        ],
        [
            'id' => 'organo-b',
            'code' => 'b',
            'title' => 'Órganos de Asesoramiento',
            'badge' => 'Asesoramiento',
            'icon' => 'bi-shield-check',
            'color' => '#20c997',
            'items' => json_encode([
                ['code' => 'b.1', 'title' => 'Dirección de Regulación y Asesoramiento Jurídico'],
                ['code' => 'b.2', 'title' => 'Órganos de Apoyo'],
                ['code' => 'b.3', 'title' => 'Dirección de Desarrollo Humano y Responsabilidad Social'],
                ['code' => 'b.4', 'title' => 'Dirección de Administración de Servicios']
            ])
        ],
        [
            'id' => 'organo-c',
            'code' => 'c',
            'title' => 'Órganos de Línea',
            'badge' => 'Línea Operativa',
            'icon' => 'bi-gear-wide-connected',
            'color' => '#198754',
            'items' => json_encode([
                ['code' => 'c.1', 'title' => 'Dirección de Operación de la Infraestructura Hidráulica'],
                ['code' => 'c.2', 'title' => 'Dirección de Mantenimiento de la Infraestructura Hidráulica'],
                ['code' => 'c.3', 'title' => 'Dirección de Desarrollo de la Infraestructura Hidráulica'],
                ['code' => 'c.4', 'title' => 'Dirección de Administración de la Tarifa del Agua']
            ])
        ],
        [
            'id' => 'organo-d',
            'code' => 'd',
            'title' => 'Órganos Desconcentrados',
            'badge' => 'Desconcentrados',
            'icon' => 'bi-building-fill-gear',
            'color' => '#6f42c1',
            'items' => json_encode([
                ['code' => 'd.1', 'title' => 'Escuela Técnica del Agro'],
                ['code' => 'd.2', 'title' => 'Unidades de Negocio']
            ])
        ]
    ];

    $stmtInsert = $pdo->prepare("INSERT INTO estructura_organizacional (id, code, title, badge, icon, color, items) VALUES (:id, :code, :title, :badge, :icon, :color, :items)");
    foreach ($initialData as $item) {
        $stmtInsert->execute($item);
    }
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->query("SELECT * FROM estructura_organizacional ORDER BY code ASC");
    $rows = $stmt->fetchAll();
    foreach ($rows as &$row) {
        if (isset($row['items']) && is_string($row['items'])) {
            $row['items'] = json_decode($row['items'], true) ?? [];
        }
    }
    echo json_encode($rows);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? '';

    if ($action === 'DELETE') {
        $id = $input['id'] ?? '';
        $stmt = $pdo->prepare("DELETE FROM estructura_organizacional WHERE id = :id");
        $stmt->execute([':id' => $id]);
        echo json_encode(["message" => "Órgano eliminado exitosamente"]);
        exit();
    }

    $id = $input['id'] ?? null;
    $code = trim($input['code'] ?? '');
    $title = trim($input['title'] ?? '');
    $badge = trim($input['badge'] ?? '');
    $icon = trim($input['icon'] ?? 'bi-diagram-3');
    $color = trim($input['color'] ?? '#20c997');
    $items = isset($input['items']) ? json_encode($input['items']) : json_encode([]);

    if (empty($title)) {
        http_response_code(400);
        echo json_encode(["error" => "El título del órgano es obligatorio"]);
        exit();
    }

    if ($id) {
        $stmt = $pdo->prepare("UPDATE estructura_organizacional SET code = :code, title = :title, badge = :badge, icon = :icon, color = :color, items = :items WHERE id = :id");
        $stmt->execute([':code' => $code, ':title' => $title, ':badge' => $badge, ':icon' => $icon, ':color' => $color, ':items' => $items, ':id' => $id]);
    } else {
        $newId = 'organo-' . round(microtime(true) * 1000);
        $stmt = $pdo->prepare("INSERT INTO estructura_organizacional (id, code, title, badge, icon, color, items) VALUES (:id, :code, :title, :badge, :icon, :color, :items)");
        $stmt->execute([':id' => $newId, ':code' => $code, ':title' => $title, ':badge' => $badge, ':icon' => $icon, ':color' => $color, ':items' => $items]);
    }

    echo json_encode(["message" => "Estructura organizacional guardada exitosamente"]);
    exit();
}
