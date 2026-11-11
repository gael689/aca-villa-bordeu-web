<?php
// /material: el material impreso de Rodrigo (QR y tarjetas) detrás de un PIN.
// Lo arma scripts/exportar.mjs: copia esta página a out/material.php, los archivos de
// ../Material para Rodrigo a out/_material/ (cerrada por .htaccess) y escribe
// out/_material/_pin.php con el PIN y el secreto de .env.hosting (MATERIAL_PIN,
// MATERIAL_SECRETO). El repo es público: ni el PIN ni los archivos van al repo.

$cfg = require __DIR__ . '/_material/_pin.php';
const COOKIE = 'vb_material';

header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: private, no-store');
header('Referrer-Policy: no-referrer');

// clave => [archivo en _material/, nombre al descargar, tipo]
$ARCHIVOS = [
    'imprimir' => ['imprimir.pdf', 'IMPRIMIR - 4 hojas A4.pdf', 'application/pdf'],
    'resto'    => ['resto.png', 'QR Resto - carta y pedidos.png', 'image/png'],
    'resenas'  => ['resenas.png', 'QR Reseñas de Google.png', 'image/png'],
    'contacto' => ['contacto.png', 'QR Contacto del ACA.png', 'image/png'],
    'predio'   => ['predio.png', 'QR Conocé el predio.png', 'image/png'],
    'rodrigo'  => ['rodrigo.png', 'QR Tarjeta de Rodrigo.png', 'image/png'],
    'fondo'    => ['fondo.png', 'Fondo de pantalla con tu QR.png', 'image/png'],
    'vcf'      => ['rodrigo-gomez.vcf', 'Rodrigo Gomez.vcf', 'text/vcard; charset=utf-8'],
    'tarjetas' => ['tarjetas-digitales.pdf', 'ACA Villa Bordeu - Tarjetas digitales.pdf', 'application/pdf'],
];

function e($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
function firma($cfg) { return hash_hmac('sha256', 'material-ok', $cfg['secreto']); }
function adentro($cfg) { return isset($_COOKIE[COOKIE]) && hash_equals(firma($cfg), (string) $_COOKIE[COOKIE]); }

// Límite por IP: 8 PIN errados cada 30 minutos.
$ip = $_SERVER['REMOTE_ADDR'] ?? '?';
$intentos = sys_get_temp_dir() . '/vb-material-' . md5($ip);
$reg = is_file($intentos) ? json_decode((string) file_get_contents($intentos), true) : null;
if (!is_array($reg) || time() - ($reg['desde'] ?? 0) > 1800) $reg = ['n' => 0, 'desde' => time()];
$bloqueado = $reg['n'] >= 8;

$error = '';
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && isset($_POST['pin'])) {
    $pin = preg_replace('/\D/', '', (string) $_POST['pin']);
    if ($bloqueado) {
        $error = 'Demasiados intentos. Probá de nuevo en media hora.';
    } elseif (hash_equals($cfg['pin_hash'], hash('sha256', $cfg['sal'] . $pin))) {
        @unlink($intentos);
        setcookie(COOKIE, firma($cfg), [
            'expires' => time() + 180 * 86400, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax',
        ]);
        header('Location: /material', true, 303);
        exit;
    } else {
        $reg['n']++;
        @file_put_contents($intentos, json_encode($reg));
        sleep(1);
        $error = 'PIN incorrecto.';
    }
}

if (isset($_GET['salir'])) {
    setcookie(COOKIE, '', ['expires' => time() - 3600, 'path' => '/', 'secure' => true, 'httponly' => true, 'samesite' => 'Lax']);
    header('Location: /material', true, 303);
    exit;
}

// Descarga o vista de un archivo (solo con la cookie).
if (isset($_GET['archivo']) || isset($_GET['mini'])) {
    if (!adentro($cfg)) { http_response_code(403); exit; }
    $clave = (string) ($_GET['archivo'] ?? $_GET['mini']);
    if (!isset($ARCHIVOS[$clave])) { http_response_code(404); exit; }
    list($archivo, $nombre, $tipo) = $ARCHIVOS[$clave];
    $ruta = isset($_GET['mini']) ? __DIR__ . "/_material/mini/$clave.webp" : __DIR__ . "/_material/$archivo";
    if (!is_file($ruta)) { http_response_code(404); exit; }
    header('Content-Type: ' . (isset($_GET['mini']) ? 'image/webp' : $tipo));
    header('Content-Length: ' . filesize($ruta));
    if (!isset($_GET['mini'])) header('Content-Disposition: ' . (isset($_GET['descargar']) ? 'attachment' : 'inline') . "; filename*=UTF-8''" . rawurlencode($nombre));
    readfile($ruta);
    exit;
}

