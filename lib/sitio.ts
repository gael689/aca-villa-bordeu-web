// Datos del negocio: un solo lugar. El pie, el JSON-LD, el llms.txt y los
// mensajes de WhatsApp salen de acá, así el nombre, la dirección y el teléfono
// nunca se dicen distinto en dos sitios (NAP).

// Host canónico: el que usan hoy (con www). Mientras el dominio no apunte a
// Vercel, las vistas previas usan la URL de producción de Vercel.
const host =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://www.acavillabordeu.com.ar");

export const SITIO = {
  nombre: "ACA Villa Bordeu",
  nombreLargo: "ACA Villa Bordeu · Alojamiento del Automóvil Club Argentino en Bahía Blanca",
  url: host.replace(/\/$/, ""),
  // Hasta publicar en el dominio, el sitio no se indexa (ver app/robots.ts).
  indexable: process.env.NEXT_PUBLIC_INDEXABLE === "1",
  // WhatsApp va al celular; para llamar, el fijo de recepción.
  whatsapp: "5492916421036",
  celular: "+54 9 291 642-1036",
  telefono: "0291 488-6855",
  telefonoE164: "+542914886855",
  mail: "info@acavillabordeu.com.ar",
  direccion: {
    calle: "Camino Parque Sesquicentenario 1699",
    acceso: "Ruta Nacional 3 y 33, Villa Bordeu",
    ciudad: "Bahía Blanca",
    provincia: "Buenos Aires",
    cp: "B8000",
    pais: "AR",
    // Coordenadas de la ficha de aca.org.ar (allá están rotuladas al revés).
    lat: -38.700554,
    lng: -62.333004,
  },
  departamentos: 26,
  fundacionACA: 1904,
  aliancaYPF: 1936,
  // Villa Bordeu entero (alojamiento y Resto) abrió en 1984, no solo el restaurante.
  abiertoDesde: 1984,
  redes: {
    facebook: "https://www.facebook.com/AcaVillaBordeu",
  },
  aca: {
    red: "https://www.aca.org.ar/red-hotelera-aca/",
    ficha: "https://www.aca.org.ar/red-hotelera/buenos-aires/villa-bordeu/",
  },
} as const;

export const MAPAS = {
  google: `https://www.google.com/maps/dir/?api=1&destination=${SITIO.direccion.lat},${SITIO.direccion.lng}`,
  waze: `https://waze.com/ul?ll=${SITIO.direccion.lat},${SITIO.direccion.lng}&navigate=yes`,
  embed: `https://www.google.com/maps?q=${SITIO.direccion.lat},${SITIO.direccion.lng}&z=14&output=embed`,
};

export function urlAbs(ruta = "/") {
  return `${SITIO.url}${ruta === "/" ? "" : ruta}`;
}

export const telLink = `tel:${SITIO.telefonoE164}`;
export const mailLink = `mailto:${SITIO.mail}`;
