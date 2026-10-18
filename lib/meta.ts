import type { Metadata } from "next";
import { SITIO, urlAbs } from "./sitio";

/** Imagen para compartir de cada página, la que genera scripts/og.mjs: «/empresas/agro» → /og/empresas--agro.jpg. */
export const imagenOg = (ruta: string) => `/og/${ruta === "/" ? "inicio" : ruta.slice(1).replaceAll("/", "--")}.jpg`;

/** Metadatos de una página: title, description, canónica y Open Graph propios. */
export function meta({
  title,
  description,
  ruta,
  imagen = imagenOg(ruta),
}: {
  title: string;
  description: string;
  ruta: string;
  imagen?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_AR",
      siteName: SITIO.nombre,
      url: urlAbs(ruta),
      title,
      description,
      images: [{ url: imagen, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [imagen] },
  };
}
