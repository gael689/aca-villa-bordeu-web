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
?><!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Material para imprimir · ACA Villa Bordeu</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root { --tinta: #141516; --amarillo: #f1bb01; --rojo: #df1d2e; --papel: #faf8f3; --gris: #5b5d60; --linea: #e4e0d5; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font: 16px/1.5 Barlow, system-ui, sans-serif; color: var(--tinta); background: var(--papel); -webkit-text-size-adjust: 100%; }
  a { color: inherit; }
  .marca { display: flex; align-items: center; gap: 12px; }
  .marca svg { height: 44px; width: auto; color: var(--rojo); display: block; }
  .marca b { font: 700 14px/.95 "Barlow Condensed", sans-serif; letter-spacing: .12em; text-transform: uppercase; border-left: 1.5px solid rgb(20 21 22 / .35); padding-left: 12px; }
  h1, h2 { font-family: "Barlow Condensed", sans-serif; text-transform: uppercase; line-height: .95; }
  h1 { font-size: clamp(40px, 11vw, 64px); margin-top: 22px; }
  h2 { font-size: 30px; margin-bottom: 14px; }
  .rot { font: 600 13px/1 "Barlow Condensed", sans-serif; letter-spacing: .22em; text-transform: uppercase; margin-top: 26px; }
  header { background: var(--amarillo); padding: 22px 16px 30px; }
  .ancho { max-width: 760px; margin: 0 auto; }
  header p.bajada { margin-top: 12px; font-size: 17px; max-width: 34em; }
  main { padding: 8px 16px 48px; }
  section { margin-top: 34px; }
  .btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 12px 20px; border-radius: 999px; background: var(--tinta); color: var(--amarillo); text-decoration: none; font: 700 18px/1 "Barlow Condensed", sans-serif; letter-spacing: .05em; text-transform: uppercase; border: 0; cursor: pointer; }
  .btn.claro { background: #fff; color: var(--tinta); border: 1.5px solid var(--tinta); }
  .btn.chico { min-height: 40px; padding: 9px 16px; font-size: 16px; }
  .imprimir { background: #fff; border: 2px solid var(--tinta); border-radius: 20px; padding: 22px; }
  .imprimir h2 { margin-bottom: 8px; }
  .imprimir ul { margin: 12px 0 18px 20px; }
  .imprimir li + li { margin-top: 4px; }
  .hoja { display: grid; grid-template-columns: 96px 1fr; gap: 16px; padding: 18px 0; border-top: 1px solid var(--linea); align-items: start; }
  .hoja:last-child { border-bottom: 1px solid var(--linea); }
  .hoja img { width: 96px; height: auto; border-radius: 8px; display: block; box-shadow: 0 6px 16px -10px rgb(20 21 22 / .6); }
  .num { font: 700 13px/1 "Barlow Condensed", sans-serif; letter-spacing: .18em; text-transform: uppercase; color: var(--gris); }
  .hoja h3 { font: 700 22px/1.05 "Barlow Condensed", sans-serif; text-transform: uppercase; margin: 4px 0 6px; }
  .hoja p { font-size: 15.5px; }
  .hoja p b { font-weight: 600; }
  .hoja .btn { margin-top: 10px; }
  .dos { display: grid; gap: 14px; }
  @media (min-width: 620px) { .dos { grid-template-columns: 1fr 1fr; } .hoja { grid-template-columns: 120px 1fr; } .hoja img { width: 120px; } }
  .caja { background: #fff; border: 1px solid var(--linea); border-radius: 16px; padding: 18px; }
  .caja h3 { font: 700 20px/1.05 "Barlow Condensed", sans-serif; text-transform: uppercase; margin-bottom: 8px; }
  .caja p + p, .caja ol { margin-top: 8px; }
  .caja ol { margin-left: 20px; }
  .caja .btn { margin-top: 12px; }
  .nota { margin-top: 34px; font-size: 15px; color: var(--gris); }
  .pin { min-height: 100vh; min-height: 100dvh; background: var(--amarillo); display: grid; place-items: center; padding: 24px 16px; }
  .pin form { width: 100%; max-width: 360px; }
  .pin h1 { margin-top: 26px; }
  .pin p { margin-top: 10px; }
  .pin input { width: 100%; margin-top: 18px; font: 700 32px/1 "Barlow Condensed", sans-serif; letter-spacing: .4em; text-align: center; padding: 14px; border: 2px solid var(--tinta); border-radius: 14px; background: #fff; color: var(--tinta); }
  .pin .btn { width: 100%; margin-top: 12px; }
  .error { margin-top: 12px; font-weight: 600; color: #9b0d1a; }
  .acciones { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .acciones .btn { margin-top: 0; }
  .compartir[hidden] { display: none; }
  .enlaces { display: grid; gap: 10px; margin-top: 14px; }
  .enlaces a { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 16px; background: #fff; border: 1px solid var(--linea); border-radius: 14px; text-decoration: none; }
  .enlaces a span { color: var(--gris); font-size: 14px; }
  .ideal { background: var(--amarillo); border-radius: 16px; padding: 18px; margin-bottom: 14px; font-size: 17px; }
  .salir { font-size: 14px; color: var(--gris); }
</style>
</head>
<body>
<?php if (!$entro): ?>
<div class="pin">
  <form method="post" action="/material">
    <div class="marca"><?= $LOGO ?><b>Villa<br>Bordeu</b></div>
    <h1>Material<br>para imprimir</h1>
    <p>QR, tarjetas y reseñas. Ingresá el PIN que te pasó Gael.</p>
    <input name="pin" type="password" inputmode="numeric" autocomplete="one-time-code" maxlength="8" aria-label="PIN" required autofocus>
    <button class="btn" type="submit">Entrar</button>
    <?php if ($error): ?><p class="error" role="alert"><?= e($error) ?></p><?php endif; ?>
  </form>
</div>
<?php else: ?>
<header>
  <div class="ancho">
    <div class="marca"><?= $LOGO ?><b>Villa<br>Bordeu</b></div>
    <p class="rot">QR y tarjetas</p>
    <h1>Qué imprimir<br>y para qué</h1>
    <p class="bajada">Todo en un lugar. Esto reemplaza lo que te mandé suelto por WhatsApp.</p>
  </div>
</header>
<main class="ancho">
  <section class="imprimir">
    <p class="num">Paso 1</p>
    <h2>Imprimí un solo archivo</h2>
    <p>Son 4 hojas A4 con 4 QR cada una, listas para recortar.</p>
    <ul>
      <li>A4, <b>a color</b>, tamaño real (100 %).</li>
      <li>Recortá por la línea punteada.</li>
      <li>Mejor en papel grueso. Los de las mesas, plastificados.</li>
    </ul>
    <a class="btn" href="<?= $a('imprimir') ?>">Descargar para imprimir</a>
  </section>

  <section>
    <p class="num">Paso 2</p>
    <h2>Qué es cada uno y dónde va</h2>
    <?php foreach ([
      ['resto', 'Hoja 1', 'Resto: carta y pedidos', 'Abre la carta. El cliente elige los platos y manda el pedido por WhatsApp o mail.', 'En las mesas y el mostrador del Resto.'],
      ['resenas', 'Hoja 2', 'Reseñas de Google', 'Abre Google para que el huésped deje su opinión sobre el alojamiento.', 'En recepción, a la vista al hacer el check-out, y en las habitaciones.'],
      ['contacto', 'Hoja 3', 'Contacto del ACA', 'Teléfonos, WhatsApp, mail y dirección del ACA, con el botón para guardarlos.', 'En recepción.'],
      ['predio', 'Hoja 3', 'Conocé el predio', 'Habitaciones, Resto, Estación YPF, fotos y cómo llegar.', 'En recepción y para entregar a empresas y delegaciones.'],
      ['rodrigo', 'Hoja 4', 'Tu tarjeta personal', 'Tu tarjeta digital: celular, teléfono laboral, mail y el botón para guardar tu contacto.', 'En tu escritorio y en reuniones.'],
    ] as $h): ?>
    <div class="hoja">
      <a href="<?= $a($h[0]) ?>"><img src="<?= $m($h[0]) ?>" alt="QR <?= e($h[2]) ?>" width="120" height="168" loading="lazy"></a>
      <div>
        <p class="num"><?= e($h[1]) ?></p>
        <h3><?= e($h[2]) ?></h3>
        <p><b>Al escanearlo:</b> <?= e($h[3]) ?></p>
        <p><b>Dónde va:</b> <?= e($h[4]) ?></p>
        <div class="acciones">
          <a class="btn chico" href="<?= $a($h[0]) ?>&amp;descargar=1" download="<?= e($ARCHIVOS[$h[0]][1]) ?>">Descargar imagen PNG</a>
          <button class="btn claro chico compartir" type="button" data-archivo="<?= $h[0] ?>" data-nombre="<?= e($ARCHIVOS[$h[0]][1]) ?>" hidden>Enviar por WhatsApp</button>
        </div>
      </div>
    </div>
    <?php endforeach; ?>
  </section>

  <section>
    <h2>Tus tarjetas digitales</h2>
    <p>Son páginas de la web. Podés mandar el link por WhatsApp o abrirlas para mostrarlas.</p>
    <div class="enlaces">
      <a href="/tarjeta-completa" target="_blank" rel="noopener"><b>Tarjeta extensa del ACA</b><span>Habitaciones, Resto, YPF, fotos →</span></a>
      <a href="/tarjeta" target="_blank" rel="noopener"><b>Tarjeta corta del ACA</b><span>Teléfonos y contacto →</span></a>
      <a href="/rodrigo" target="_blank" rel="noopener"><b>Tu tarjeta personal</b><span>Rodrigo H. Gomez →</span></a>
      <a href="<?= $a('tarjetas') ?>"><b>Cómo funcionan las tarjetas (PDF)</b><span>Explicación completa →</span></a>
    </div>
  </section>

  <section>
    <h2>¿Por qué hay dos QR tuyos?</h2>
    <p class="ideal"><b>Lo ideal:</b> todo lo que se imprime lleva el QR con link (hoja 4). El otro es solo para el fondo de pantalla de tu celular.</p>
    <div class="dos">
      <div class="caja">
        <h3>QR con link: el que se imprime</h3>
        <p>Abre tu tarjeta digital en la web. Si mañana cambia un teléfono, lo corrijo en la web y lo impreso sigue sirviendo.</p>
        <p>Necesita internet en el celular del que escanea.</p>
      </div>
      <div class="caja">
        <h3>QR con tu contacto adentro: el del celular</h3>
        <p>Guarda tu contacto directo, sin internet. Sirve cara a cara: mostrás tu celular bloqueado y el otro escanea.</p>
        <p>No se imprime: si cambia un dato, hay que hacer otro.</p>
      </div>
    </div>
  </section>

  <section>
    <h2>Para tu celular (no imprimir)</h2>
    <div class="dos">
      <div class="caja">
        <h3>Fondo de pantalla con tu QR</h3>
        <ol>
          <li>Abrila y guardala en Fotos.</li>
          <li>Fotos → la imagen → Compartir → «Usar como fondo».</li>
          <li>Elegí solo la pantalla de bloqueo.</li>
        </ol>
        <a class="btn chico" href="<?= $a('fondo') ?>">Abrir el fondo</a>
      </div>
      <div class="caja">
        <h3>Tu contacto en tu iPhone</h3>
        <ol>
          <li>Tocá el botón → «Crear contacto nuevo».</li>
          <li>Ajustes → Apps → Contactos → «Mis datos» → elegí «Rodrigo H. Gomez».</li>
        </ol>
        <p>Así podés pasarlo acercando dos iPhone (NameDrop).</p>
        <a class="btn chico" href="<?= $a('vcf') ?>">Guardar mi contacto</a>
      </div>
    </div>
  </section>

  <p class="nota">¿Cambió un teléfono o un dato? Avisame y lo corrijo en la web: los QR impresos siguen sirviendo. · <a class="salir" href="/material?salir=1">Salir</a></p>
</main>
<script>
(function () {
  if (!navigator.canShare) return;
  document.querySelectorAll('.compartir').forEach(function (b) {
    var prueba = new File([''], 'x.png', { type: 'image/png' });
    if (!navigator.canShare({ files: [prueba] })) return;
    b.hidden = false;
    b.addEventListener('click', function () {
      fetch('/material?archivo=' + b.dataset.archivo, { credentials: 'same-origin' })
        .then(function (r) { return r.blob(); })
        .then(function (blob) { return navigator.share({ files: [new File([blob], b.dataset.nombre, { type: 'image/png' })] }); })
        .catch(function () {});
    });
  });
})();
</script>
<?php endif; ?>
</body>
</html>
