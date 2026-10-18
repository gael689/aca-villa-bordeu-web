import type { BreadcrumbList, FAQPage, GasStation, HotelRoom, Motel, Organization, Restaurant, WebSite, WithContext } from "schema-dts";
import { SITIO, urlAbs } from "./sitio";
import { TIPOS, INCLUYE } from "./habitaciones";
import { CARTA } from "./carta";
import type { Pregunta } from "./tipos";

// JSON-LD con los mismos datos que muestra la página. Sin precios, sin
// `priceRange` ni `offers`, y sin AggregateRating (estrellas propias = riesgo).

const ID = {
  org: urlAbs("/#organizacion"),
  web: urlAbs("/#sitio"),
  motel: urlAbs("/#motel"),
  resto: urlAbs("/restaurante#resto"),
  ypf: urlAbs("/estacion-de-servicio#ypf"),
};

const direccion = {
  "@type": "PostalAddress" as const,
  streetAddress: SITIO.direccion.calle,
  addressLocality: SITIO.direccion.ciudad,
  addressRegion: SITIO.direccion.provincia,
  postalCode: SITIO.direccion.cp,
  addressCountry: SITIO.direccion.pais,
};
const geo = { "@type": "GeoCoordinates" as const, latitude: SITIO.direccion.lat, longitude: SITIO.direccion.lng };
const amenidad = (name: string) => ({ "@type": "LocationFeatureSpecification" as const, name, value: true });

export function organizacionJsonLd(): (WithContext<Organization> | WithContext<WebSite>)[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": ID.org,
      name: SITIO.nombre,
      url: SITIO.url,
      logo: urlAbs("/marca/aca.png"),
      email: SITIO.mail,
      telephone: SITIO.telefonoE164,
      address: direccion,
      parentOrganization: {
        "@type": "Organization",
        name: "Automóvil Club Argentino",
        url: "https://www.aca.org.ar",
        foundingDate: "1904",
        sameAs: ["https://es.wikipedia.org/wiki/Autom%C3%B3vil_Club_Argentino"],
      },
      contactPoint: [
        { "@type": "ContactPoint", contactType: "reservations", telephone: SITIO.telefonoE164, availableLanguage: "es", areaServed: "AR" },
        { "@type": "ContactPoint", contactType: "reservations", telephone: `+${SITIO.whatsapp}`, availableLanguage: "es", areaServed: "AR", description: "WhatsApp" },
      ],
      sameAs: [SITIO.redes.facebook, SITIO.aca.ficha],
    },
    { "@context": "https://schema.org", "@type": "WebSite", "@id": ID.web, url: SITIO.url, name: SITIO.nombre, inLanguage: "es-AR", publisher: { "@id": ID.org } },
  ];
}

export function motelJsonLd(): WithContext<Motel> {
  return {
    "@context": "https://schema.org",
    "@type": "Motel",
    "@id": ID.motel,
    name: SITIO.nombre,
    description:
      "Motel del Automóvil Club Argentino en Bahía Blanca, sobre el cruce de las rutas nacionales 3, 33 y 35. Abierto desde 1984. Habitaciones con cochera cubierta, restaurante, gimnasio, sala de reuniones, lavandería, recepción 24 horas y estación de servicio YPF.",
    url: SITIO.url,
    image: [urlAbs("/fotos/restaurante/01-salon-noche.jpg"), urlAbs("/fotos/habitaciones/01-triple-dos-camas.jpg")],
    telephone: SITIO.telefonoE164,
    email: SITIO.mail,
    address: direccion,
    foundingDate: String(SITIO.abiertoDesde),
    geo,
    petsAllowed: true,
    // Recepción abierta las 24 horas, todos los días.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: [SITIO.redes.facebook, SITIO.aca.ficha],
    starRating: { "@type": "Rating", ratingValue: 3 },
    brand: { "@type": "Brand", name: "Automóvil Club Argentino" },
    parentOrganization: { "@id": ID.org },
    amenityFeature: [
      "Cochera cubierta",
      "Recepción 24 horas",
      "Wi-Fi",
      "Restaurante",
      "Desayuno",
      "Desayuno sin TACC",
      "Lavandería",
      "Gimnasio",
      "Sala de reuniones",
      "Estación de servicio",
      "Admite mascotas",
      "Habitación adaptada",
      "Juegos para chicos",
    ].map(amenidad),
    containsPlace: [{ "@id": ID.resto }, { "@id": ID.ypf }],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${SITIO.direccion.lat},${SITIO.direccion.lng}`,
  };
}

export function habitacionesJsonLd(): WithContext<HotelRoom>[] {
  return TIPOS.map((t) => ({
    "@context": "https://schema.org",
    "@type": "HotelRoom",
    name: `Habitación ${t.nombre} · ${SITIO.nombre}`,
    description: `${t.camas}. ${t.frase}`,
    image: t.fotos.map((f) => urlAbs(f.src)),
    occupancy: { "@type": "QuantitativeValue", maxValue: t.personas },
    numberOfBathroomsTotal: 1,
    petsAllowed: true,
    amenityFeature: INCLUYE.map(amenidad),
    containedInPlace: { "@id": ID.motel },
  }));
}

export function restoJsonLd(): WithContext<Restaurant> {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": ID.resto,
    name: "Resto Villa Bordeu",
    description: "El restaurante de ACA Villa Bordeu, en Bahía Blanca, sobre la ruta. Cocina desde 1984: parrilla, pastas y especialidades, con cava de vinos y bar.",
    url: urlAbs("/restaurante"),
    image: urlAbs("/fotos/restaurante/01-salon-noche.jpg"),
    telephone: SITIO.telefonoE164,
    address: direccion,
    geo,
    foundingDate: String(SITIO.abiertoDesde),
    servesCuisine: ["Argentina", "Parrilla", "Pastas"],
    acceptsReservations: true,
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: CARTA.map((s) => ({
        "@type": "MenuSection" as const,
        name: s.nombre,
        hasMenuItem: s.platos.map((p) => ({ "@type": "MenuItem" as const, name: p.nombre, description: p.detalle })),
      })),
    },
    containedInPlace: { "@id": ID.motel },
  };
}

export function estacionJsonLd(): WithContext<GasStation> {
  return {
    "@context": "https://schema.org",
    "@type": "GasStation",
    "@id": ID.ypf,
    name: "Estación de servicio ACA YPF Villa Bordeu",
    url: urlAbs("/estacion-de-servicio"),
    brand: { "@type": "Brand", name: "YPF" },
    address: direccion,
    geo,
    containedInPlace: { "@id": ID.motel },
  };
}

export function faqJsonLd(preguntas: Pregunta[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((q) => ({ "@type": "Question", name: q.p, acceptedAnswer: { "@type": "Answer", text: q.r } })),
  };
}

export function migasJsonLd(items: { nombre: string; ruta: string }[]): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ nombre: "Inicio", ruta: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.nombre,
      item: urlAbs(it.ruta),
    })),
  };
}

/** Inserta uno o varios JSON-LD. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
