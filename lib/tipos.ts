// Tipos del contenido. Las páginas, el JSON-LD y el llms.txt leen de estos datos.

export type Pregunta = { p: string; r: string };

/** Distancia medida desde el predio (OSRM, sin tránsito, redondeada hacia arriba). */
export type Distancia = { lugar: string; km: number; min: number; nota?: string };

/** Clave de una foto en lib/fotos.json, p. ej. "restaurante/01-salon-noche.jpg". */
export type ClaveFoto = string;

export type Rubro = {
  slug: string; // /empresas/<slug>
  nombre: string; // «Petroquímica y puerto»
  title: string; // <title> ≤ 65 caracteres, terminado en « · ACA Villa Bordeu»
  description: string; // meta description 140–160
  h1: string; // con la búsqueda principal
  bajada: string; // una frase debajo del H1
  citable: string; // 2–3 frases que se entienden solas (GEO)
  distancias: Distancia[]; // lugares de trabajo de ese rubro
  oficina: string; // para qué le sirve la oficina de cortesía a ese rubro (texto propio de la página)
  necesidades: { titulo: string; texto: string }[]; // 4 cosas que necesita ese rubro y cómo las resuelve Villa Bordeu
  contexto: { texto: string; fuente: string; url: string }; // dato público con fuente (sin nombrar clientes)
  preguntas: Pregunta[]; // 4–5 propias
  foto: ClaveFoto;
  fotoAlt: string; // qué se ve en la foto (no el H1 ni el rubro)
  cerca?: string; // slug de /cerca-de relacionado
};

export type Ruta = {
  slug: string; // /como-llegar/<slug>
  origen: string; // «Buenos Aires»
  rutaNacional: string; // «3» (para el escudo)
  title: string;
  description: string;
  h1: string;
  bajada: string;
  citable: string;
  km: number; // aproximado desde el origen
  horas: string; // «7 h 30 min» aproximado
  pasaPor: string[]; // localidades en el camino
  recorrido: string[]; // 3–5 párrafos cortos: el viaje y el último tramo
  porQueParar: string[]; // 3 razones para parar acá sin entrar a la ciudad
  siguiente?: string; // para el que sigue viaje: la próxima parada ACA
  preguntas: Pregunta[];
};

export type LugarCerca = {
  slug: string; // /cerca-de/<slug>
  nombre: string;
  nombreCon: string; // con el artículo, para «Cerca de…»: «del Polo Petroquímico», «de General Cerri»
  title: string;
  description: string;
  h1: string;
  bajada: string;
  citable: string;
  distancia: Distancia;
  textos: string[]; // 2–4 párrafos con información útil y propia
  paraQuien: string[]; // a quién le sirve
  preguntas: Pregunta[];
  rubro?: string; // slug de rubro relacionado
};

export type SeccionCarta = { nombre: string; platos: { nombre: string; detalle?: string }[] };
