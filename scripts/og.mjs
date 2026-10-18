// Genera la imagen para compartir (1200 × 630) de cada página en public/og/<página>.jpg,
// el nombre que espera lib/meta.ts («/» → inicio, «/empresas/agro» → empresas--agro).
// Lee el sitio ya compilado en out/ (node scripts/exportar.mjs): de cada URL del sitemap
// toma el h1 (con su palabra destacada) y la primera foto de la página, así la imagen
// siempre dice lo mismo que la página. Si se cambia un título o una foto, volver a correrlo
// y commitear public/og (sirve también para Vercel).
//
// Necesita Playwright: desde la raíz del repo,
//   NODE_PATH=../../../../taller/node_modules node scripts/og.mjs
import { createRequire } from "node:module";
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(raiz, "out");
if (!existsSync(path.join(out, "sitemap.xml"))) throw new Error("Falta out/: correr antes node scripts/exportar.mjs");

const logo = readFileSync(path.join(raiz, "lib/logo.ts"), "utf8");
const viewBox = logo.match(/LOGO_ACA_VIEWBOX = "([^"]+)"/)[1];
const trazo = logo.match(/LOGO_ACA_PATH = "([^"]+)"/)[1];
const datos = (archivo) => "data:image/jpeg;base64," + readFileSync(path.join(raiz, "public", archivo)).toString("base64");
const FOTO_DEFECTO = "fotos/predio/aerea-dia.jpg";

const rutas = [...readFileSync(path.join(out, "sitemap.xml"), "utf8").matchAll(/<loc>https?:\/\/[^/<]+([^<]*)<\/loc>/g)].map((m) => m[1] || "/");
const nombre = (ruta) => (ruta === "/" ? "inicio" : ruta.slice(1).replaceAll("/", "--"));

const plantilla = ({ titulo, foto, etiqueta }) => `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@600&family=Barlow+Condensed:wght@600;700&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #141516; color: #fff; font-family: Barlow, sans-serif; position: relative; }
  .foto { position: absolute; inset: 0; background: url(${foto}) center / cover; }
  .velo { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(10 10 11 / .84), rgb(10 10 11 / .5) 70%, rgb(10 10 11 / .3)), linear-gradient(180deg, transparent 40%, rgb(10 10 11 / .6)); }
  .marca { position: absolute; left: 72px; top: 64px; display: flex; align-items: center; gap: 18px; }
  .marca svg { height: 46px; color: #df1d2e; }
  .marca span { border-left: 1.5px solid rgb(255 255 255 / .4); padding-left: 18px; font: 600 25px/0.95 "Barlow Condensed"; letter-spacing: .08em; text-transform: uppercase; }
  .etiqueta { position: absolute; right: 72px; top: 76px; font: 600 22px/1 "Barlow Condensed"; letter-spacing: .14em; text-transform: uppercase; color: #f1bb01; }
  h1 { position: absolute; left: 72px; right: 160px; bottom: 112px; max-height: 330px; font: 700 92px/0.92 "Barlow Condensed"; text-transform: uppercase; }
  h1 em { font-style: normal; color: #f1bb01; }
  p { position: absolute; left: 72px; bottom: 58px; font-size: 25px; color: rgb(255 255 255 / .9); }
</style></head><body>
  <div class="foto"></div><div class="velo"></div>
  <div class="marca"><svg viewBox="${viewBox}"><path d="${trazo}" fill="currentColor"/></svg><span>Villa<br>Bordeu</span></div>
  ${etiqueta ? `<div class="etiqueta">${etiqueta}</div>` : ""}
  <h1>${titulo}</h1>
  <p>Alojamiento del ACA en Bahía Blanca · Rutas 3, 33 y 35</p>
</body></html>`;

const b = await chromium.launch();
const lector = await b.newPage();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
mkdirSync(path.join(raiz, "public/og"), { recursive: true });
mkdirSync(path.join(out, "og"), { recursive: true });

for (const ruta of rutas) {
  const html = path.join(out, ruta === "/" ? "index.html" : `${ruta.slice(1)}.html`);
  // Sin JavaScript: alcanza con el HTML que ya viene renderizado.
  await lector.goto(pathToFileURL(html).href, { waitUntil: "domcontentloaded" });
  const pagina = await lector.evaluate(() => {
    const h1 = document.querySelector("main h1");
    const copia = h1.cloneNode(true);
    copia.querySelectorAll("svg, .sr-only").forEach((n) => n.remove());
    copia.querySelectorAll(".resalte").forEach((n) => n.replaceWith(Object.assign(document.createElement("em"), { textContent: n.textContent })));
    const img = [...document.querySelectorAll("main img")].map((i) => i.getAttribute("src") || "").find((s) => s.includes("/fotos/"));
    return { titulo: copia.innerHTML.replace(/<(?!\/?em>)[^>]+>/g, " ").replace(/\s+/g, " ").trim(), img, etiqueta: h1.dataset.etiqueta ?? "" };
  });
  // /fotos/_w/portada/x-1080.webp → fotos/portada/x.jpg (la original, la mejor calidad).
  const original = pagina.img ? pagina.img.replace(/^\/fotos\/_w\//, "fotos/").replace(/-\d+\.webp$/, ".jpg").replace(/^\//, "") : FOTO_DEFECTO;
  const foto = datos(existsSync(path.join(raiz, "public", original)) ? original : FOTO_DEFECTO);

  await p.setContent(plantilla({ titulo: pagina.titulo, foto, etiqueta: ruta === "/" ? "" : pagina.etiqueta }), { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  // Títulos largos: achicar la letra hasta que entre.
  await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    let t = 92;
    while (t > 48 && (h1.scrollHeight > 330 || h1.scrollWidth > h1.clientWidth)) h1.style.fontSize = `${(t -= 4)}px`;
  });
  const destino = path.join(raiz, "public/og", `${nombre(ruta)}.jpg`);
  await p.screenshot({ path: destino, type: "jpeg", quality: 86 });
  copyFileSync(destino, path.join(out, "og", `${nombre(ruta)}.jpg`));
  console.log(`public/og/${nombre(ruta)}.jpg  ←  ${pagina.titulo.replace(/<\/?em>/g, "")}`);
}
await b.close();
