<?php
// Formulario de la web en el hosting del cliente (ISPConfig, Apache + PHP): el
// equivalente de app/api/consulta/route.ts, que en Vercel manda por Resend. Acá
// sale por mail() del mismo servidor, que el SPF del dominio ya autoriza
// («a» = 190.185.150.8). Recibe la consulta del panel o el pedido del Resto y la
// manda a info@; nombre, teléfono y e-mail son obligatorios. El hotel contesta
// con «Responder» (Reply-To) o llama al teléfono, que va en el asunto.

const DESTINO = 'info@acavillabordeu.com.ar';
const REMITENTE = 'ACA Villa Bordeu <info@acavillabordeu.com.ar>';
const CELULAR = '+54 9 291 642-1036';
const TELEFONO = '0291 488-6855';
const DIRECCION = 'Camino Parque Sesquicentenario 1699, Bahía Blanca'; // = SITIO.direccion

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function responder($codigo, $ok = false)
{
    http_response_code($codigo);
    echo json_encode(['ok' => $ok]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') responder(405);

// Límite simple por IP: 5 envíos cada 10 minutos.
$ip = $_SERVER['REMOTE_ADDR'] ?? '?';
$archivo = sys_get_temp_dir() . '/vb-consulta-' . md5($ip);
$ahora = time();
$lista = [];
if (is_file($archivo)) {
    $lista = array_filter(array_map('intval', explode(',', (string) @file_get_contents($archivo))), function ($t) use ($ahora) {
        return $ahora - $t < 600;
    });
}
$lista[] = $ahora;
@file_put_contents($archivo, implode(',', $lista), LOCK_EX);
if (count($lista) > 5) responder(429);

$d = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($d)) responder(400);

$texto = function ($k, $max) use ($d) {
    $v = isset($d[$k]) && is_string($d[$k]) ? trim($d[$k]) : '';
    return mb_strlen($v, 'UTF-8') > $max ? null : $v;
};
// Una línea sola: nada de saltos que se cuelen en los encabezados del mail.
$linea = function ($v) {
    return trim(preg_replace('/[\r\n\t]+/', ' ', (string) $v));
};

$modo = $d['modo'] ?? '';
$mensaje = $texto('mensaje', 4000);
$nombre = $linea($texto('nombre', 120));
$telefono = $linea($texto('telefono', 40));
$email = $linea($texto('email', 120));
$empresa = $linea($texto('empresa', 120) ?? '');
$trampa = $texto('sitio', 200);

if (!in_array($modo, ['empresa', 'delegacion', 'viaje', 'pedido'], true)) responder(400);
if ($mensaje === null || mb_strlen($mensaje, 'UTF-8') < 10) responder(400);
if (mb_strlen($nombre, 'UTF-8') < 3) responder(400);
if (strlen(preg_replace('/\D/', '', $telefono)) < 8) responder(400);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) responder(400);
// Trampa para robots: el campo es invisible, una persona nunca lo completa.
if ($trampa !== '') responder(200, true);

$e = function ($s) {
    return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
};
$asuntoMime = function ($s) {
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
};
$enviar = function ($para, $responderA, $asunto, $html) use ($asuntoMime) {
    $encabezados = implode("\r\n", [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: base64',
        'From: ' . REMITENTE,
        'Reply-To: ' . $responderA,
    ]);
    return mail($para, $asuntoMime($asunto), chunk_split(base64_encode($html)), $encabezados, '-f' . DESTINO);
};

$quien = $empresa !== '' ? "$empresa ($nombre)" : $nombre;
$pedido = $modo === 'pedido';
$tipo = ['empresa' => 'Equipo de trabajo', 'delegacion' => 'Delegación deportiva', 'viaje' => 'Viaje', 'pedido' => 'Pedido del Resto'][$modo];
$que = $pedido ? 'pedido' : 'consulta';
$caja = '<div style="background:#f6f5f2;border-radius:12px;padding:16px;white-space:pre-line">' . $e($mensaje) . '</div>';

$html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c1d1f;max-width:560px">'
    . '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#846400">' . ($pedido ? 'Pedido' : 'Consulta') . ' desde la web · ' . $tipo . '</p>'
    . '<h1 style="margin:0 0 16px;font-size:22px">' . $e($quien) . '</h1>'
    . $caja
    . '<p style="margin:16px 0 0"><strong>Teléfono:</strong> ' . $e($telefono) . ' · <strong>Mail:</strong> ' . $e($email) . '</p>'
    . '<p style="margin:4px 0 0;color:#55585a;font-size:13px">Respondé este mail y le llega directo.</p>'
    . '</div>';

$asunto = ($pedido ? 'Pedido web' : 'Consulta web') . " · $tipo · $quien · $telefono";
if (!$enviar(DESTINO, $email, $asunto, $html)) {
    error_log('consulta.php: mail() devolvió false');
    responder(502);
}

// Copia para quien escribió.
$copia = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#1c1d1f;max-width:560px">'
    . '<p>¡Hola ' . $e($nombre) . '! Recibimos tu ' . $que . ' y te respondemos lo antes posible.</p>'
    . $caja
    . '<p>Si preferís, escribinos por WhatsApp al ' . CELULAR . ' o llamá al ' . TELEFONO . '. Recepción abierta las 24 horas.</p>'
    . '<p style="color:#55585a;font-size:13px">ACA Villa Bordeu · ' . DIRECCION . '</p>'
    . '</div>';
$enviar($email, DESTINO, "Recibimos tu $que · ACA Villa Bordeu", $copia);

responder(200, true);
