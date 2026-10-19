// Arma la web para el hosting del cliente (ISPConfig: Apache + PHP, sin Node) en `out/`,
// lista para subir por FTP a la carpeta `web/`.
//
// Uso (desde la raíz del repo):  node scripts/exportar.mjs
//
// 1. Pre-genera las fotos de /fotos en WebP, un archivo por ancho (lib/imagen-loader.ts los pide).
// 2. Compila con SALIDA=estatica (output: "export", ver next.config.ts), con el dominio real e indexable.
//    app/api queda afuera mientras compila: en el hosting el mail sale por api/consulta.php.
// 3. Copia hosting/api/consulta.php y escribe el .htaccess: dominio canónico, URLs sin .html,
//    redirecciones 301 del sitio viejo (lib/redirecciones.json), 404 y caché.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "https://www.acavillabordeu.com.ar";
const ANCHOS = [256, 384, 640, 828, 1080, 1280, 1920];

// ── 1. Fotos ────────────────────────────────────────────────────────────────
const FOTOS = join(RAIZ, "public", "fotos");
const SALIDA_FOTOS = join(FOTOS, "_w");
const jpgs = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.name === "_w" ? [] : e.isDirectory() ? jpgs(join(dir, e.name)) : /\.jpe?g$/i.test(e.name) ? [join(dir, e.name)] : [],
  );
let nuevas = 0;
for (const archivo of jpgs(FOTOS)) {
  const base = relative(FOTOS, archivo).replace(/\.jpe?g$/i, "");
  for (const w of ANCHOS) {
    const destino = join(SALIDA_FOTOS, `${base}-${w}.webp`);
    if (existsSync(destino) && statSync(destino).mtimeMs >= statSync(archivo).mtimeMs) continue;
    mkdirSync(dirname(destino), { recursive: true });
    await sharp(archivo).resize({ width: w, withoutEnlargement: true }).webp({ quality: 78 }).toFile(destino);
    nuevas++;
  }
}
console.log(`Fotos: ${nuevas} versiones WebP nuevas en public/fotos/_w`);

// ── 2. Compilar ─────────────────────────────────────────────────────────────
const API = join(RAIZ, "app", "api");
const API_FUERA = join(RAIZ, "app", "_api"); // carpeta privada: Next no la publica
const devolver = () => existsSync(API_FUERA) && renameSync(API_FUERA, API);
process.on("SIGINT", () => {
  devolver();
  process.exit(130);
});
renameSync(API, API_FUERA);
let r;
try {
  r = spawnSync("npx", ["next", "build"], {
    cwd: RAIZ,
    stdio: "inherit",
    shell: true,
    env: {
      ...process.env,
      SALIDA: "estatica",
      NEXT_PUBLIC_SITE_URL: HOST,
      NEXT_PUBLIC_INDEXABLE: "1",
      NEXT_PUBLIC_CONSULTA_URL: "/api/consulta.php",
    },
  });
} finally {
  devolver();
}
if (r.status !== 0) process.exit(r.status ?? 1);

// ── 3. PHP y .htaccess ──────────────────────────────────────────────────────
const OUT = join(RAIZ, "out");
mkdirSync(join(OUT, "api"), { recursive: true });
copyFileSync(join(RAIZ, "hosting", "api", "consulta.php"), join(OUT, "api", "consulta.php"));

