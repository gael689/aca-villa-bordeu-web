import type { MetadataRoute } from "next";
import { actualizado, urlAbs } from "@/lib/sitio";
import { RUBROS } from "@/lib/rubros";
import { RUTAS } from "@/lib/rutas";
import { LUGARES } from "@/lib/cerca";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const fijas: [string, number][] = [
    ["/", 1],
    ["/empresas", 0.9],
    ["/delegaciones-deportivas", 0.8],
    ["/habitaciones", 0.9],
    ["/restaurante", 0.8],
    ["/instalaciones", 0.7],
    ["/sala-de-reuniones", 0.6],
    ["/estacion-de-servicio", 0.6],
    ["/socios-aca", 0.6],
    ["/historia", 0.4],
    ["/como-llegar", 0.8],
    ["/consulta", 0.7],
    ["/preguntas-frecuentes", 0.6],
    ["/contacto", 0.7],
  ];
  return [
    ...fijas.map(([r, p]) => ({ url: urlAbs(r), lastModified: actualizado, priority: p })),
    ...RUBROS.map((r) => ({ url: urlAbs(`/empresas/${r.slug}`), lastModified: actualizado, priority: 0.7 })),
    ...RUTAS.map((r) => ({ url: urlAbs(`/como-llegar/${r.slug}`), lastModified: actualizado, priority: 0.6 })),
    ...LUGARES.map((l) => ({ url: urlAbs(`/cerca-de/${l.slug}`), lastModified: actualizado, priority: 0.6 })),
  ];
}
