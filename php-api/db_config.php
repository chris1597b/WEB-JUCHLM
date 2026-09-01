<?php
// ==============================================================================
// CONFIGURACIÓN DE LA BASE DE DATOS MYSQL (Para InfinityFree / cPanel / Hosting)
// ==============================================================================
// En InfinityFree, debes reemplazar estos valores con los de tu panel de control:
// Ejemplos en InfinityFree:
// DB_HOST: 'sql102.epizy.com' (o sqlXXX.infinityfree.com - NO uses localhost ni 127.0.0.1)
// DB_NAME: 'if0_38123456_jushmchl_db'
// DB_USER: 'if0_38123456'
// DB_PASS: 'TuPasswordDeInfinityFree'

define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'if0_42578551_jushmchl_db');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_PORT', getenv('DB_PORT') ?: '3306');
//define('JWT_SECRET', getenv('JWT_SECRET') ?: 'jushmchl_secret_key_2026');

// Configuración de CORS e Headers Globales
if (!headers_sent()) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Authorization");
    header("Content-Type: application/json; charset=UTF-8");
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}