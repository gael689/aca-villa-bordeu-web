// Sube out/ al hosting del cliente por FTP (con TLS), a la carpeta web/.
// Lo corre Gael a mano, nunca un proceso automático: reemplaza el sitio en vivo.
//
//   node scripts/subir.mjs --respaldo   baja todo web/ a ../respaldo-web-AAAA-MM-DD (hacerlo antes de la primera subida)
//   node scripts/subir.mjs              sube out/ a web/ (pisa lo que tenga el mismo nombre, no borra nada)
//
// Credenciales en .env.hosting (ignorado por git, nunca al repo):
//   FTP_HOST=acavillabordeu.com.ar
//   FTP_USUARIO=...
//   FTP_CLAVE=...
//
// El servidor corta la conexión cada tanto (ECONNRESET): la subida va archivo por
// archivo, reconecta y reintenta, y saltea lo que ya está arriba con el mismo
// tamaño, así que si se corta se vuelve a correr y sigue donde quedó. El .htaccess
// sube último: si sube antes, las URLs viejas redirigen a páginas que todavía no están.
import { Client } from "basic-ftp";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(RAIZ, ".env.hosting"), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^\w+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);

let ftp;
async function conectar() {
  ftp?.close();
  ftp = new Client(120_000);
  // ISPConfig acepta FTP explícito con TLS; el certificado es el del servidor, no el del dominio.
  await ftp.access({ host: env.FTP_HOST, user: env.FTP_USUARIO, password: env.FTP_CLAVE, secure: true, secureOptions: { rejectUnauthorized: false } });
}

async function reintentar(que, fn) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i === 5) throw new Error(`${que}: ${e.message}`);
      console.log(`\n  reintento ${i} (${que}): ${e.message}`);
      await conectar();
    }
  }
}

// Archivos de out/ relativos, el .htaccess al final.
function archivos(dir, base = "") {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? archivos(join(dir, e.name), `${base}${e.name}/`) : [`${base}${e.name}`],
  );
}

try {
  await conectar();

  if (process.argv.includes("--respaldo")) {
    const destino = join(RAIZ, "..", `respaldo-web-${new Date().toISOString().slice(0, 10)}`);
    await ftp.downloadToDir(destino, "web");
    console.log(`\nRespaldo del sitio viejo en ${destino}`);
  } else {
    const OUT = join(RAIZ, "out");
    if (!existsSync(join(OUT, ".htaccess"))) throw new Error("Falta out/: correr antes node scripts/exportar.mjs");
    const lista = archivos(OUT).sort((a, b) => (a === ".htaccess") - (b === ".htaccess"));

    // Tamaños de lo que ya está arriba, carpeta por carpeta.
    const remoto = new Map();
    for (const carpeta of new Set(lista.map((f) => dirname(f)))) {
      const ruta = carpeta === "." ? "web" : `web/${carpeta}`;
      const l = await reintentar(`listar ${ruta}`, () => ftp.list(ruta)).catch(() => []);
      for (const f of l) remoto.set(`${carpeta === "." ? "" : carpeta + "/"}${f.name}`, f.size);
    }

    let subidos = 0;
    for (const [n, f] of lista.entries()) {
      if (remoto.get(f) === statSync(join(OUT, f)).size) continue;
      process.stdout.write(`\r↑ ${n + 1}/${lista.length} ${f.slice(0, 60).padEnd(60)}`);
      await reintentar(f, async () => {
        await ftp.ensureDir(`/web/${dirname(f) === "." ? "" : dirname(f)}`);
        await ftp.uploadFrom(join(OUT, f), `/web/${f}`);
      });
      subidos++;
    }
    console.log(`\nSubido: ${subidos} archivos nuevos o cambiados, ${lista.length - subidos} ya estaban. Probar: https://www.acavillabordeu.com.ar y la lista de verificación del README.`);
  }
} finally {
  ftp?.close();
}
