import type { Distancia, Pregunta } from "./tipos";

// Página /delegaciones-deportivas (20/10/2026). Rodrigo trabaja con muchas delegaciones y quiere
// sumar más; la búsqueda que se confirma en Google es «alojamiento para delegaciones deportivas».
// Distancias: OSRM desde el predio (-38.7006, -62.3330), sin tránsito, redondeadas hacia arriba al km
// y a 5 minutos (estadio, club, parque y terminal medidos el 20/10/2026 con OpenStreetMap).
// Sin capacidad de grupos, sin precios y sin nombrar clubes como clientes.

export const DELEGACIONES = {
  slug: "delegaciones-deportivas",
  nombre: "Delegaciones deportivas",
  title: "Alojamiento para delegaciones deportivas · ACA Villa Bordeu",
  description:
    "Alojamiento para delegaciones y equipos en Bahía Blanca: desayuno incluido, restaurante, lavandería y recepción 24 h, a 8 km del centro. Consultá por WhatsApp.",
  h1: "Alojamiento para delegaciones deportivas en Bahía Blanca",
  bajada: "Para clubes y equipos que vienen a jugar: entran por la ruta y tienen todo en el mismo predio.",
  citable:
    "ACA Villa Bordeu, el alojamiento del Automóvil Club Argentino en Bahía Blanca, recibe delegaciones deportivas sobre el cruce de las rutas nacionales 3, 33 y 35, a 8 km del centro. Tiene habitaciones single, doble y triple con desayuno incluido, restaurante, lavandería, sala de reuniones, gimnasio y recepción las 24 horas en el mismo predio.",
  distancias: [
    { lugar: "Centro de Bahía Blanca", km: 8, min: 15 },
    { lugar: "Parque de Mayo", km: 9, min: 15 },
    { lugar: "Estadio Roberto Carminatti", km: 10, min: 15 },
    { lugar: "Club Villa Mitre", km: 11, min: 20 },
    { lugar: "Terminal de ómnibus", km: 11, min: 20 },
    { lugar: "Aeropuerto Comandante Espora", km: 23, min: 35 },
  ] satisfies Distancia[],
  oficina:
    "El cuerpo técnico tiene dónde armar la lista de buena fe, repasar el video del rival o coordinar los horarios con la organización del torneo, sin ocupar la habitación de los jugadores.",
  necesidades: [
    {
      titulo: "Llegar desde la ruta",
      texto:
        "El predio está sobre el cruce de las rutas 3, 33 y 35. La delegación que viene en micro o en combi se baja de la ruta y ya llegó, sin cruzar la ciudad.",
    },
    {
      titulo: "Todos comen juntos",
      texto:
        "El desayuno está incluido y el restaurante está en el mismo predio. Para el almuerzo y la cena, el pedido del equipo se arma desde la web con los días y los horarios de los partidos.",
    },
    {
      titulo: "La ropa del partido",
      texto:
        "Hay lavandería en el predio. Las camisetas y la ropa de entrenamiento se resuelven acá, entre partido y partido.",
    },
    {
      titulo: "La charla técnica",
      texto:
        "La sala de reuniones sirve para la charla antes del partido o para ver el video del rival, y el gimnasio para la activación de la mañana.",
    },
  ],
  preguntas: [
    {
      p: "¿El desayuno está incluido?",
      r: "Sí. El desayuno y la cochera están incluidos en la tarifa. Para el almuerzo y la cena, el restaurante está en el mismo predio.",
    },
    {
      p: "¿Cuánto se tarda hasta los estadios?",
      r: "El centro de Bahía Blanca queda a 8 km, unos 15 minutos. El estadio Roberto Carminatti queda a 10 km y el club Villa Mitre a 11 km, medidos sin tránsito.",
    },
    {
      p: "¿Puede comer toda la delegación en el restaurante?",
      r: "Sí. Armá el pedido del equipo desde la página del restaurante: cuántos son, qué van a comer y para qué días y horarios. Te respondemos por WhatsApp o mail.",
    },
    {
      p: "Si volvemos tarde del partido, ¿hay alguien en recepción?",
      r: "Sí, la recepción está abierta las 24 horas. La delegación puede llegar o volver a cualquier hora.",
    },
    {
      p: "¿Cómo consultamos por la delegación?",
      r: "Por WhatsApp o por mail, con cuántos son, las fechas y el torneo. Te respondemos con todo lo que necesitás saber.",
    },
  ] satisfies Pregunta[],
  foto: "habitaciones/01-triple-dos-camas.jpg",
  fotoAlt: "Habitación triple con dos camas y cabecera de madera",
};
