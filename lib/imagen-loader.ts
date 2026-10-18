// Loader de imágenes del export estático (SALIDA=estatica): sin optimizador en el
// servidor, cada foto de /fotos tiene sus versiones WebP pre-generadas por
// scripts/exportar.mjs en /fotos/_w/, una por ancho de next.config.ts.
const ANCHOS = [256, 384, 640, 828, 1080, 1280, 1920];

export default function cargarImagen({ src, width }: { src: string; width: number; quality?: number }) {
  if (!src.startsWith("/fotos/") || !/\.jpe?g$/i.test(src)) return src;
  const w = ANCHOS.find((a) => a >= width) ?? ANCHOS[ANCHOS.length - 1];
  return src.replace(/^\/fotos\//, "/fotos/_w/").replace(/\.jpe?g$/i, `-${w}.webp`);
}
