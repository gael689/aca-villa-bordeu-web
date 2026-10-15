import { SITIO } from "./sitio";

// Arma los mensajes de la consulta. Nunca menciona precios: el hotel responde
// por el mismo medio con todo lo que haga falta.

export type Modo = "empresa" | "viaje";

/** Datos de quien escribe: obligatorios en la reserva y en el pedido del Resto (pedido del cliente, oct/2026). */
export type Datos = { nombre: string; telefono: string; email: string };
export type CampoDato = keyof Datos;

export const esMail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());

export function erroresDatos(d: Datos): Partial<Record<CampoDato, string>> {
  const e: Partial<Record<CampoDato, string>> = {};
  if (d.nombre.trim().length < 3) e.nombre = "Escribí tu nombre y apellido.";
  if (d.telefono.replace(/\D/g, "").length < 8) e.telefono = "Falta un teléfono con característica.";
  if (!esMail(d.email)) e.email = "Falta un e-mail válido.";
  return e;
}

export const datosCompletos = (d: Datos) => Object.keys(erroresDatos(d)).length === 0;

function lineasDatos(d: Datos): string[] {
  const l = [d.nombre.trim() && `• ${d.nombre.trim()}`, d.telefono.trim() && `• Tel.: ${d.telefono.trim()}`, d.email.trim() && `• Mail: ${d.email.trim()}`].filter(
    Boolean,
  ) as string[];
  return l.length ? ["", "Mis datos:", ...l] : [];
}

export const ESTADIAS = ["Unos días", "1 o 2 semanas", "Un mes", "Más de un mes", "Todavía no sé"] as const;
export type Estadia = (typeof ESTADIAS)[number];

export const NECESIDADES = [
  "Desayuno",
  "Almuerzo o vianda",
  "Cena",
  "Lavandería",
  "Cochera para vehículos",
  "Sala de reuniones",
] as const;
export type Necesidad = (typeof NECESIDADES)[number];

export type EstadoEmpresa = {
  personas: number;
  ingreso: Date | null;
  estadia: Estadia | null;
  necesidades: Necesidad[];
  empresa: string;
  rubro: string;
} & Datos;

export type EstadoViaje = {
  entrada: Date | null;
  salida: Date | null;
  adultos: number;
  ninos: number;
  socio: boolean;
  mascota: boolean;
  adaptado: boolean;
} & Datos;

const fmtSemana = new Intl.DateTimeFormat("es-AR", { weekday: "long" });

