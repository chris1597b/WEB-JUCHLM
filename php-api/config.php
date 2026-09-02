<?php
require_once __DIR__ . '/db.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $stmt = $pdo->prepare("SELECT * FROM site_config WHERE id = 1");
    $stmt->execute();
    $config = $stmt->fetch();

    if (!$config) {
        // Generar configuración por defecto si la tabla está vacía
        $config = [
            'pageTitle' => 'Junta de Usuarios Chancay Lambayeque',
            'pageSubtitle' => 'JUSHMCHL Clase A',
            'heroTitle' => 'Garantizando la Distribución Eficiente del Agua',
            'heroText' => 'Gestión sostenible y equitativa del recurso hídrico para todos los usuarios agrarios del Valle Chancay Lambayeque.',
            'heroBg' => 'assets/img/fondo/TINAJONES-1024x768.jpg',
            'contactEmail' => 'contacto@jushmchl.org.pe',
            'contactPhone' => '(074) 231234 / 974123456',
            'contactAddress' => 'Av. Salaverry 123, Chiclayo, Perú',
            'mision' => 'Somos una organización que brinda servicios de operación, mantenimiento de la infraestructura hidráulica menor y distribución del recurso hídrico.',
            'vision' => 'Consolidarnos como una organización moderna y eficiente, referente a nivel internacional.',
            'historia' => 'La Junta de Usuarios Chancay Lambayeque fue constituida en mérito al Decreto Ley 17752...',
            'modalAvisosActive' => 1,
            'diagnosticoSectionActive' => 1,
            'fireworksActive' => 1,
            'fireworksTheme' => 'fiestas_patrias',
            'fireworksTitleText' => '¡Fiestas Patrias!',
            'fireworksBtnText' => '¡Viva el Perú!',
            'fireworksSubText' => 'Celebrando con la Junta de Usuarios',
            'fireworksDuration' => 4000,
            'fireworksSoundEnabled' => 0
        ];
    }

    $response = [
        "pageTitle" => $config['pageTitle'] ?? '',
        "pageSubtitle" => $config['pageSubtitle'] ?? '',
        "heroTitle" => $config['heroTitle'] ?? '',
        "heroText" => $config['heroText'] ?? '',
        "heroBg" => $config['heroBg'] ?? '',
        "contactEmail" => $config['contactEmail'] ?? '',
        "contactPhone" => $config['contactPhone'] ?? '',
        "contactAddress" => $config['contactAddress'] ?? '',
        "mision" => $config['mision'] ?? '',
        "vision" => $config['vision'] ?? '',
        "historia" => $config['historia'] ?? '',
        "modalAvisosActive" => (bool)($config['modalAvisosActive'] ?? true),
        "diagnosticoSectionActive" => (bool)($config['diagnosticoSectionActive'] ?? true),
        "fireworks" => [
            "active" => (bool)($config['fireworksActive'] ?? true),
            "theme" => $config['fireworksTheme'] ?? 'fiestas_patrias',
            "titleText" => $config['fireworksTitleText'] ?? '¡Fiestas Patrias!',
            "btnText" => $config['fireworksBtnText'] ?? '¡Viva el Perú!',
            "title" => $config['fireworksTitleText'] ?? '¡Fiestas Patrias!',
            "buttonText" => $config['fireworksBtnText'] ?? '¡Viva el Perú!',
            "subText" => $config['fireworksSubText'] ?? 'Celebrando con la Junta de Usuarios',
            "duration" => (int)($config['fireworksDuration'] ?? 4000),
            "soundEnabled" => (bool)($config['fireworksSoundEnabled'] ?? false),
            "customColor1" => $config['fireworksColor1'] ?? '#dc2626',
            "customColor2" => $config['fireworksColor2'] ?? '#ffffff',
            "customColor3" => $config['fireworksColor3'] ?? '#b91c1c'
        ]
    ];

    echo json_encode($response);
    exit();
}

