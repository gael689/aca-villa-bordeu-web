import type { MetadataRoute } from "next";
import { urlAbs } from "@/lib/sitio";
import { RUBROS } from "@/lib/rubros";
import { RUTAS } from "@/lib/rutas";
import { LUGARES } from "@/lib/cerca";

export default function sitemap(): MetadataRoute.Sitemap {
  const hoy = new Date();
  const fijas: [string, number][] = [
    ["/", 1],
    ["/empresas", 0.9],
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
    ...fijas.map(([r, p]) => ({ url: urlAbs(r), lastModified: hoy, priority: p })),
    ...RUBROS.map((r) => ({ url: urlAbs(`/empresas/${r.slug}`), lastModified: hoy, priority: 0.7 })),
    ...RUTAS.map((r) => ({ url: urlAbs(`/como-llegar/${r.slug}`), lastModified: hoy, priority: 0.6 })),
    ...LUGARES.map((l) => ({ url: urlAbs(`/cerca-de/${l.slug}`), lastModified: hoy, priority: 0.6 })),
  ];
}
