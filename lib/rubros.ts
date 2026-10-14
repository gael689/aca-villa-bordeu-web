import type { Rubro } from "./tipos";

// Páginas /empresas/<slug>. Distancias: OSRM desde el predio (-38.7006, -62.3330), sin tránsito,
// redondeadas hacia arriba al km y a 5 minutos (relevamiento/mercado.md §4; Puerto Galván medido igual el 08/10/2026).
// Sin nombrar empresas como clientes: el contexto es un dato público con su fuente.

export const RUBROS: Rubro[] = [
  {
    slug: "petroquimica-y-puerto",
    nombre: "Petroquímica y puerto",
    title: "Alojamiento para personal del Polo Petroquímico | ACA",
    description:
      "Habitaciones con cochera cubierta a 12 km de Ingeniero White, con restaurante, lavandería y recepción 24 h. Contanos cuántos son y te respondemos por WhatsApp.",
    h1: "Alojamiento para personal del Polo Petroquímico",
    bajada: "A 12 km de Ingeniero White, con la camioneta bajo techo frente a cada habitación.",
    citable:
      "ACA Villa Bordeu es el alojamiento del Automóvil Club Argentino en Bahía Blanca, a 12 km del Polo Petroquímico de Ingeniero White y de Puerto Galván. Tiene 26 habitaciones con cochera cubierta en la puerta, restaurante, lavandería y recepción las 24 horas. Las empresas consultan por WhatsApp o por mail.",
    distancias: [
      { lugar: "Polo Petroquímico (Ingeniero White)", km: 12, min: 20 },
      { lugar: "Puerto Galván", km: 12, min: 20 },
      { lugar: "General Daniel Cerri", km: 7, min: 10 },
      { lugar: "Puerto Rosales (Punta Alta)", km: 43, min: 55 },
      { lugar: "Centro de Bahía Blanca", km: 8, min: 15, nota: "Por si hay que hacer trámites o compras." },
    ],
    oficina:
      "El que coordina la parada tiene dónde repasar el cronograma, completar los permisos de trabajo o hacer la llamada con planta, sin ocupar la habitación ni la mesa del Resto.",
    necesidades: [
      {
        titulo: "Turnos que arrancan temprano",
        texto:
          "La recepción está abierta las 24 horas. El que sale de madrugada no depende de que abra nadie, y el que vuelve tarde del turno encuentra a alguien en el mostrador.",
      },
      {
        titulo: "Paradas de planta",
        texto:
          "Una parada junta mucha gente durante pocos días. Con 26 habitaciones en el mismo predio, el equipo duerme cerca y a la mañana se organiza en la cochera antes de salir.",
      },
      {
        titulo: "La ropa de trabajo",
        texto:
          "Hay lavandería en el predio. La ropa de la semana se resuelve acá y nadie tiene que buscar dónde lavar en la ciudad.",
      },
      {
        titulo: "La camioneta, a la vista",
        texto:
          "Cada habitación tiene su cochera cubierta enfrente. Las herramientas quedan bajo techo a pocos pasos, y la estación YPF del predio sirve para cargar antes de ir a planta.",
      },
    ],
    contexto: {
      texto:
        "La nueva planta de urea anunciada para Bahía Blanca prevé más de 3.500 puestos directos en el pico de obra, durante 41 meses.",
      fuente: "La Capital (Mar del Plata)",
      url: "https://www.lacapitalmdp.com/pampa-energia-invertira-us-2-700-millones-en-una-planta-de-fertilizantes-en-bahia-blanca/",
    },
    preguntas: [
      {
        p: "¿Cuánto se tarda hasta el Polo Petroquímico?",
        r: "Unos 20 minutos hasta Ingeniero White: son 12 km, medidos sin tránsito. Puerto Galván queda a la misma distancia.",
      },
      {
        p: "¿Sirve para una parada de planta de pocos días?",
        r: "Sí. Escribinos por WhatsApp o mail con cuántos son y las fechas de la parada, y te pasamos todo.",
      },
      {
        p: "Si el turno empieza muy temprano, ¿el equipo puede desayunar?",
        r: "Contanos a qué hora sale la gente cuando consultes. Lo charlamos por WhatsApp y vemos cómo dejar resuelto el desayuno.",
      },
      {
        p: "¿Dónde lava el equipo la ropa de trabajo?",
        r: "En la lavandería del predio. Al consultar, contanos cuántos son y por cuánto tiempo, y te explicamos cómo funciona.",
      },
      {
        p: "¿Queda cerca de Puerto Rosales?",
        r: "Puerto Rosales, en Punta Alta, queda a 43 km: unos 55 minutos. Para el Polo y Puerto Galván, en cambio, son 12 km.",
      },
    ],
    foto: "habitaciones/02-doble-escritorio.jpg",
    cerca: "polo-petroquimico",
  },
  {
    slug: "energia",
    nombre: "Energía",
    title: "Alojamiento para obras de energía | Bahía Blanca",
    description:
      "Base para equipos de gas, ductos y parques eólicos: 26 habitaciones con cochera en el cruce de las rutas 3, 33 y 35, con estación YPF. Consultá por WhatsApp.",
    h1: "Alojamiento para equipos de energía en Bahía Blanca",
    bajada: "Para obras de gas, ductos y parques eólicos: salís a la ruta que toque desde el mismo cruce.",
    citable:
      "ACA Villa Bordeu, el alojamiento del Automóvil Club Argentino en Bahía Blanca, está en el suroeste de la ciudad, donde se cruzan las rutas nacionales 3, 33 y 35, cerca del empalme con la RN 22. Queda a 7 km de General Cerri y a 12 km de Puerto Galván. Tiene 26 habitaciones con cochera cubierta y estación de servicio YPF en el predio.",
    distancias: [
      { lugar: "General Daniel Cerri", km: 7, min: 10 },
      { lugar: "Puerto Galván", km: 12, min: 20 },
      { lugar: "Médanos (RN 22)", km: 39, min: 35 },
      { lugar: "Tornquist (RN 33)", km: 74, min: 60, nota: "Zona de parques eólicos." },
      { lugar: "Río Colorado (RN 22)", km: 163, min: 125 },
    ],
    oficina:
      "Para el jefe de obra que coordina relevos y avances: un escritorio privado para cerrar el parte del día, revisar la traza o atender la llamada con la oficina central.",
    necesidades: [
      {
        titulo: "Obras que avanzan sobre la traza",
        texto:
          "Un ducto se trabaja por tramos. Desde acá se sale directo a la RN 22 hacia Médanos y Río Colorado, o a la RN 3 hacia el sur, sin cruzar la ciudad.",
      },
      {
        titulo: "Parques eólicos de la zona",
        texto:
          "La zona tiene parques y proyectos eólicos en Bahía Blanca, Tornquist, Coronel Rosales y Villarino. Tornquist está a 74 km por la RN 33, que sale del mismo cruce donde está Villa Bordeu.",
      },
      {
        titulo: "Rotaciones y relevos",
        texto:
          "En energía la gente entra y sale en días distintos. Con recepción las 24 horas cada uno llega cuando puede, y vos manejás todo el equipo con un solo contacto.",
      },
      {
        titulo: "Combustible en la puerta",
        texto:
          "La estación YPF está dentro del predio. Las camionetas cargan a la salida, antes de tomar la ruta.",
      },
    ],
    contexto: {
      texto:
        "El proyecto de líquidos del gas de TGS prevé un poliducto de 577 km entre Tratayén (Neuquén) y Bahía Blanca, con planta de fraccionamiento y una terminal en Puerto Galván.",
      fuente: "iProfesional",
      url: "https://www.iprofesional.com/energia/457097-la-megaobra-us3000-millones-que-creara-19000-empleos-en-vaca-muerta",
    },
    preguntas: [
      {
        p: "¿Sirve como base para una obra sobre la RN 22?",
        r: "Sí. La RN 22 arranca en la RN 3, al sur de Bahía Blanca, y desde Villa Bordeu se llega sin entrar a la ciudad. Médanos queda a 39 km y Río Colorado a 163 km.",
      },
      {
        p: "¿A cuánto quedan los parques eólicos?",
        r: "Depende del parque. Tornquist, por ejemplo, está a 74 km por la RN 33: alrededor de una hora. Contanos dónde trabajan y te decimos cuánto tienen de viaje.",
      },
      {
        p: "Mi equipo rota: ¿pueden llegar en días distintos?",
        r: "Sí. La recepción está abierta las 24 horas. Escribinos con cuántos son y cómo rotan, y lo organizamos por WhatsApp o mail.",
      },
      {
        p: "¿Podemos usar la sala para una inducción de seguridad?",
        r: "Hay una sala de reuniones con TV y una mesa para unas diez personas. Pedila al consultar y te confirmamos.",
      },
    ],
    foto: "sala-reuniones/01-mesa.jpg",
    cerca: "general-cerri",
  },
  {
    slug: "obra-vial-y-transporte",
    nombre: "Obra vial y transporte",
    title: "Alojamiento para obra vial y choferes | Bahía Blanca",
    description:
      "Sobre el cruce de las rutas 3, 33 y 35: habitaciones con cochera, restaurante, recepción 24 h y estación YPF en el mismo predio. Escribinos con cuántos son.",
    h1: "Alojamiento para obra vial y transporte en Bahía Blanca",
    bajada: "Estás en el cruce: cada mañana salís a la ruta que te toca.",
    citable:
      "ACA Villa Bordeu es el alojamiento del Automóvil Club Argentino sobre el acceso de las rutas nacionales 3 y 33, en el suroeste de Bahía Blanca, la zona donde Vialidad Nacional ubica la confluencia de las rutas 3, 33, 22, 35 y 252. Tiene 26 habitaciones con cochera cubierta, restaurante, recepción 24 horas y estación YPF.",
    distancias: [
      { lugar: "Médanos (RN 22)", km: 39, min: 35 },
      { lugar: "Tornquist (RN 33)", km: 74, min: 60 },
      { lugar: "Coronel Dorrego (RN 3 norte)", km: 102, min: 90 },
      { lugar: "Pedro Luro (RN 3 sur)", km: 113, min: 90 },
      { lugar: "Puerto de Ingeniero White", km: 12, min: 20 },
    ],
    oficina:
      "Para revisar planos, cargar el parte diario o armar la logística de la semana con tranquilidad, a pasos de la cochera donde quedan los vehículos.",
    necesidades: [
      {
        titulo: "Un frente de obra que se mueve",
        texto:
          "La obra vial avanza kilómetro a kilómetro. Con la base en el cruce, el equipo sale por la RN 3, la 33, la 35 o la 22 sin atravesar Bahía Blanca.",
      },
      {
        titulo: "Choferes que llegan a cualquier hora",
        texto:
          "La recepción está abierta las 24 horas. El chofer llega, cena en el Resto, duerme con el vehículo enfrente y a la mañana carga en la YPF del predio.",
      },
      {
        titulo: "Dónde dejar los vehículos",
        texto:
          "Cada habitación tiene cochera cubierta enfrente. Si vienen con camiones o equipos grandes, contanos qué traen cuando consultes y vemos cómo acomodarlos.",
      },
      {
        titulo: "Comer bien después de la jornada",
        texto:
          "El Resto cocina desde 1984: parrilla, pastas y platos caseros. Si alguien vuelve muy cansado, hay room service.",
      },
    ],
    contexto: {
      texto:
        "Vialidad Nacional describe el suroeste de Bahía Blanca como el punto donde confluyen las rutas nacionales más importantes del sur bonaerense: la 3, la 33, la 22, la 35 y la 252.",
      fuente: "Vialidad Nacional (argentina.gob.ar)",
      url: "https://www.argentina.gob.ar/noticias/autopista-paso-urbano-vialidad-nacional-continua-con-los-trabajos-en-los-accesos-bahia",
    },
    preguntas: [
      {
        p: "¿Pueden entrar camiones al predio?",
        r: "Contanos qué vehículos traen y cuántos son cuando nos escribas por WhatsApp o mail, y te confirmamos cómo los acomodamos.",
      },
      {
        p: "¿Un chofer puede parar una sola noche?",
        r: "Sí. Escribinos con la fecha y te respondemos. Si llega tarde, la recepción está abierta las 24 horas.",
      },
      {
        p: "¿Desde Villa Bordeu se sale directo a las rutas?",
        r: "Sí. Villa Bordeu está sobre el acceso de la RN 3 y 33, y la RN 35 empieza en ese mismo cruce. La RN 22 sale de la RN 3 hacia el sur, sin pasar por la ciudad.",
      },
      {
        p: "¿Dónde cargan combustible?",
        r: "En la estación de servicio YPF que está dentro del predio, a metros de las habitaciones.",
      },
    ],
    foto: "cafeteria/01-recepcion-cafeteria.jpg",
  },
  {
    slug: "agro",
    nombre: "Agro",
    title: "Alojamiento para el agro, al lado de la Rural | Bahía Blanca",
    description:
      "Pegado al predio de la Sociedad Rural de Bahía Blanca y a 12 km del puerto: habitaciones con cochera, restaurante y estación YPF. Contanos cuántos son.",
    h1: "Alojamiento para el agro en Bahía Blanca",
    bajada: "Al lado del predio de la Rural y sobre las rutas que traen la cosecha al puerto.",
    citable:
      "ACA Villa Bordeu es el alojamiento del Automóvil Club Argentino en Villa Bordeu, Bahía Blanca, pegado al predio de la Sociedad Rural donde se hace la exposición anual. Está sobre las rutas 33 y 35, que llegan desde la zona agrícola, y a 12 km del puerto de Ingeniero White. Tiene 26 habitaciones con cochera cubierta y restaurante.",
    distancias: [
      { lugar: "Predio de la Sociedad Rural", km: 1, min: 5 },
      { lugar: "Puerto de Ingeniero White", km: 12, min: 20 },
      { lugar: "Médanos", km: 39, min: 35 },
      { lugar: "Pedro Luro", km: 113, min: 90 },
      { lugar: "Pigüé", km: 133, min: 100 },
    ],
    oficina:
      "Para cerrar una operación, revisar papeles con un comprador o hacer las llamadas del día, en plena campaña o durante la exposición rural.",
    necesidades: [
      {
        titulo: "La campaña no tiene fecha fija",
        texto:
          "Cosecha, siembra y acopio dependen del clima. Si el trabajo se estira o se corta, nos avisás por el mismo WhatsApp y lo vamos acomodando.",
      },
      {
        titulo: "La exposición, al lado",
        texto:
          "Villa Bordeu está pegado al predio de la Sociedad Rural de Bahía Blanca. Expositores, cabañeros y compradores quedan a un paso de la muestra.",
      },
      {
        titulo: "Del campo al puerto",
        texto:
          "Las rutas 33 y 35 traen el grano desde el norte hasta este cruce. De acá al puerto de Ingeniero White son 12 km.",
      },
      {
        titulo: "La camioneta cargada, enfrente",
        texto:
          "Con la cochera cubierta en la puerta de la habitación, cargar y descargar es cuestión de dos pasos. Y si viajás con tu perro, se aceptan mascotas.",
      },
    ],
    contexto: {
      texto:
        "En el primer semestre de 2026 el Puerto de Bahía Blanca movió 9,93 millones de toneladas, un 19,1 % más que un año antes; los granos crecieron un 25,5 %.",
      fuente: "Consorcio de Gestión del Puerto de Bahía Blanca",
      url: "https://puertobahiablanca.com/estadisticaspuerto/2026/06/comparativo0626.pdf",
    },
    preguntas: [
      {
        p: "¿Qué tan cerca está de la Sociedad Rural?",
        r: "Pegado. El acceso al predio de la Rural queda a 1 km del alojamiento, sobre el mismo Camino Parque Sesquicentenario.",
      },
      {
        p: "¿Conviene consultar con tiempo para la exposición?",
        r: "Sí, escribinos apenas tengas las fechas. Contanos cuántos son y te pasamos todo por WhatsApp o mail.",
      },
      {
        p: "Trabajamos en la cosecha y no sabemos cuántos días nos quedamos. ¿Se puede?",
        r: "Sí. Contanos cuándo llegan y una idea de cuánto pueden quedarse. Si cambia, nos avisás por WhatsApp.",
      },
      {
        p: "¿Puedo ir con mi perro?",
        r: "Sí, Villa Bordeu es pet friendly. Avisanos al consultar que viajás con mascota.",
      },
    ],
    foto: "restaurante/01-salon-noche.jpg",
    cerca: "la-rural",
  },
];
