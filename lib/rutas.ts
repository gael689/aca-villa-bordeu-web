import type { Ruta } from "./tipos";

// Páginas /como-llegar/<slug>. km y horas: OSRM (router.project-osrm.org) desde el centro de cada origen
// hasta el predio, sin tránsito ni paradas, redondeados hacia arriba (km al entero, tiempo a 5 minutos).
// Medido el 08/10/2026. Buenos Aires forzado por la RN 3 (vía Tres Arroyos) y Rosario por la RN 33 (vía Venado Tuerto).
// Localidades en el camino: kilometrajes de Wikipedia (RN 3, 22, 33 y 35).

export const RUTAS: Ruta[] = [
  {
    slug: "desde-buenos-aires",
    origen: "Buenos Aires",
    rutaNacional: "3",
    title: "Desde Buenos Aires por la Ruta 3 · ACA Villa Bordeu",
    description:
      "Unos 700 km por la RN 3, por Azul y Tres Arroyos. El último tramo hasta ACA Villa Bordeu, en Bahía Blanca, y por qué conviene parar antes de seguir al sur.",
    h1: "Cómo llegar desde Buenos Aires por la Ruta 3",
    bajada: "Unos 700 km de ruta hasta el acceso de Bahía Blanca, con el auto en la puerta al llegar.",
    citable:
      "Desde Buenos Aires, ACA Villa Bordeu queda a unos 700 km por la Ruta Nacional 3, que pasa por Azul, Tres Arroyos y Coronel Dorrego. Son alrededor de 9 horas de manejo sin paradas. El alojamiento del Automóvil Club Argentino está en el acceso de las rutas 3 y 33, en Villa Bordeu, al suroeste de Bahía Blanca.",
    km: 701,
    horas: "9 h",
    pasaPor: ["Cañuelas", "San Miguel del Monte", "Las Flores", "Azul", "Adolfo Gonzales Chaves", "Tres Arroyos", "Coronel Dorrego"],
    recorrido: [
      "La RN 3 sale de la Capital por Cañuelas y baja derecho por el centro de la provincia: Las Flores, Azul y después la llanura del sur hasta Tres Arroyos.",
      "Coronel Dorrego es la última ciudad antes de llegar: desde ahí quedan unos 100 km.",
      "La RN 3 pasa por Bahía Blanca y Villa Bordeu está del lado suroeste, camino a General Cerri, sobre el acceso de las rutas 33 y 35. En Google Maps o Waze buscá «ACA Villa Bordeu» y el navegador te lleva hasta el Camino Parque Sesquicentenario 1699.",
      "El navegador puede proponerte otro camino: la RN 205 y la provincial 65 hasta la RN 33, que baja por Tornquist. Mide unos 677 km y termina en el mismo cruce, a metros del predio.",
    ],
    porQueParar: [
      "Después de nueve horas de manejo, parás en el acceso y dejás el auto bajo techo, frente a la habitación.",
      "Cenás en el Resto, que cocina desde 1984, y a la mañana cargás en la YPF del predio antes de seguir.",
      "Al otro día salís derecho a la RN 3 sur o a la RN 22, sin volver a cruzar la ciudad.",
    ],
    siguiente:
      "Si seguís hacia el sur, la próxima parada de la Red ACA es Choele Choel, a unos 301 km por la RN 22, o Las Grutas, a unos 414 km por la RN 3.",
    preguntas: [
      {
        p: "¿Cuántos kilómetros hay de Buenos Aires a ACA Villa Bordeu?",
        r: "Unos 700 km por la RN 3, medidos desde el centro de la Capital. Por la RN 205 y la RN 33 son unos 677 km.",
      },
      {
        p: "¿Cuánto se tarda en auto?",
        r: "Alrededor de 9 horas de manejo por la RN 3, sin contar paradas ni tránsito.",
      },
      {
        p: "¿Hay que cruzar Bahía Blanca para llegar?",
        r: "Por la RN 3, la ruta pasa por la ciudad y Villa Bordeu queda del lado suroeste, camino a General Cerri. Por la RN 33 llegás directo al cruce donde está el predio.",
      },
      {
        p: "¿Puedo llegar de noche?",
        r: "Sí, la recepción está abierta las 24 horas. Avisanos por WhatsApp si llegás tarde.",
      },
    ],
  },
  {
    slug: "desde-neuquen",
    origen: "Neuquén",
    rutaNacional: "22",
    title: "Desde Neuquén por la Ruta 22 · ACA Villa Bordeu",
    description:
      "Unos 527 km por la RN 22, por el Alto Valle, Choele Choel y Río Colorado. Llegás a ACA Villa Bordeu, en Bahía Blanca, por la RN 3 sin entrar a la ciudad.",
    h1: "Cómo llegar desde Neuquén por la Ruta 22",
    bajada: "Del Alto Valle a Bahía Blanca por la RN 22, y llegás sin entrar a la ciudad.",
    citable:
      "Desde Neuquén, ACA Villa Bordeu queda a unos 527 km por la Ruta Nacional 22, que pasa por el Alto Valle, Choele Choel, Río Colorado y Médanos. Son alrededor de 6 horas 50 minutos de manejo sin paradas. La RN 22 termina en la RN 3, al sur de Bahía Blanca, y desde ahí el alojamiento del Automóvil Club Argentino queda a pocos minutos sin cruzar la ciudad.",
    km: 527,
    horas: "6 h 50 min",
    pasaPor: ["Cipolletti", "General Roca", "Villa Regina", "Choele Choel", "Río Colorado", "Médanos"],
    recorrido: [
      "La RN 22 recorre el Alto Valle de punta a punta: Cipolletti, General Roca, Villa Regina. Es el tramo con más tránsito, entre chacras y camiones.",
      "Después de Chichinales la ruta deja el valle y sigue hasta Choele Choel. Más adelante, en Río Colorado, cruzás el río y pasás un tramo corto por La Pampa antes de entrar a la provincia de Buenos Aires.",
      "Médanos es el último pueblo. Unos kilómetros más adelante, la RN 22 termina en la RN 3: doblás hacia Bahía Blanca, pasás el acceso a General Cerri y llegás a Villa Bordeu.",
      "Villa Bordeu está antes de la ciudad. No hace falta entrar a Bahía Blanca para llegar ni para volver a salir.",
    ],
    porQueParar: [
      "Si vas hacia Buenos Aires o la costa, partís el viaje a la mitad y dormís con el auto bajo techo en la puerta de la habitación.",
      "Si venís por trabajo a la zona del Polo, Ingeniero White queda a 12 km de Villa Bordeu.",
      "La YPF del predio te deja salir con el tanque lleno a la mañana.",
    ],
    siguiente:
      "Sobre la misma RN 22, la Red ACA tiene hoteles en Cipolletti y en Choele Choel. Si seguís hacia la Costa Atlántica, el otro hotel ACA de la provincia de Buenos Aires está en Villa Gesell.",
    preguntas: [
      {
        p: "¿Cuántos kilómetros hay de Neuquén a ACA Villa Bordeu?",
        r: "Unos 527 km por la RN 22, medidos desde el centro de Neuquén.",
      },
      {
        p: "¿Dónde está el empalme de la RN 22 con la RN 3?",
        r: "Al sur de Bahía Blanca, después de Médanos. Desde ahí tomás la RN 3 hacia la ciudad y Villa Bordeu aparece antes de llegar.",
      },
      {
        p: "¿Cuánto se tarda en auto desde Neuquén?",
        r: "Alrededor de 6 horas 50 minutos de manejo, sin contar paradas ni tránsito. Al llegar tenés la YPF dentro del predio.",
      },
      {
        p: "Vengo con mi perro, ¿puedo quedarme?",
        r: "Sí, se aceptan mascotas. Avisanos al consultar.",
      },
    ],
  },
  {
    slug: "desde-rosario",
    origen: "Rosario",
    rutaNacional: "33",
    title: "Desde Rosario por la Ruta 33 · ACA Villa Bordeu",
    description:
      "Unos 814 km por la RN 33, por Venado Tuerto, Trenque Lauquen y Pigüé, hasta el cruce donde está ACA Villa Bordeu, en Bahía Blanca. Mirá el recorrido.",
    h1: "Cómo llegar desde Rosario por la Ruta 33",
    bajada: "La RN 33 termina en el mismo cruce donde está Villa Bordeu.",
    citable:
      "Desde Rosario, ACA Villa Bordeu queda a unos 814 km por la Ruta Nacional 33, que pasa por Venado Tuerto, Rufino, Trenque Lauquen, Pigüé y Tornquist. Son alrededor de 10 horas de manejo sin paradas. La RN 33 termina en la RN 3, en el suroeste de Bahía Blanca, y el alojamiento del Automóvil Club Argentino está sobre ese acceso.",
    km: 814,
    horas: "10 h 10 min",
    pasaPor: ["Casilda", "Firmat", "Venado Tuerto", "Rufino", "General Villegas", "Trenque Lauquen", "Guaminí", "Pigüé", "Tornquist"],
    recorrido: [
      "La RN 33 sale de Rosario hacia el sudoeste y cruza el sur de Santa Fe: Casilda, Firmat, Venado Tuerto y Rufino.",
      "Entra a Buenos Aires por General Villegas y baja por el oeste de la provincia hasta Trenque Lauquen, Guaminí y Pigüé. Es el corredor por el que el grano viaja al puerto de Bahía Blanca, así que vas a compartir la ruta con camiones.",
      "Tornquist, al pie de las sierras, es el último pueblo grande: desde ahí quedan 74 km.",
      "La RN 33 termina en la RN 3, en el acceso suroeste de Bahía Blanca. Villa Bordeu está ahí mismo: llegás antes de entrar a la ciudad.",
    ],
    porQueParar: [
      "Después de diez horas de ruta, el último kilómetro es el más corto: la RN 33 te deja en la puerta.",
      "Si seguís viaje al sur, al otro día tomás la RN 3 o la RN 22 desde el mismo cruce.",
      "Cenás en el Resto sin volver a subir al auto.",
    ],
    siguiente:
      "Si seguís hacia la Patagonia, la próxima parada de la Red ACA es Choele Choel, a unos 301 km por la RN 22.",
    preguntas: [
      {
        p: "¿Cuántos kilómetros hay de Rosario a ACA Villa Bordeu?",
        r: "Unos 814 km por la RN 33, medidos desde el centro de Rosario.",
      },
      {
        p: "¿Qué tan lejos queda de Tornquist y de Pigüé?",
        r: "Tornquist está a 74 km de Villa Bordeu y Pigüé a 133 km, los dos sobre la misma RN 33.",
      },
      {
        p: "¿La RN 33 llega directo a Villa Bordeu?",
        r: "Sí. La RN 33 termina en el cruce con la RN 3, en el acceso suroeste de Bahía Blanca, y Villa Bordeu está sobre ese acceso.",
      },
      {
        p: "¿Puedo comer al llegar?",
        r: "Sí, el restaurante está en el mismo predio. Si querés asegurarte la mesa, escribinos por WhatsApp.",
      },
    ],
  },
  {
    slug: "desde-santa-rosa",
    origen: "Santa Rosa",
    rutaNacional: "35",
    title: "Desde Santa Rosa por la Ruta 35 · ACA Villa Bordeu",
    description:
      "Unos 322 km por la RN 35 desde La Pampa, unas 4 horas de manejo. La ruta entra a Bahía Blanca justo donde está ACA Villa Bordeu. Mirá el recorrido.",
    h1: "Cómo llegar desde Santa Rosa por la Ruta 35",
    bajada: "De La Pampa a Bahía Blanca: la RN 35 llega justo a Villa Bordeu.",
    citable:
      "Desde Santa Rosa, La Pampa, ACA Villa Bordeu queda a unos 322 km por la Ruta Nacional 35: alrededor de 4 horas de manejo sin paradas. La RN 35 entra a Bahía Blanca por Villa Bordeu, donde está el alojamiento del Automóvil Club Argentino, junto al cruce con la RN 33.",
    km: 322,
    horas: "4 h",
    pasaPor: ["Ataliva Roca", "Bernasconi", "General San Martín", "Jacinto Aráuz", "Villa Iris"],
    recorrido: [
      "La RN 35 sale de Santa Rosa hacia el sur y atraviesa el este de La Pampa. Los pueblos quedan a un costado de la ruta, cada uno con su acceso.",
      "Pasando Jacinto Aráuz se entra a la provincia de Buenos Aires. Después del acceso a Villa Iris quedan unos 100 km.",
      "La propia RN 35 marca Villa Bordeu en su kilómetro 8, a partir del cruce con la RN 33. Ahí está el alojamiento: llegás antes de entrar a la ciudad.",
      "Si venís de más lejos, es la misma RN 35 que viene desde Río Cuarto, en Córdoba.",
    ],
    porQueParar: [
      "Son cuatro horas desde Santa Rosa: llegás temprano, con tiempo para cenar en el Resto.",
      "Si seguís hacia la Patagonia o la costa, mañana salís a la RN 3 o la RN 22 sin cruzar Bahía Blanca.",
      "Si venís por médicos, trámites o compras, dejás el auto bajo techo y el centro queda a 8 km.",
    ],
    siguiente:
      "Si seguís hacia la costa rionegrina, la próxima parada de la Red ACA es Las Grutas, a unos 414 km por la RN 3.",
    preguntas: [
      {
        p: "¿Cuántos kilómetros hay de Santa Rosa a ACA Villa Bordeu?",
        r: "Unos 322 km por la RN 35, medidos desde el centro de Santa Rosa: alrededor de 4 horas de manejo.",
      },
      {
        p: "¿La RN 35 pasa por Villa Bordeu?",
        r: "Sí. La RN 35 llega a Bahía Blanca por Villa Bordeu, junto al cruce con la RN 33, y el alojamiento está ahí.",
      },
      {
        p: "¿A cuánto queda el centro de Bahía Blanca?",
        r: "A 8 km, unos 15 minutos en auto.",
      },
      {
        p: "Soy socio ACA, ¿tengo algún beneficio?",
        r: "Sí, la Red Hotelera ACA tiene condiciones para socios. Contanos que sos socio cuando consultes y te pasamos todo.",
      },
    ],
  },
  {
    slug: "desde-la-patagonia",
    origen: "la Patagonia",
    rutaNacional: "3",
    title: "Desde la Patagonia por la Ruta 3 · ACA Villa Bordeu",
    description:
      "Desde Viedma son unos 270 km por la RN 3, por Pedro Luro y Mayor Buratovich. Llegás a ACA Villa Bordeu, en Bahía Blanca, sin entrar a la ciudad.",
    h1: "Cómo llegar desde la Patagonia por la Ruta 3",
    bajada: "De Viedma hacia el norte por la RN 3: la primera parada ACA de la provincia de Buenos Aires.",
    citable:
      "Desde Viedma, ACA Villa Bordeu queda a unos 270 km por la Ruta Nacional 3, que pasa por Carmen de Patagones, Pedro Luro y Mayor Buratovich. Son alrededor de 3 horas 40 minutos de manejo sin paradas. El alojamiento del Automóvil Club Argentino está en Villa Bordeu, en el acceso suroeste de Bahía Blanca, y se llega desde el sur sin cruzar la ciudad.",
    km: 270,
    horas: "3 h 40 min",
    pasaPor: ["Viedma", "Carmen de Patagones", "Stroeder", "Villalonga", "Pedro Luro", "Hilario Ascasubi", "Mayor Buratovich"],
    recorrido: [
      "Si venís de Madryn o de más al sur, es la misma RN 3. En Viedma cruzás el río Negro y estás en Carmen de Patagones, ya en la provincia de Buenos Aires.",
      "Desde Patagones la ruta sube por Stroeder y Villalonga hasta Pedro Luro, donde cruza el río Colorado. Sigue el valle regado de Villarino: Hilario Ascasubi y Mayor Buratovich.",
      "Pasando Buratovich se encuentra el empalme con la RN 22, la que viene del Alto Valle. Seguís por la RN 3 y pasás el acceso a General Cerri.",
      "Unos kilómetros después llegás a Villa Bordeu. El alojamiento está antes de la ciudad: no hace falta entrar a Bahía Blanca.",
    ],
    porQueParar: [
      "Es la primera parada de la Red ACA en la provincia de Buenos Aires para el que sube desde el sur.",
      "Dormís en el acceso y a la mañana elegís: RN 3 hacia Buenos Aires, RN 33 hacia Rosario o RN 35 hacia La Pampa y Córdoba.",
      "Cargás en la YPF del predio y salís sin pasar por el centro.",
    ],
    siguiente:
      "Si subís hacia La Pampa por la RN 35, la Red ACA tiene hotel en Santa Rosa, a unos 322 km.",
    preguntas: [
      {
        p: "¿Cuántos kilómetros hay de Viedma a ACA Villa Bordeu?",
        r: "Unos 270 km por la RN 3, medidos desde el centro de Viedma: alrededor de 3 horas 40 minutos de manejo.",
      },
      {
        p: "¿Y desde Pedro Luro?",
        r: "Pedro Luro queda a 113 km de Villa Bordeu, unos 90 minutos por la RN 3.",
      },
      {
        p: "¿Río Colorado está sobre este camino?",
        r: "No. Río Colorado está sobre la RN 22, la ruta que viene de Neuquén. Por la RN 3 se pasa por Pedro Luro, donde también se cruza el río Colorado.",
      },
      {
        p: "¿Tengo que entrar a Bahía Blanca?",
        r: "No. Desde el sur, la RN 3 pasa por el acceso a General Cerri y llega a Villa Bordeu antes de la ciudad.",
      },
    ],
  },
];
