<?php
ini_set('display_errors', 0);
error_reporting(0);

require_once __DIR__ . '/db.php';
verifyAuthToken();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit();
}

if (!isset($_FILES['file'])) {
    http_response_code(400);
    echo json_encode(["error" => "No se ha proporcionado ningún archivo"]);
    exit();
}

$file = $_FILES['file'];

if ($file['error'] !== UPLOAD_ERR_OK) {
    $msg = "Error al subir el archivo";
    switch ($file['error']) {
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            $msg = "El archivo supera el tamaño máximo permitido por el servidor (Máx 10MB en InfinityFree)";
            break;
        case UPLOAD_ERR_PARTIAL:
            $msg = "El archivo se subió parcialmente. Intenta de nuevo";
            break;
        case UPLOAD_ERR_NO_FILE:
            $msg = "No se seleccionó ningún archivo";
            break;
        case UPLOAD_ERR_NO_TMP_DIR:
            $msg = "Falta la carpeta temporal en el hosting";
            break;
        case UPLOAD_ERR_CANT_WRITE:
            $msg = "No se pudo escribir en el disco del servidor. Revisa permisos";
            break;
    }
    http_response_code(400);
    echo json_encode(["error" => $msg]);
    exit();
}

// Crear carpetas de destino si no existen
$uploadDir = __DIR__ . '/../assets/uploads/';
if (!is_dir($uploadDir)) {
    @mkdir($uploadDir, 0777, true);
}

$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf'];

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    echo json_encode(["error" => "Tipo de archivo no permitido. Solo imágenes (JPG, PNG, WEBP, GIF) y PDF"]);
    exit();
}

$fileName = uniqid('img_', true) . '.' . $ext;
$targetPath = $uploadDir . $fileName;

if (@move_uploaded_file($file['tmp_name'], $targetPath)) {
    $relativeUrl = 'assets/uploads/' . $fileName;
    echo json_encode([
        "message" => "Archivo subido exitosamente",
        "fileUrl" => $relativeUrl,
        "url" => $relativeUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "No se pudo mover el archivo subido a la carpeta assets/uploads/"]);
}