// Armado a mano: el formato de Intl cambia según el motor (14/11 vs 14-11).
export function fechaCorta(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${fmtSemana.format(d)} ${dd}/${mm}`;
}

export function noches(e: Date | null, s: Date | null) {
  if (!e || !s) return 0;
  return Math.round((s.getTime() - e.getTime()) / 86_400_000);
}

const FIRMA = "— Consulta desde la web";
const FIRMA_PEDIDO = "— Pedido desde la web";

export function mensajeEmpresa(c: EstadoEmpresa): string {
  const l = [`Hola! Quería consultar alojamiento para un equipo de trabajo:`];
  l.push(`• ${c.personas} ${c.personas === 1 ? "persona" : "personas"}`);
  const cuando = c.ingreso ? `Desde el ${fechaCorta(c.ingreso)}` : "Fecha de ingreso a definir";
  const cuanto = c.estadia && c.estadia !== "Todavía no sé" ? `, por ${c.estadia.toLowerCase()}` : "";
  l.push(`• ${cuando}${cuanto}`);
  if (c.necesidades.length) l.push(`• Necesitamos: ${c.necesidades.join(", ").toLowerCase()}`);
  if (c.empresa) l.push(`• Empresa: ${c.empresa}`);
  if (c.rubro) l.push(`• Trabajo en: ${c.rubro}`);
  l.push(...lineasDatos(c), "", "Gracias!", FIRMA);
  return l.join("\n");
}

export function mensajeViaje(c: EstadoViaje): string {
  const l = [`Hola! Quería consultar disponibilidad en Villa Bordeu:`];
  if (c.entrada && c.salida) {
    const n = noches(c.entrada, c.salida);
    l.push(`• Entrada: ${fechaCorta(c.entrada)}`);
    l.push(`• Salida: ${fechaCorta(c.salida)} (${n} ${n === 1 ? "noche" : "noches"})`);
  } else if (c.entrada) {
    l.push(`• Entrada: ${fechaCorta(c.entrada)}`);
  } else {
    l.push("• Todavía no tengo las fechas definidas");
  }
  const quienes = [
    `${c.adultos} ${c.adultos === 1 ? "adulto" : "adultos"}`,
    c.ninos > 0 ? `${c.ninos} ${c.ninos === 1 ? "chico" : "chicos"}` : "",
  ]
    .filter(Boolean)
    .join(" y ");
  l.push(`• ${quienes}`);
  if (c.socio) l.push("• Soy socio ACA");
  if (c.mascota) l.push("• Viajo con mascota");
  if (c.adaptado) l.push("• Necesito una habitación adaptada");
  l.push(...lineasDatos(c), "", "Gracias!", FIRMA);
  return l.join("\n");
}

/** Los pasos del pedido, en el orden de una comida. */
export const CURSOS = ["Entrada", "Plato principal", "Bebida", "Postre"] as const;
export type Curso = (typeof CURSOS)[number];

export type ItemPedido = { plato: string; cantidad: number; curso: Curso };

/** Un día del pedido: almuerzo o cena, y una hora si la quieren precisar. */
export type DiaPedido = { fecha: Date; momento: "" | "Almuerzo" | "Cena"; hora: string };

export type EstadoPedido = {
  personas: number;
  dias: DiaPedido[];
  items: ItemPedido[];
  aclaraciones: string;
  empresa: string;
} & Datos;

/** Pedido armado desde la carta del Resto (p. ej. una empresa que viene a comer con su equipo). */
export function mensajePedido(c: EstadoPedido): string {
  const l = [`Hola! Quería hacer un pedido en el Resto:`];
  l.push(`• ${c.personas} ${c.personas === 1 ? "persona" : "personas"}`);
  const cuando = (d: DiaPedido) => [d.momento.toLowerCase(), d.hora && `a las ${d.hora} h`].filter(Boolean).join(", ");
  if (c.dias.length === 1) {
    const d = c.dias[0];
    l.push(`• El ${fechaCorta(d.fecha)}${cuando(d) ? `, ${cuando(d)}` : ""}`);
  } else if (c.dias.length > 1) {
    l.push(`• ${c.dias.length} días (el mismo pedido cada día):`);
    for (const d of c.dias) l.push(`   – ${fechaCorta(d.fecha)}${cuando(d) ? `: ${cuando(d)}` : ""}`);
  } else {
    l.push("• Día a definir");
  }
  if (c.empresa) l.push(`• Empresa: ${c.empresa}`);
  const titulos: Record<Curso, string> = { Entrada: "Entradas", "Plato principal": "Platos principales", Bebida: "Bebidas", Postre: "Postres" };
  for (const curso of CURSOS) {
    const del = c.items.filter((i) => i.curso === curso);
    if (!del.length) continue;
    l.push("", `${titulos[curso]}:`);
    for (const i of del) l.push(`• ${i.cantidad} × ${i.plato}`);
  }
  if (c.aclaraciones.trim()) l.push("", `Aclaraciones: ${c.aclaraciones.trim()}`);
  l.push(...lineasDatos(c), "", "Gracias!", FIRMA_PEDIDO);
  return l.join("\n");
}

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${SITIO.whatsapp}?text=${encodeURIComponent(texto)}`;
}

/** Mensaje genérico para los enlaces que funcionan sin JavaScript. */
export function linkGenerico(contexto?: string) {
  const t = contexto
    ? `Hola! Les escribo desde la web de Villa Bordeu por ${contexto}.\n${FIRMA}`
    : `Hola! Les escribo desde la web de Villa Bordeu.\n${FIRMA}`;
  return linkWhatsApp(t);
}

export const MENSAJE_MESA = `Hola! Quería reservar una mesa en el Resto.\n${FIRMA}`;
