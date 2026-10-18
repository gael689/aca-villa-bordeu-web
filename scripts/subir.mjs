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
import { Client } from "basic-ftp";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(join(RAIZ, ".env.hosting"), "utf8")
    .split(/\r?\n/)
    .filter((l) => /^\w+=/.test(l))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);

const ftp = new Client(60_000);
ftp.trackProgress((i) => i.name && process.stdout.write(`\r${i.type === "upload" ? "↑" : "↓"} ${i.name.slice(0, 70).padEnd(70)}`));
try {
  // ISPConfig acepta FTP explícito con TLS; el certificado es el del servidor, no el del dominio.
  await ftp.access({ host: env.FTP_HOST, user: env.FTP_USUARIO, password: env.FTP_CLAVE, secure: true, secureOptions: { rejectUnauthorized: false } });

  if (process.argv.includes("--respaldo")) {
    const destino = join(RAIZ, "..", `respaldo-web-${new Date().toISOString().slice(0, 10)}`);
    await ftp.downloadToDir(destino, "web");
    console.log(`\nRespaldo del sitio viejo en ${destino}`);
  } else {
    if (!existsSync(join(RAIZ, "out", ".htaccess"))) throw new Error("Falta out/: correr antes node scripts/exportar.mjs");
    await ftp.uploadFromDir(join(RAIZ, "out"), "web");
    console.log("\nSubido. Probar: https://www.acavillabordeu.com.ar y la lista de verificación del README.");
  }
} finally {
  ftp.close();
}
