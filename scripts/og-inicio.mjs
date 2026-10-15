// Genera public/og/inicio.jpg (1200 × 630), la imagen para compartir el sitio.
// Necesita Playwright: desde esta carpeta,
//   NODE_PATH=../../../../taller/node_modules node scripts/og-inicio.mjs
// (o cualquier node_modules con `playwright`). Las fuentes salen de Google Fonts.
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logo = readFileSync(path.join(raiz, "lib/logo.ts"), "utf8");
const viewBox = logo.match(/LOGO_ACA_VIEWBOX = "([^"]+)"/)[1];
const trazo = logo.match(/LOGO_ACA_PATH = "([^"]+)"/)[1];
const foto = "data:image/jpeg;base64," + readFileSync(path.join(raiz, "public/fotos/portada/02-departamento.jpg")).toString("base64");

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@600&family=Barlow+Condensed:wght@600;700&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #141516; color: #fff; font-family: Barlow, sans-serif; position: relative; }
  .foto { position: absolute; inset: 0; background: url(${foto}) center / cover; }
  .velo { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(10 10 11 / .82), rgb(10 10 11 / .45) 70%, rgb(10 10 11 / .3)), linear-gradient(180deg, transparent 40%, rgb(10 10 11 / .6)); }
  .marca { position: absolute; left: 72px; top: 64px; display: flex; align-items: center; gap: 18px; }
  .marca svg { height: 46px; color: #df1d2e; }
  .marca span { border-left: 1.5px solid rgb(255 255 255 / .4); padding-left: 18px; font: 600 25px/0.95 "Barlow Condensed"; letter-spacing: .08em; text-transform: uppercase; }
  h1 { position: absolute; left: 72px; bottom: 112px; font: 700 92px/0.92 "Barlow Condensed"; text-transform: uppercase; }
  h1 em { font-style: normal; color: #f1bb01; }
  p { position: absolute; left: 72px; bottom: 58px; font-size: 25px; color: rgb(255 255 255 / .9); }
</style></head><body>
  <div class="foto"></div><div class="velo"></div>
  <div class="marca"><svg viewBox="${viewBox}"><path d="${trazo}" fill="currentColor"/></svg><span>Villa<br>Bordeu</span></div>
  <h1>Hotelería<br>estratégica<br><em>en Bahía Blanca</em></h1>
  <p>Habitaciones, restaurante y servicios sobre el cruce de las rutas 3, 33 y 35</p>
</body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html, { waitUntil: "networkidle" });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(raiz, "public/og/inicio.jpg"), type: "jpeg", quality: 86 });
await b.close();
console.log("public/og/inicio.jpg");
