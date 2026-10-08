import { SITIO, urlAbs } from "@/lib/sitio";
import { RUBROS } from "@/lib/rubros";
import { RUTAS } from "@/lib/rutas";
import { LUGARES } from "@/lib/cerca";
import { DISTANCIAS_TRABAJO, SERVICIOS } from "@/lib/datos";
import { TIPOS } from "@/lib/departamentos";
import { FAQ_EMPRESAS, FAQ_GENERAL } from "@/lib/faq";

export const dynamic = "force-static";

// Resumen en Markdown para buscadores con IA. Sale de los mismos datos que las páginas.
export function GET() {
  const l: string[] = [];
  l.push(`# ${SITIO.nombre}`, "");
  l.push(
    `> Alojamiento del Automóvil Club Argentino en Bahía Blanca (categoría Motel 3★ en la Red Hotelera ACA), sobre el cruce de las rutas nacionales 3, 33 y 35. ${SITIO.departamentos} departamentos con cochera cubierta, restaurante desde ${SITIO.restoDesde}, gimnasio, sala de reuniones, lavandería, recepción 24 horas, pet friendly y estación de servicio YPF en el mismo predio. Aloja equipos de trabajo de empresas y viajeros de ruta.`,
    "",
  );
  l.push("## Datos", "");
  l.push(`- Dirección: ${SITIO.direccion.calle}, ${SITIO.direccion.cp} ${SITIO.direccion.ciudad}, ${SITIO.direccion.provincia} (${SITIO.direccion.acceso})`);
  l.push(`- WhatsApp y teléfono: ${SITIO.telefono}`, `- Mail: ${SITIO.mail}`, `- Coordenadas: ${SITIO.direccion.lat}, ${SITIO.direccion.lng}`);
  l.push("- Cómo consultar: por WhatsApp o mail, con cuántos son y las fechas. Las condiciones se informan por esos medios.", "");
  l.push("## Departamentos", "");
  TIPOS.forEach((t) => l.push(`- ${t.nombre}: ${t.camas}. ${t.frase}`));
  l.push("", "## Servicios", "");
  SERVICIOS.forEach((s) => l.push(`- ${s.titulo}: ${s.texto}`));
  l.push("", "## Distancias desde el predio", "");
  DISTANCIAS_TRABAJO.forEach((d) => l.push(`- ${d.lugar}: ${d.km} km, unos ${d.min} minutos`));
  l.push("", "## Páginas", "");
  l.push(`- [Alojamiento para empresas](${urlAbs("/empresas")})`);
  RUBROS.forEach((r) => l.push(`- [${r.h1}](${urlAbs(`/empresas/${r.slug}`)}): ${r.bajada}`));
  l.push(`- [Departamentos](${urlAbs("/departamentos")})`, `- [Restaurante](${urlAbs("/restaurante")})`, `- [El complejo](${urlAbs("/el-complejo")})`);
  l.push(`- [Sala de reuniones](${urlAbs("/sala-de-reuniones")})`, `- [Estación de servicio](${urlAbs("/estacion-de-servicio")})`, `- [Socios ACA](${urlAbs("/socios-aca")})`);
  l.push(`- [Cómo llegar](${urlAbs("/como-llegar")})`);
  RUTAS.forEach((r) => l.push(`- [${r.h1}](${urlAbs(`/como-llegar/${r.slug}`)}): ${r.km} km, ${r.horas}`));
  LUGARES.forEach((x) => l.push(`- [${x.h1}](${urlAbs(`/cerca-de/${x.slug}`)}): ${x.distancia.km} km`));
  l.push("", "## Preguntas frecuentes", "");
  [...FAQ_GENERAL, ...FAQ_EMPRESAS].forEach((q) => l.push(`### ${q.p}`, "", q.r, ""));
  return new Response(l.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
