import type { Metadata } from "next";
import { SITIO, urlAbs } from "./sitio";

/** Metadatos de una página: title, description, canónica y Open Graph propios. */
export function meta({
  title,
  description,
  ruta,
  imagen = "/og/inicio.jpg",
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
    twitter: { card: "summary_large_image", title, description },
  };
}
