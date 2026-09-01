<?php
require_once __DIR__ . '/db_config.php';

function getDbConnection() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode([
                "error" => "Error de conexión a la base de datos MySQL en InfinityFree / Hosting: " . $e->getMessage(),
                "help" => "Asegúrate de editar php-api/db_config.php con tu DB_HOST (ej: sqlXXX.epizy.com), DB_USER y DB_PASS de tu panel de InfinityFree."
            ]);
            exit();
        }
    }
    return $pdo;
}

// Polyfill para getallheaders si el servidor no lo soporta (FastCGI / Nginx)
if (!function_exists('getallheaders')) {
    function getallheaders() {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            }
        }
        return $headers;
    }
}

function verifyAuthToken() {
    $authHeader = '';
    
    // 1. Revisar $_SERVER['HTTP_AUTHORIZATION'] o REDIRECT_HTTP_AUTHORIZATION (común en Apache / InfinityFree)
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['HTTP_X_AUTHORIZATION'])) {
        $authHeader = $_SERVER['HTTP_X_AUTHORIZATION'];
    } else {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            $authHeader = $headers['Authorization'];
        } elseif (isset($headers['authorization'])) {
            $authHeader = $headers['authorization'];
        }
    }
    
    // 2. Si no viene en headers, revisar POST/GET token por flexibilidad
    if (empty($authHeader)) {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!empty($input['token'])) {
            $authHeader = 'Bearer ' . $input['token'];
        } elseif (!empty($_GET['token'])) {
            $authHeader = 'Bearer ' . $_GET['token'];
        }
    }
    
    if (empty($authHeader)) {
        http_response_code(401);
        echo json_encode(["error" => "Acceso no autorizado - Token ausente"]);
        exit();
    }
    
    $token = str_replace('Bearer ', '', $authHeader);
    if (empty($token)) {
        http_response_code(401);
        echo json_encode(["error" => "Token inválido"]);
        exit();
    }
    return true;
}
