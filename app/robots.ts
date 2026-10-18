import type { MetadataRoute } from "next";
import { SITIO, urlAbs } from "@/lib/sitio";

export const dynamic = "force-static";

// Hasta publicar en el dominio (NEXT_PUBLIC_INDEXABLE=1) no se indexa nada.
// Publicado: todo abierto, incluidos los buscadores con IA (queremos que lean).
export default function robots(): MetadataRoute.Robots {
  if (!SITIO.indexable) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: urlAbs("/sitemap.xml"),
    host: SITIO.url,
  };
}
