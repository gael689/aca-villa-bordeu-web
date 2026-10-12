import type { Distancia } from "./tipos";
import type { IconoNombre } from "@/components/marca/Icono";

// Datos del predio que usan varias páginas. Sin precios ni condiciones:
// todo eso lo maneja el hotel por WhatsApp o mail.

/** Tablero «A cuánto estás». OSRM sin tránsito, redondeado hacia arriba (relevamiento/mercado.md §4). */
export const DISTANCIAS_TRABAJO: Distancia[] = [
  { lugar: "Polo Petroquímico", km: 12, min: 20, nota: "e Ingeniero White" },
  { lugar: "General Cerri", km: 7, min: 10 },
  { lugar: "Centro de Bahía Blanca", km: 8, min: 15 },
  { lugar: "Aeropuerto", km: 23, min: 35, nota: "Comandante Espora" },
  { lugar: "Terminal de ómnibus", km: 11, min: 20 },
  { lugar: "Punta Alta", km: 38, min: 45 },
];

/** Ubicación de la versión 2 (mismos datos medidos; Puerto Galván medido igual el 08/10/2026). */
export const DISTANCIAS_V2: Distancia[] = [
  { lugar: "General Cerri", km: 7, min: 10 },
  { lugar: "Centro de Bahía Blanca", km: 8, min: 15 },
  { lugar: "Terminal de ómnibus", km: 11, min: 20 },
  { lugar: "Polo Petroquímico", km: 12, min: 20 },
  { lugar: "Puerto de Bahía Blanca", km: 12, min: 20, nota: "Galván e Ingeniero White" },
  { lugar: "Aeropuerto", km: 23, min: 35, nota: "Comandante Espora" },
  { lugar: "Punta Alta", km: 38, min: 45 },
];

export const DISTANCIAS_ZONA: Distancia[] = [
  { lugar: "Médanos", km: 39, min: 35 },
  { lugar: "Tornquist", km: 74, min: 60 },
  { lugar: "Monte Hermoso", km: 114, min: 105 },
  { lugar: "Sierra de la Ventana", km: 116, min: 95 },
  { lugar: "Pigüé", km: 133, min: 100 },
  { lugar: "Río Colorado", km: 163, min: 125 },
  { lugar: "Carhué", km: 194, min: 145 },
  { lugar: "Viedma", km: 270, min: 220 },
];

export type Servicio = { icono: IconoNombre; titulo: string; texto: string };

export const SERVICIOS: Servicio[] = [
  { icono: "auto", titulo: "Cochera en la puerta", texto: "Cubierta, frente a cada departamento." },
  { icono: "campana", titulo: "Recepción 24 h", texto: "Llegás a la hora que llegues." },
  { icono: "cubiertos", titulo: "Restaurante", texto: "El Resto cocina desde 1984." },
  { icono: "taza", titulo: "Desayuno", texto: "También sin TACC." },
  { icono: "lavarropas", titulo: "Lavandería", texto: "Para la ropa de todos los días y la de trabajo." },
  { icono: "pesa", titulo: "Gimnasio", texto: "Para cerrar el día moviendo el cuerpo." },
  { icono: "reunion", titulo: "Sala de reuniones", texto: "Con mesa grande y pantalla." },
  { icono: "reunion", titulo: "Oficina de cortesía", texto: "Un escritorio privado para trabajar tranquilo." },
  { icono: "surtidor", titulo: "Estación YPF", texto: "Cargás sin salir del predio." },
  { icono: "pata", titulo: "Pet friendly", texto: "Tu mascota también viaja." },
  { icono: "wifi", titulo: "Wi-Fi", texto: "En los departamentos y en el Resto." },
  { icono: "accesible", titulo: "Departamento adaptado", texto: "Pensado para moverse sin barreras." },
  { icono: "hamaca", titulo: "Juegos para chicos", texto: "Al aire libre, en el parque." },
];

/** Puntos del plano del predio, en % sobre la foto aérea de día (predio/aerea-dia.jpg). [confirmar ubicación exacta en el lugar] */
export type PuntoPredio = {
  id: string;
  titulo: string;
  texto: string;
  icono: IconoNombre;
  x: number;
  y: number;
  /** null = sin foto todavía: la ficha muestra el ícono */
  foto: [string, string] | null;
  href?: string;
};

export const PREDIO: PuntoPredio[] = [
  { id: "deptos", titulo: "Departamentos", texto: "Los 26, en planta baja, cada uno con su cochera cubierta enfrente.", icono: "cama", x: 62, y: 39, foto: ["habitaciones", "01-triple-dos-camas.jpg"], href: "/departamentos" },
  { id: "cocheras", titulo: "Cocheras cubiertas", texto: "La camioneta queda en la puerta, a la vista.", icono: "auto", x: 73, y: 46, foto: ["predio", "01-exterior-atardecer.jpg"] },
  { id: "resto", titulo: "Restaurante y bar", texto: "El Resto, la cava y la barra, abiertos también para quien pasa.", icono: "cubiertos", x: 42, y: 53, foto: ["restaurante", "01-salon-noche.jpg"], href: "/restaurante" },
  { id: "recepcion", titulo: "Recepción 24 h", texto: "Atención las 24 horas, para el que llega de noche por la ruta.", icono: "campana", x: 27, y: 40, foto: ["cafeteria", "01-recepcion-cafeteria.jpg"] },
  { id: "gym", titulo: "Gimnasio", texto: "Máquinas, bicis y pesas, con ventanales al parque.", icono: "pesa", x: 57, y: 56, foto: ["gimnasio", "01-gym-pared-verde.jpg"] },
  { id: "sala", titulo: "Sala de reuniones", texto: "Mesa para el equipo y pantalla para presentar.", icono: "reunion", x: 50, y: 46, foto: ["sala-reuniones", "01-mesa.jpg"], href: "/sala-de-reuniones" },
  { id: "ypf", titulo: "Estación YPF", texto: "Combustible para seguir viaje o para la flota del equipo.", icono: "surtidor", x: 15, y: 41, foto: ["ypf", "01-surtidores-atardecer.jpg"], href: "/estacion-de-servicio" },
  { id: "oficina", titulo: "Oficina de cortesía", texto: "Un escritorio privado y tranquilo, para trabajar o atender una llamada.", icono: "reunion", x: 30, y: 44, foto: ["oficina-cortesia", "01-oficina.jpg"] },
  { id: "lavanderia", titulo: "Lavandería", texto: "Para la ropa de todos los días y la de trabajo.", icono: "lavarropas", x: 68, y: 57, foto: null },
];
