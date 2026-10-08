import data from "./fotos.json";

// fotos.json lo genera el script de preparación de imágenes: tamaños reales y
// un placeholder borroso de 14 px por foto, para que nunca haya un hueco gris.
const blur = data.blur as Record<string, string>;
const dims = data.dims as unknown as Record<string, [number, number]>;

export type Foto = {
  src: string;
  width: number;
  height: number;
  blurDataURL: string;
  alt: string;
};

export function foto(carpeta: string, archivo: string, alt: string): Foto {
  const k = `${carpeta}/${archivo}`;
  const d = dims[k];
  if (!d) throw new Error(`Foto inexistente: ${k}`);
  return {
    src: `/fotos/${k}`,
    width: d[0],
    height: d[1],
    blurDataURL: blur[k],
    alt,
  };
}
