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

$defaultDiagnostico = [
    "title" => "2. DIAGNÓSTICO DE LA JUSHMCHL",
    "subtitle" => "Análisis integral del modelo de negocio, core business y diagnóstico interno y externo institucional.",
    "descripcionNegocio" => [
        "intro" => "La Junta de Usuarios Chancay Lambayeque, en calidad de operador de la infraestructura hidráulica del Sector Hidráulico Menor Chancay Lambayeque tiene como funciones principales operar y mantener la infraestructura hidráulica a su cargo, promoviendo su desarrollo, así como cobrar las tarifas de agua y administrar estos recursos públicos.",
        "funciones" => [
            "Operar y mantener la infraestructura hidráulica a su cargo, promoviendo su desarrollo.",
            "Distribuir el agua en el sector hidráulico Menor de acuerdo a la disponibilidad de los recursos hídricos y los programas aprobados.",
            "Cobrar las tarifas de agua y administrarlas adecuadamente.",
            "Recaudar la retribución económica y transferirla a la Autoridad Nacional del Agua.",
            "Supervisar el cumplimiento de las obligaciones de los usuarios de agua del sector hidráulico."
        ]
    ],
    "coreBusiness" => "La Operación de la infraestructura Hidráulica: Distribución de Agua",
    "diagnosticoInterno" => "La JUSHMCHL actualmente viene pasando por tiempos de cambios en la reestructuración organizacional y el marco normativo regulatorio. En el aspecto financiero, eventos extraordinarios como la pandemia COVID-19 y la tormenta tropical Yaku afectaron la recaudación de la Tarifa de Agua. Frente al cambio climático y nuevas disposiciones legales, la institución prioriza la gestión del talento humano multigeneracional, la modernización tecnológica y la optimización de la infraestructura institucional y flota vehicular.",
    "diagnosticoExterno" => "Las perspectivas económicas de Perú (2024-2028) proyectan un crecimiento sostenido del Producto Interno Bruto (PIB) con estabilidad inflacionaria. El fortalecimiento del empleo y las oportunidades de inversión en sectores estratégicos como la agricultura, minería y tecnología ofrecen un marco propicio para el desarrollo productivo y la sostenibilidad del riego en la región Lambayeque."
];

// Intento con MySQL PDO si db.php está disponible
$pdo = null;
if (file_exists(__DIR__ . '/db.php')) {
    require_once __DIR__ . '/db.php';
    if (function_exists('getDbConnection')) {
        try {
            $pdo = getDbConnection();
            $pdo->exec("CREATE TABLE IF NOT EXISTS diagnostico (
                id INT PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255),
                intro TEXT,
                funciones JSON,
                coreBusiness TEXT,
                diagnosticoInterno TEXT,
                diagnosticoExterno TEXT
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
        } catch (Exception $e) {
            $pdo = null;
        }
    }
}

if ($method === 'GET') {
    if ($pdo) {
        try {
            $stmt = $pdo->query("SELECT * FROM diagnostico WHERE id = 1");
            $row = $stmt->fetch();
            if ($row) {
                $res = [
                    "title" => $row['title'] ?? $defaultDiagnostico['title'],
                    "subtitle" => $row['subtitle'] ?? $defaultDiagnostico['subtitle'],
                    "descripcionNegocio" => [
                        "intro" => $row['intro'] ?? $defaultDiagnostico['descripcionNegocio']['intro'],
                        "funciones" => json_decode($row['funciones'] ?? '[]', true) ?: $defaultDiagnostico['descripcionNegocio']['funciones']
                    ],
                    "coreBusiness" => $row['coreBusiness'] ?? $defaultDiagnostico['coreBusiness'],
                    "diagnosticoInterno" => $row['diagnosticoInterno'] ?? $defaultDiagnostico['diagnosticoInterno'],
                    "diagnosticoExterno" => $row['diagnosticoExterno'] ?? $defaultDiagnostico['diagnosticoExterno']
                ];
                echo json_encode($res, JSON_UNESCAPED_UNICODE);
                exit();
            }
        } catch (Exception $e) {}
    }

    $db = get_json_db($db_file);
    $diagnostico = isset($db['diagnostico']) ? $db['diagnostico'] : $defaultDiagnostico;
    echo json_encode($diagnostico, JSON_UNESCAPED_UNICODE);
    exit();
}

if ($method === 'POST') {
    if (function_exists('verifyAuthToken')) {
        verifyAuthToken();
    }
    $input = json_decode(file_get_contents('php://input'), true) ?: [];

    $title = !empty($input['title']) ? $input['title'] : "2. DIAGNÓSTICO DE LA JUSHMCHL";
    $subtitle = !empty($input['subtitle']) ? $input['subtitle'] : "";
    $intro = isset($input['descripcionNegocio']['intro']) ? $input['descripcionNegocio']['intro'] : "";
    $funciones = isset($input['descripcionNegocio']['funciones']) ? $input['descripcionNegocio']['funciones'] : [];
    $coreBusiness = isset($input['coreBusiness']) ? $input['coreBusiness'] : "";
    $diagnosticoInterno = isset($input['diagnosticoInterno']) ? $input['diagnosticoInterno'] : "";
    $diagnosticoExterno = isset($input['diagnosticoExterno']) ? $input['diagnosticoExterno'] : "";

    $diagObj = [
        "title" => $title,
        "subtitle" => $subtitle,
        "descripcionNegocio" => [
            "intro" => $intro,
            "funciones" => $funciones
        ],
        "coreBusiness" => $coreBusiness,
        "diagnosticoInterno" => $diagnosticoInterno,
        "diagnosticoExterno" => $diagnosticoExterno
    ];

    if ($pdo) {
        try {
            $stmt = $pdo->prepare("INSERT INTO diagnostico (id, title, subtitle, intro, funciones, coreBusiness, diagnosticoInterno, diagnosticoExterno) 
                VALUES (1, :title, :subtitle, :intro, :funciones, :core, :interno, :externo)
                ON DUPLICATE KEY UPDATE 
                title=:title, subtitle=:subtitle, intro=:intro, funciones=:funciones, coreBusiness=:core, diagnosticoInterno=:interno, diagnosticoExterno=:externo");
            $stmt->execute([
                ':title' => $title,
                ':subtitle' => $subtitle,
                ':intro' => $intro,
                ':funciones' => json_encode($funciones, JSON_UNESCAPED_UNICODE),
                ':core' => $coreBusiness,
                ':interno' => $diagnosticoInterno,
                ':externo' => $diagnosticoExterno
            ]);
        } catch (Exception $e) {}
    }

    $db = get_json_db($db_file);
    $db['diagnostico'] = $diagObj;
    save_json_db($db_file, $db);

    echo json_encode(["message" => "Diagnóstico institucional actualizado exitosamente", "diagnostico" => $diagObj], JSON_UNESCAPED_UNICODE);
    exit();
}