$LOGO = '{{LOGO}}';
$entro = adentro($cfg);
$a = function ($clave) { return '/material?archivo=' . $clave; };
$m = function ($clave) { return '/material?mini=' . $clave; };
$wa = function ($texto) { return 'https://wa.me/?text=' . rawurlencode($texto); };
const WEB = 'https://www.acavillabordeu.com.ar';
const RESENA = 'https://search.google.com/local/writereview?placeid=ChIJ5yEyw8G77ZURqP9up-6eN8E';

// Los QR: clave, nombre, dónde va.
$QRS = [
    ['resto', 'Resto: carta y pedidos', 'Mesas y mostrador del Resto'],
    ['resenas', 'Reseñas de Google', 'Recepción y habitaciones'],
    ['contacto', 'Contacto del ACA', 'Recepción'],
    ['predio', 'Conocé el predio', 'Recepción, empresas y delegaciones'],
    ['rodrigo', 'Tu tarjeta personal', 'Tu escritorio y reuniones'],
];
// Las tarjetas digitales: nombre, ruta, mensaje para mandar.
$TARJETAS = [
    ['Tarjeta extensa del ACA', '/tarjeta-completa', 'Te paso la info de ACA Villa Bordeu: habitaciones, Resto, Estación YPF y cómo llegar.'],
    ['Tarjeta corta del ACA', '/tarjeta', 'Te paso el contacto de ACA Villa Bordeu:'],
    ['Tu tarjeta personal', '/rodrigo', 'Te paso mi contacto:'],
];
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>QR y tarjetas · ACA Villa Bordeu</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root { --tinta: #141516; --amarillo: #f1bb01; --rojo: #df1d2e; --papel: #faf8f3; --gris: #5b5d60; --linea: #e4e0d5; --wa: #1a8f4c; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font: 16px/1.45 Barlow, system-ui, sans-serif; color: var(--tinta); background: var(--papel); -webkit-text-size-adjust: 100%; }
  a { color: inherit; }
  button { font: inherit; color: inherit; }
  .ancho { max-width: 640px; margin: 0 auto; }
  .marca { display: flex; align-items: center; gap: 12px; }
  .marca svg { height: 40px; width: auto; color: var(--rojo); display: block; }
  .marca b { font: 700 14px/.95 "Barlow Condensed", sans-serif; letter-spacing: .12em; text-transform: uppercase; border-left: 1.5px solid rgb(20 21 22 / .35); padding-left: 12px; }
  h1, h2 { font-family: "Barlow Condensed", sans-serif; text-transform: uppercase; line-height: .95; }
  h1 { font-size: 46px; margin-top: 18px; }
  h2 { font-size: 26px; }
  header { background: var(--amarillo); padding: 18px 16px 24px; }
  header .fila { display: flex; justify-content: space-between; align-items: center; }
  .salir { font-size: 14px; color: var(--tinta); opacity: .7; }
  main { padding: 0 16px 40px; }
  section { margin-top: 28px; }
  .sub { color: var(--gris); font-size: 15px; margin-top: 4px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 46px; padding: 10px 18px; border-radius: 999px; background: var(--tinta); color: var(--amarillo); text-decoration: none; font: 700 17px/1 "Barlow Condensed", sans-serif; letter-spacing: .05em; text-transform: uppercase; border: 0; cursor: pointer; }
  .btn.claro { background: #fff; color: var(--tinta); box-shadow: inset 0 0 0 1.5px var(--tinta); }
  .btn.wa { background: var(--wa); color: #fff; }
  .btn.ancho100 { width: 100%; }
  .btn svg { width: 18px; height: 18px; flex: none; }
  .imprimir { margin-top: -12px; background: var(--tinta); color: #fff; border-radius: 18px; padding: 20px; }
  .imprimir h2 { color: var(--amarillo); }
  .imprimir p { margin: 6px 0 16px; opacity: .85; }
  .imprimir .btn { background: var(--amarillo); color: var(--tinta); }
  .lista { margin-top: 12px; display: grid; gap: 10px; }
  .qr { display: grid; grid-template-columns: 78px 1fr; gap: 14px; align-items: center; background: #fff; border: 1px solid var(--linea); border-radius: 16px; padding: 10px; }
  .ver { border: 0; background: none; padding: 0; cursor: zoom-in; border-radius: 8px; display: block; }
  .ver img { width: 78px; height: auto; display: block; border-radius: 8px; }
  .qr h3 { font: 700 19px/1.05 "Barlow Condensed", sans-serif; text-transform: uppercase; }
  .qr p { font-size: 14px; color: var(--gris); margin-top: 2px; }
  .acciones { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .acciones .btn { min-height: 38px; padding: 8px 12px; font-size: 15px; }
  .compartir[hidden] { display: none; }
  .caja { background: #fff; border: 1px solid var(--linea); border-radius: 16px; padding: 16px; margin-top: 12px; }
  .caja h3 { font: 700 19px/1.05 "Barlow Condensed", sans-serif; text-transform: uppercase; }
  .caja p { font-size: 15px; color: var(--gris); margin: 4px 0 12px; }
  .tarjeta { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 0; border-top: 1px solid var(--linea); }
  .tarjeta:first-child { border-top: 0; padding-top: 0; }
  .tarjeta:last-child { padding-bottom: 0; }
  .tarjeta b { font-weight: 600; }
  .tarjeta .acciones { margin-top: 0; flex-wrap: nowrap; }
  .nota { font-size: 14px; color: var(--gris); margin-top: 28px; }
  dialog { border: 0; padding: 0; width: 100%; height: 100%; max-width: none; max-height: none; background: var(--amarillo); }
  dialog::backdrop { background: var(--amarillo); }
  dialog .dentro { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 16px; }
  dialog img { max-width: 100%; max-height: calc(100% - 80px); width: auto; height: auto; border-radius: 12px; }
  .pin { min-height: 100vh; min-height: 100dvh; background: var(--amarillo); display: grid; place-items: center; padding: 24px 16px; }
  .pin form { width: 100%; max-width: 360px; }
  .pin p { margin-top: 10px; }
  .pin input { width: 100%; margin-top: 18px; font: 700 32px/1 "Barlow Condensed", sans-serif; letter-spacing: .4em; text-align: center; padding: 14px; border: 2px solid var(--tinta); border-radius: 14px; background: #fff; color: var(--tinta); }
  .pin .btn { width: 100%; margin-top: 12px; }
  .error { margin-top: 12px; font-weight: 600; color: #9b0d1a; }
</style>
</head>
<body>
<?php if (!$entro): ?>
<div class="pin">
  <form method="post" action="/material">
    <div class="marca"><?= $LOGO ?><b>Villa<br>Bordeu</b></div>
    <h1>QR y tarjetas</h1>
    <p>Ingresá el PIN que te pasó Gael.</p>
    <input name="pin" type="password" inputmode="numeric" autocomplete="one-time-code" maxlength="8" aria-label="PIN" required autofocus>
    <button class="btn" type="submit">Entrar</button>
    <?php if ($error): ?><p class="error" role="alert"><?= e($error) ?></p><?php endif; ?>
  </form>
</div>
<?php else:
  $icoBajar = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11m-5-5 5 5 5-5M5 20h14"/></svg>';
  $icoWa = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z"/></svg>';
?>
<header>
  <div class="ancho">
    <div class="fila"><div class="marca"><?= $LOGO ?><b>Villa<br>Bordeu</b></div><a class="salir" href="/material?salir=1">Salir</a></div>
    <h1>QR y tarjetas</h1>
  </div>
</header>
<main class="ancho">
  <section class="imprimir">
    <h2>Imprimí todo de una</h2>
    <p>4 hojas A4, a color y a tamaño real. Recortá por la línea punteada.</p>
    <a class="btn ancho100" href="<?= $a('imprimir') ?>">Abrir para imprimir</a>
  </section>

  <section>
    <h2>Los QR</h2>
    <p class="sub">Tocá un QR para mostrarlo en pantalla grande.</p>
    <div class="lista">
      <?php foreach ($QRS as $q): ?>
      <div class="qr">
        <button class="ver" type="button" data-archivo="<?= $q[0] ?>" aria-label="Mostrar en pantalla: <?= e($q[1]) ?>"><img src="<?= $m($q[0]) ?>" alt="" width="78" height="109" loading="lazy"></button>
        <div>
          <h3><?= e($q[1]) ?></h3>
          <p>Va en: <?= e($q[2]) ?></p>
          <div class="acciones">
            <a class="btn claro" href="<?= $a($q[0]) ?>&amp;descargar=1" download="<?= e($ARCHIVOS[$q[0]][1]) ?>"><?= $icoBajar ?>Bajar PNG</a>
            <button class="btn wa compartir" type="button" data-archivo="<?= $q[0] ?>" data-nombre="<?= e($ARCHIVOS[$q[0]][1]) ?>" hidden><?= $icoWa ?>Enviar</button>
          </div>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </section>

  <section>
    <h2>Pedí una reseña</h2>
    <div class="caja">
      <p>Mandale el link a un huésped cuando se va. Elegís el contacto en WhatsApp y enviás.</p>
      <a class="btn wa ancho100" href="<?= e($wa("¡Gracias por elegir ACA Villa Bordeu! Si nos dejás tu opinión en Google nos ayudás muchísimo, es un minuto: " . RESENA)) ?>" target="_blank" rel="noopener"><?= $icoWa ?>Pedir reseña por WhatsApp</a>
    </div>
  </section>

  <section>
    <h2>Tarjetas digitales</h2>
    <div class="caja">
      <?php foreach ($TARJETAS as $t): ?>
      <div class="tarjeta">
        <b><?= e($t[0]) ?></b>
        <div class="acciones">
          <a class="btn claro" href="<?= e($t[1]) ?>" target="_blank" rel="noopener">Abrir</a>
          <a class="btn wa" href="<?= e($wa($t[2] . ' ' . WEB . $t[1])) ?>" target="_blank" rel="noopener"><?= $icoWa ?>Enviar</a>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
  </section>

  <section>
    <h2>Tu celular</h2>
    <div class="caja">
      <h3>Fondo de pantalla con tu QR</h3>
      <p>Mostrás el celular bloqueado y te agendan, sin internet. Guardala en Fotos → Compartir → «Usar como fondo».</p>
      <a class="btn" href="<?= $a('fondo') ?>">Abrir el fondo</a>
    </div>
    <div class="caja">
      <h3>Tu contacto en tu iPhone</h3>
      <p>Guardalo y elegilo en Ajustes → Contactos → «Mis datos». Así lo pasás acercando dos iPhone.</p>
      <a class="btn" href="<?= $a('vcf') ?>">Guardar mi contacto</a>
    </div>
    <p class="nota"><b>¿Dos QR tuyos?</b> El del fondo tiene tu contacto adentro: es solo para el celular. Para imprimir, siempre el de «Tu tarjeta personal»: si cambia un dato, se corrige en la web y lo impreso sigue sirviendo.</p>
  </section>

  <p class="nota">¿Cambió un dato? Avisale a Gael. · <a href="<?= $a('tarjetas') ?>">Cómo funcionan las tarjetas (PDF)</a></p>
</main>

<dialog id="pantalla" aria-label="QR en pantalla grande">
  <div class="dentro">
    <img alt="">
    <button class="btn" type="button" data-cerrar>Cerrar</button>
  </div>
</dialog>
<script>
(function () {
  var d = document.getElementById('pantalla'), img = d.querySelector('img');
  document.querySelectorAll('.ver').forEach(function (b) {
    b.addEventListener('click', function () {
      img.src = '/material?archivo=' + b.dataset.archivo;
      if (d.showModal) d.showModal(); else location.href = img.src;
    });
  });
  d.querySelector('[data-cerrar]').addEventListener('click', function () { d.close(); });
  d.addEventListener('click', function (ev) { if (ev.target === d || ev.target.classList.contains('dentro')) d.close(); });

  // «Enviar» comparte la imagen con el menú del celular (WhatsApp incluido), si el navegador puede.
  if (!navigator.canShare || !navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] })) return;
  // La imagen se baja antes: Safari solo deja compartir en el mismo toque, sin esperar una descarga.
  document.querySelectorAll('.compartir').forEach(function (b) {
    var archivo = null;
    fetch('/material?archivo=' + b.dataset.archivo, { credentials: 'same-origin' })
      .then(function (r) { return r.blob(); })
      .then(function (blob) { archivo = new File([blob], b.dataset.nombre, { type: 'image/png' }); b.hidden = false; })
      .catch(function () {});
    b.addEventListener('click', function () { if (archivo) navigator.share({ files: [archivo] }).catch(function () {}); });
  });
})();
</script>
<?php endif; ?>
</body>
</html>