if ($method === 'POST') {
    verifyAuthToken();
    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    $stmt = $pdo->query("SELECT * FROM site_config WHERE id = 1");
    $current = $stmt->fetch() ?: [];

    // Actualizar fireworks si viene
    if (isset($input['fireworks']) && is_array($input['fireworks'])) {
        $fw = $input['fireworks'];
        $fireworksActive = isset($fw['active']) ? ($fw['active'] ? 1 : 0) : ($current['fireworksActive'] ?? 1);
        $fireworksTheme = $fw['theme'] ?? ($current['fireworksTheme'] ?? 'fiestas_patrias');
        $fireworksTitleText = $fw['titleText'] ?? $fw['title'] ?? ($current['fireworksTitleText'] ?? '¡Fiestas Patrias!');
        $fireworksBtnText = $fw['btnText'] ?? $fw['buttonText'] ?? ($current['fireworksBtnText'] ?? '¡Viva el Perú!');
        $fireworksSubText = $fw['subText'] ?? ($current['fireworksSubText'] ?? '');
        $fireworksDuration = isset($fw['duration']) ? (int)$fw['duration'] : ($current['fireworksDuration'] ?? 4000);
        $fireworksSoundEnabled = isset($fw['soundEnabled']) ? ($fw['soundEnabled'] ? 1 : 0) : ($current['fireworksSoundEnabled'] ?? 0);
        $fireworksColor1 = $fw['customColor1'] ?? ($current['fireworksColor1'] ?? '#dc2626');
        $fireworksColor2 = $fw['customColor2'] ?? ($current['fireworksColor2'] ?? '#ffffff');
        $fireworksColor3 = $fw['customColor3'] ?? ($current['fireworksColor3'] ?? '#b91c1c');

        // Add columns if not exist (safe migration)
        try {
            $pdo->exec("ALTER TABLE site_config ADD COLUMN IF NOT EXISTS fireworksColor1 VARCHAR(20) DEFAULT '#dc2626'");
            $pdo->exec("ALTER TABLE site_config ADD COLUMN IF NOT EXISTS fireworksColor2 VARCHAR(20) DEFAULT '#ffffff'");
            $pdo->exec("ALTER TABLE site_config ADD COLUMN IF NOT EXISTS fireworksColor3 VARCHAR(20) DEFAULT '#b91c1c'");
        } catch (Exception $e) { /* columns may already exist */ }

        $updateStmt = $pdo->prepare("UPDATE site_config SET 
            fireworksActive = :active,
            fireworksTheme = :theme,
            fireworksTitleText = :titleText,
            fireworksBtnText = :btnText,
            fireworksSubText = :subText,
            fireworksDuration = :duration,
            fireworksSoundEnabled = :soundEnabled,
            fireworksColor1 = :color1,
            fireworksColor2 = :color2,
            fireworksColor3 = :color3
            WHERE id = 1");
        
        $updateStmt->execute([
            ':active' => $fireworksActive,
            ':theme' => $fireworksTheme,
            ':titleText' => $fireworksTitleText,
            ':btnText' => $fireworksBtnText,
            ':subText' => $fireworksSubText,
            ':duration' => $fireworksDuration,
            ':soundEnabled' => $fireworksSoundEnabled,
            ':color1' => $fireworksColor1,
            ':color2' => $fireworksColor2,
            ':color3' => $fireworksColor3
        ]);
    }

    // Actualizar diagnosticoSectionActive si viene en el payload
    if (isset($input['diagnosticoSectionActive'])) {
        $diagnosticoSectionActive = $input['diagnosticoSectionActive'] ? 1 : 0;
        try {
            $pdo->exec("ALTER TABLE site_config ADD COLUMN IF NOT EXISTS diagnosticoSectionActive TINYINT(1) DEFAULT 1");
        } catch (Exception $e) { /* column may already exist */ }
        $pdo->prepare("UPDATE site_config SET diagnosticoSectionActive = :v WHERE id = 1")
            ->execute([':v' => $diagnosticoSectionActive]);
        echo json_encode(["message" => "Visibilidad del Diagnóstico actualizada"]);
        exit();
    }

    // Actualizar configuración general
    $pageTitle = $input['pageTitle'] ?? $current['pageTitle'] ?? '';
    $pageSubtitle = $input['pageSubtitle'] ?? $current['pageSubtitle'] ?? '';
    $heroTitle = $input['heroTitle'] ?? $current['heroTitle'] ?? '';
    $heroText = $input['heroText'] ?? $current['heroText'] ?? '';
    $heroBg = $input['heroBg'] ?? $current['heroBg'] ?? '';
    $contactEmail = $input['contactEmail'] ?? $current['contactEmail'] ?? '';
    $contactPhone = $input['contactPhone'] ?? $current['contactPhone'] ?? '';
    $contactAddress = $input['contactAddress'] ?? $current['contactAddress'] ?? '';
    $mision = $input['mision'] ?? $current['mision'] ?? '';
    $vision = $input['vision'] ?? $current['vision'] ?? '';
    $historia = $input['historia'] ?? $current['historia'] ?? '';

    $updateGeneral = $pdo->prepare("UPDATE site_config SET 
        pageTitle = :pageTitle,
        pageSubtitle = :pageSubtitle,
        heroTitle = :heroTitle,
        heroText = :heroText,
        heroBg = :heroBg,
        contactEmail = :contactEmail,
        contactPhone = :contactPhone,
        contactAddress = :contactAddress,
        mision = :mision,
        vision = :vision,
        historia = :historia
        WHERE id = 1");

    $updateGeneral->execute([
        ':pageTitle' => $pageTitle,
        ':pageSubtitle' => $pageSubtitle,
        ':heroTitle' => $heroTitle,
        ':heroText' => $heroText,
        ':heroBg' => $heroBg,
        ':contactEmail' => $contactEmail,
        ':contactPhone' => $contactPhone,
        ':contactAddress' => $contactAddress,
        ':mision' => $mision,
        ':vision' => $vision,
        ':historia' => $historia
    ]);

    echo json_encode(["message" => "Configuración guardada exitosamente"]);
    exit();
}
