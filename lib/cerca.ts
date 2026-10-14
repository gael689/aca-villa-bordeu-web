import type { LugarCerca } from "./tipos";

// Páginas /cerca-de/<slug>. Distancias: OSRM desde el predio (-38.7006, -62.3330), sin tránsito,
// redondeadas hacia arriba al km y a 5 minutos. Polo, Cerri y aeropuerto: relevamiento/mercado.md §4.
// Puerto Galván y el acceso a la Sociedad Rural: medidos igual el 08/10/2026 (OSM/Nominatim + OSRM).

export const LUGARES: LugarCerca[] = [
  {
    slug: "polo-petroquimico",
    nombre: "Polo Petroquímico",
    title: "Hotel cerca del Polo Petroquímico | ACA Villa Bordeu",
    description:
      "A 12 km de Ingeniero White y de Puerto Galván, unos 20 minutos. Habitaciones con cochera cubierta, restaurante y recepción 24 h en Bahía Blanca. Consultá.",
    h1: "Hotel cerca del Polo Petroquímico de Bahía Blanca",
    bajada: "Ingeniero White y Puerto Galván, a unos 20 minutos de Villa Bordeu.",
    citable:
      "ACA Villa Bordeu, el alojamiento del Automóvil Club Argentino en Bahía Blanca, queda a 12 km del Polo Petroquímico de Ingeniero White, unos 20 minutos en auto. Puerto Galván está a la misma distancia. Tiene 26 habitaciones con cochera cubierta frente a cada una, restaurante y recepción las 24 horas.",
    distancia: { lugar: "Polo Petroquímico (Ingeniero White)", km: 12, min: 20 },
    textos: [
      "El Polo Petroquímico está en Ingeniero White, sobre la ría, al sur de Bahía Blanca. ACA Villa Bordeu está en el acceso suroeste de la ciudad: son 12 km, unos 20 minutos medidos sin tránsito.",
      "Puerto Galván queda a 12 km, también unos 20 minutos. Para trabajos en Puerto Rosales, del lado de Punta Alta, la distancia sube a 43 km.",
      "Para una cuadrilla, lo que pesa es la logística de todos los días: salir a la misma hora, cargar combustible y volver a un lugar donde se come sin tener que salir otra vez.",
      "Al volver del turno, la camioneta queda bajo techo frente a la habitación. En el mismo predio están el Resto, la lavandería, el gimnasio y la estación YPF.",
    ],
    paraQuien: [
      "Contratistas que mandan cuadrillas a una parada de planta",
      "Técnicos e inspectores que vienen por unos días",
      "Equipos de montaje que se quedan varias semanas",
      "Personal de puerto en Ingeniero White y Puerto Galván",
    ],
    preguntas: [
      {
        p: "¿Qué hotel queda cerca del Polo Petroquímico?",
        r: "ACA Villa Bordeu está a 12 km de Ingeniero White, unos 20 minutos en auto. Tiene 26 habitaciones con cochera cubierta frente a cada una.",
      },
      {
        p: "¿Y Puerto Galván?",
        r: "Queda a 12 km de Villa Bordeu, unos 20 minutos, igual que Ingeniero White.",
      },
      {
        p: "¿Pueden alojarse cuadrillas enteras?",
        r: "Son 26 habitaciones single, doble y triple. Escribinos por WhatsApp o mail con cuántos son y las fechas, y te pasamos todo.",
      },
      {
        p: "¿Hay lugar para dejar las camionetas?",
        r: "Sí. Cada habitación tiene su cochera cubierta enfrente.",
      },
    ],
    rubro: "petroquimica-y-puerto",
  },
  {
    slug: "general-cerri",
    nombre: "General Daniel Cerri",
    title: "Hotel cerca de General Cerri | ACA Villa Bordeu",
    description:
      "A 7 km de General Daniel Cerri, unos 10 minutos por la RN 3. Habitaciones con cochera, restaurante y estación YPF en el acceso de Bahía Blanca. Escribinos.",
    h1: "Hotel cerca de General Cerri",
    bajada: "Cerri queda a 7 km por la RN 3, unos 10 minutos.",
    citable:
      "ACA Villa Bordeu, el alojamiento del Automóvil Club Argentino en Bahía Blanca, queda a 7 km de General Daniel Cerri, unos 10 minutos por la Ruta Nacional 3. Tiene 26 habitaciones con cochera cubierta frente a cada una, restaurante y estación de servicio YPF.",
    distancia: { lugar: "General Daniel Cerri", km: 7, min: 10 },
    textos: [
      "General Daniel Cerri es una localidad del partido de Bahía Blanca, al suroeste de la ciudad, sobre la RN 3. Villa Bordeu está en el mismo lado de la ciudad: entre uno y otro hay 7 km de ruta.",
      "En Cerri funciona una planta que separa los líquidos del gas natural y los manda por ducto a Puerto Galván. Las obras y el mantenimiento de una instalación así suelen sumar técnicos y contratistas de afuera.",
      "Si buscás dónde dormir en Cerri, casi no aparece hotelería propia: los buscadores muestran hoteles del centro de Bahía Blanca. Desde Villa Bordeu, Cerri queda más cerca que el centro.",
    ],
    paraQuien: [
      "Equipos que trabajan en la industria del gas de Cerri",
      "Familias que visitan a alguien en Cerri y quieren dormir cerca",
      "Viajeros que vienen del sur por la RN 3 y no quieren entrar a la ciudad",
    ],
    preguntas: [
      {
        p: "¿Hay hoteles en General Cerri?",
        r: "En los buscadores casi no aparece hotelería propia en Cerri. ACA Villa Bordeu queda a 7 km, unos 10 minutos por la RN 3.",
      },
      {
        p: "¿Cómo se va de Villa Bordeu a Cerri?",
        r: "Por la RN 3 hacia el sur. Son 7 km y no se pasa por la ciudad.",
      },
      {
        p: "¿Puedo reservar para un trabajo de pocos días en Cerri?",
        r: "Sí. Escribinos por WhatsApp o mail con cuántos son y las fechas, y te pasamos todo.",
      },
    ],
    rubro: "energia",
  },
  {
    slug: "aeropuerto",
    nombre: "Aeropuerto Comandante Espora",
    title: "Hotel cerca del aeropuerto Espora | ACA Villa Bordeu",
    description:
      "A 23 km del aeropuerto Comandante Espora, unos 35 minutos. Recepción 24 h para llegar en el último vuelo y cochera cubierta si alquilás auto. Consultá ya.",
    h1: "Alojamiento cerca del aeropuerto de Bahía Blanca",
    bajada: "Del aeropuerto Comandante Espora a Villa Bordeu, unos 35 minutos.",
    citable:
      "ACA Villa Bordeu, el alojamiento del Automóvil Club Argentino en Bahía Blanca, queda a 23 km del aeropuerto Comandante Espora, unos 35 minutos en auto. Tiene recepción las 24 horas, 26 habitaciones con cochera cubierta y restaurante en el mismo predio.",
    distancia: { lugar: "Aeropuerto Comandante Espora", km: 23, min: 35 },
    textos: [
      "El aeropuerto Comandante Espora está al este de Bahía Blanca. Villa Bordeu está en el extremo opuesto, en el suroeste, sobre el cruce de las rutas: son 23 km, unos 35 minutos medidos sin tránsito.",
      "La distancia es mayor que desde un hotel del centro, pero tiene una ventaja si venís a trabajar al Polo, a Cerri o sobre las rutas: dormís del lado donde vas a trabajar y no cruzás la ciudad cada mañana.",
      "Si llegás en el último vuelo, la recepción está abierta las 24 horas. Si alquilás auto en el aeropuerto, lo dejás bajo techo frente a la habitación.",
    ],
    paraQuien: [
      "Equipos que rotan y llegan en avión",
      "Técnicos que vienen por pocos días al Polo o al puerto",
      "Viajeros que llegan en avión y siguen en auto hacia el sur",
    ],
    preguntas: [
      {
        p: "¿A cuánto queda el aeropuerto de Bahía Blanca?",
        r: "A 23 km de Villa Bordeu, unos 35 minutos en auto sin tránsito.",
      },
      {
        p: "¿Puedo llegar en un vuelo de noche?",
        r: "Sí, la recepción está abierta las 24 horas. Avisanos la hora aproximada cuando consultes.",
      },
      {
        p: "¿Tienen traslado desde el aeropuerto?",
        r: "Preguntanos por WhatsApp con la fecha y el vuelo, y te contamos cómo hacer.",
      },
      {
        p: "Alquilo auto en el aeropuerto: ¿dónde lo dejo?",
        r: "En la cochera cubierta que tiene cada habitación enfrente.",
      },
    ],
    rubro: "energia",
  },
  {
    slug: "la-rural",
    nombre: "Sociedad Rural de Bahía Blanca",
    title: "Hotel al lado de la Rural de Bahía Blanca | ACA Villa Bordeu",
    description:
      "Pegado al predio de la Sociedad Rural de Bahía Blanca, en Villa Bordeu. Para la exposición: habitaciones con cochera, restaurante y estación YPF. Escribinos.",
    h1: "Hotel al lado de la Sociedad Rural de Bahía Blanca",
    bajada: "El predio de la exposición está pegado a ACA Villa Bordeu.",
    citable:
      "ACA Villa Bordeu, el alojamiento del Automóvil Club Argentino en Bahía Blanca, está pegado al predio de la Sociedad Rural de Bahía Blanca, en Villa Bordeu, donde se hace la exposición rural anual. El acceso al predio queda a 1 km del alojamiento, sobre el Camino Parque Sesquicentenario.",
    distancia: {
      lugar: "Acceso a la Sociedad Rural",
      km: 1,
      min: 5,
      nota: "Sobre el mismo Camino Parque Sesquicentenario.",
    },
    textos: [
      "Villa Bordeu es el paraje donde la Sociedad Rural de Bahía Blanca tiene su predio y hace la exposición anual, con cabañas de toda la región. El alojamiento está al lado: de la habitación al acceso de la Rural hay 1 km.",
      "Durante la exposición llegan expositores, cabañeros, compradores y familias que vienen del campo. Dormir acá significa ir y volver de la muestra sin cruzar Bahía Blanca, con la camioneta bajo techo y la cena en el Resto.",
      "Las rutas 33 y 35, las que vienen de la zona agrícola, llegan a este mismo cruce. Si viajás con tu perro, se aceptan mascotas.",
    ],
    paraQuien: [
      "Expositores y cabañeros que vienen a la muestra",
      "Productores y compradores que viajan desde el interior",
      "Familias que vienen a la exposición con los chicos",
    ],
    preguntas: [
      {
        p: "¿Qué hotel queda más cerca de la Rural de Bahía Blanca?",
        r: "ACA Villa Bordeu está pegado al predio de la Sociedad Rural: el acceso queda a 1 km sobre el Camino Parque Sesquicentenario.",
      },
      {
        p: "¿Cuándo es la exposición?",
        r: "La organiza la Sociedad Rural de Bahía Blanca y cambia de fecha cada año. Confirmala con ellos y escribinos apenas la tengas.",
      },
      {
        p: "¿Conviene consultar con tiempo?",
        r: "Sí. Escribinos por WhatsApp o mail con cuántos son y las fechas, y te pasamos todo.",
      },
      {
        p: "¿Hay juegos para los chicos?",
        r: "Sí, hay juegos para chicos dentro del predio.",
      },
    ],
    rubro: "agro",
  },
];