// «/Default.:ext(asp|htm|html)» (sintaxis de Next) → «^Default\.(?:asp|htm|html)$» (Apache);
// «:resto*» → «.*». Los .php viejos también respondían con algo detrás (/index.php/x, PATH_INFO).
const aRegex = (fuente) =>
  "^" +
  fuente
    .slice(1)
    .split(/(:\w+\([^)]*\)|:\w+\*)/)
    .map((t) =>
      t.startsWith(":") && t.endsWith("*")
        ? ".*"
        : t.startsWith(":")
          ? `(?:${t.slice(t.indexOf("(") + 1, -1)})`
          : t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("") +
  (fuente.endsWith(".php") ? "(?:/.*)?" : "") +
  "$";
const { redirecciones } = JSON.parse(readFileSync(join(RAIZ, "lib", "redirecciones.json"), "utf8"));
// Directo al dominio canónico (un solo salto) y sin el query viejo (QSD).
const reglas = redirecciones.map(([de, a]) => `RewriteRule ${aRegex(de)} ${HOST}${a} [R=301,NC,QSD,L]`).join("\n");

// Carpetas del sitio viejo que siguen en el servidor y no son de la web nueva:
// estadísticas y errores de ISPConfig, y pantallas (noticias, menu) que puede estar
// usando algún televisor del hotel. Se sirven como siempre.
const CARPETAS = ["stats", "error", "noticias", "menu", "rcc", "camaras", "vieja", "Images"];

writeFileSync(
  join(OUT, ".htaccess"),
  `# Generado por scripts/exportar.mjs: no editar a mano en el servidor.
Options -Indexes -MultiViews
DirectoryIndex index.html index.htm index.php
# Las páginas son archivos .html con carpetas del mismo nombre al lado: sin esto,
# Apache mandaría /habitaciones a /habitaciones/.
DirectorySlash Off
ErrorDocument 404 /404.html

RewriteEngine On

# Sitio viejo y URLs históricas → páginas nuevas (lib/redirecciones.json).
${reglas}

# Un solo dominio: https y con www.
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} !^www\\. [NC]
RewriteRule ^ ${HOST}%{REQUEST_URI} [R=301,L]

# Carpetas viejas que se conservan: con barra final, y sin tocar lo de adentro.
RewriteRule ^(${CARPETAS.join("|")})$ /$1/ [R=301,L]
RewriteRule ^(${CARPETAS.join("|")})/ - [L]

# /index.html y /pagina.html → la URL limpia.
RewriteRule ^index\\.html$ / [R=301,L]
RewriteCond %{THE_REQUEST} \\s/([^?\\s]+)\\.html[\\s?]
RewriteCond %1 !^404$
RewriteRule ^ /%1 [R=301,L]

# Barra final de más → sin barra.
# (Las carpetas viejas ya salieron arriba; las de la web nueva son de Next, sin index.)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(.+)/$ /$1 [R=301,L]

# URL limpia → su .html.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.+)$ /$1.html [L]

<IfModule mod_headers.c>
  # JS, CSS y fuentes de _next llevan un hash en el nombre: caché de un año.
  <FilesMatch "\\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  # Las fotos pueden cambiar con el mismo nombre: un mes.
  <FilesMatch "\\.(webp|avif|jpg|png|svg|ico)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/xml image/svg+xml
</IfModule>

AddType text/plain .txt
AddDefaultCharset utf-8
`,
);
// ── 4. Antes de subir: que nada salga cerrado a Google ni apuntando a Vercel ──
const fallas = [];
const robots = readFileSync(join(OUT, "robots.txt"), "utf8");
if (/Disallow: \/\s*$/m.test(robots)) fallas.push("robots.txt bloquea todo el sitio");
for (const pagina of ["index.html", "habitaciones.html", "restaurante.html"]) {
  const html = readFileSync(join(OUT, pagina), "utf8");
  if (/noindex/.test(html)) fallas.push(`${pagina} tiene noindex`);
  if (/vercel\.app/.test(html)) fallas.push(`${pagina} menciona vercel.app`);
  if (!html.includes(`rel="canonical" href="${HOST}`)) fallas.push(`${pagina}: la canónica no es ${HOST}`);
}
for (const og of readFileSync(join(OUT, "sitemap.xml"), "utf8").matchAll(/<loc>[^<]*?\.ar([^<]*)<\/loc>/g)) {
  const ruta = og[1] || "/";
  const archivo = join(RAIZ, "public", "og", `${ruta === "/" ? "inicio" : ruta.slice(1).replaceAll("/", "--")}.jpg`);
  if (!existsSync(archivo)) fallas.push(`falta la imagen para compartir de ${ruta} (correr scripts/og.mjs)`);
}
if (fallas.length) {
  console.error("\nNO SUBIR:\n- " + fallas.join("\n- "));
  process.exit(1);
}
console.log(`Listo: out/ (${redirecciones.length} redirecciones en el .htaccess). Subir el contenido de out/ a web/ por FTP.`);
