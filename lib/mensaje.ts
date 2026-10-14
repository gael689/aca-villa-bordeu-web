import { SITIO } from "./sitio";

// Arma los mensajes de la consulta. Nunca menciona precios: el hotel responde
// por el mismo medio con todo lo que haga falta.

export type Modo = "empresa" | "viaje";

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
  nombre: string;
  rubro: string;
};

export type EstadoViaje = {
  entrada: Date | null;
  salida: Date | null;
  adultos: number;
  ninos: number;
  socio: boolean;
  mascota: boolean;
  adaptado: boolean;
  nombre: string;
};

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

export function mensajeEmpresa(c: EstadoEmpresa): string {
  const l = [`Hola! Quería consultar alojamiento para un equipo de trabajo:`];
  l.push(`• ${c.personas} ${c.personas === 1 ? "persona" : "personas"}`);
  const cuando = c.ingreso ? `Desde el ${fechaCorta(c.ingreso)}` : "Fecha de ingreso a definir";
  const cuanto = c.estadia && c.estadia !== "Todavía no sé" ? `, por ${c.estadia.toLowerCase()}` : "";
  l.push(`• ${cuando}${cuanto}`);
  if (c.necesidades.length) l.push(`• Necesitamos: ${c.necesidades.join(", ").toLowerCase()}`);
  const quien = [c.empresa && `Empresa: ${c.empresa}`, c.nombre && `(${c.nombre})`].filter(Boolean).join(" ");
  if (quien) l.push(`• ${quien}`);
  if (c.rubro) l.push(`• Trabajo en: ${c.rubro}`);
  l.push("Gracias!", FIRMA);
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
  if (c.nombre) l.push(`• Mi nombre: ${c.nombre}`);
  l.push("Gracias!", FIRMA);
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
