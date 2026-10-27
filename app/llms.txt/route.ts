import { SITIO, actualizado, urlAbs } from "@/lib/sitio";
import { RUBROS } from "@/lib/rubros";
import { DELEGACIONES } from "@/lib/delegaciones";
import { RUTAS } from "@/lib/rutas";
import { LUGARES } from "@/lib/cerca";
import { DISTANCIAS_TRABAJO, SERVICIOS } from "@/lib/datos";
import { TIPOS } from "@/lib/habitaciones";
import { FAQ_EMPRESAS, FAQ_GENERAL } from "@/lib/faq";
import { CARTA } from "@/lib/carta";

export const dynamic = "force-static";

// Resumen en Markdown para buscadores con IA. Sale de los mismos datos que las páginas.
export function GET() {
  const l: string[] = [];
  l.push(`# ${SITIO.nombre}`, "");
  l.push(
    `> Alojamiento del Automóvil Club Argentino en Bahía Blanca (categoría Motel 3★ en la Red Hotelera ACA), sobre el cruce de las rutas nacionales 3, 33 y 35, abierto desde ${SITIO.abiertoDesde}. Habitaciones con cochera cubierta, restaurante, gimnasio, oficina de cortesía, sala de reuniones, lavandería, recepción 24 horas, pet friendly y estación de servicio YPF en el mismo predio. Aloja equipos de trabajo de empresas y viajeros de ruta.`,
    "",
  );
  l.push(`Actualizado: ${actualizado}`, "");
  l.push("## Datos", "");
  l.push(`- Dirección: ${SITIO.direccion.calle}, ${SITIO.direccion.cp} ${SITIO.direccion.ciudad}, ${SITIO.direccion.provincia} (${SITIO.direccion.acceso})`);
  l.push(`- WhatsApp: ${SITIO.celular}`, `- Teléfono (recepción): ${SITIO.telefono}`, `- Mail: ${SITIO.mail}`, `- Coordenadas: ${SITIO.direccion.lat}, ${SITIO.direccion.lng}`);
  l.push("- Cómo consultar: por WhatsApp o mail, con cuántos son y las fechas. Las condiciones se informan por esos medios.");
  l.push("- Las tarifas no se publican: se consultan por WhatsApp o mail.", "");
  l.push("## Habitaciones", "");
  TIPOS.forEach((t) => l.push(`- ${t.nombre}: ${t.camas}. ${t.frase}`));
  l.push("", "## Servicios", "");
  SERVICIOS.forEach((s) => l.push(`- ${s.titulo}: ${s.texto}`));
  l.push("", "## Restaurante", "");
  l.push(
    `El Resto de ${SITIO.nombre} cocina desde ${SITIO.abiertoDesde} sobre el acceso de las rutas 3 y 33: parrilla, pastas y especialidades, con barra y cafetería. Para los que se alojan, para los equipos de trabajo y para los que pasan por la ruta. Más en ${urlAbs("/restaurante")}`,
    "",
  );
  l.push(`Capítulos de la carta: ${CARTA.map((c) => c.nombre).join(", ")}.`);
  l.push("", "## Historia", "");
  l.push(`- ${SITIO.fundacionACA}: se funda el Automóvil Club Argentino.`);
  l.push(`- ${SITIO.aliancaYPF}: el Plan ACA–YPF le da al club una red nacional de combustible, auxilio y alojamiento.`);
  l.push(`- ${SITIO.abiertoDesde}: abre Villa Bordeu (alojamiento y restaurante) en el cruce de rutas de Bahía Blanca.`);
  l.push(`- Más en ${urlAbs("/historia")}`);
  l.push("", "## Distancias desde el predio", "");
  DISTANCIAS_TRABAJO.forEach((d) => l.push(`- ${d.lugar}: ${d.km} km, unos ${d.min} minutos`));
  l.push("", "## Páginas", "");
  l.push(`- [Alojamiento para empresas](${urlAbs("/empresas")})`);
  RUBROS.forEach((r) => l.push(`- [${r.h1}](${urlAbs(`/empresas/${r.slug}`)}): ${r.bajada}`));
  l.push(`- [${DELEGACIONES.h1}](${urlAbs(`/${DELEGACIONES.slug}`)}): ${DELEGACIONES.bajada}`);
  l.push(`- [Habitaciones](${urlAbs("/habitaciones")})`, `- [Restaurante](${urlAbs("/restaurante")})`, `- [Instalaciones](${urlAbs("/instalaciones")})`);
  l.push(`- [Sala de reuniones](${urlAbs("/sala-de-reuniones")})`, `- [Estación de servicio](${urlAbs("/estacion-de-servicio")})`, `- [Socios ACA](${urlAbs("/socios-aca")})`);
  l.push(`- [Historia](${urlAbs("/historia")})`, `- [Preguntas frecuentes](${urlAbs("/preguntas-frecuentes")})`, `- [Contacto](${urlAbs("/contacto")})`);
  l.push(`- [Cómo llegar](${urlAbs("/como-llegar")})`);
  RUTAS.forEach((r) => l.push(`- [${r.h1}](${urlAbs(`/como-llegar/${r.slug}`)}): ${r.km} km, ${r.horas}`));
  LUGARES.forEach((x) => l.push(`- [${x.h1}](${urlAbs(`/cerca-de/${x.slug}`)}): ${x.distancia.km} km`));
  l.push("", "## Preguntas frecuentes", "");
  [...FAQ_GENERAL, ...FAQ_EMPRESAS].forEach((q) => l.push(`### ${q.p}`, "", q.r, ""));
  return new Response(l.join("\n"), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
