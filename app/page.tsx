import { Hero } from "@/components/secciones/Hero";
import { Cinta } from "@/components/secciones/Cinta";
import { HabitacionesApiladas } from "@/components/secciones/HabitacionesApiladas";
import { RestoBloque } from "@/components/secciones/RestoBloque";
import { Citable, FaqLista } from "@/components/secciones/Comunes";
import { Instalaciones } from "@/components/v2/Instalaciones";
import { Ubicacion } from "@/components/v2/Ubicacion";
import { Trabajo } from "@/components/v2/Trabajo";
import { ServiciosLinea } from "@/components/v2/ServiciosLinea";
import { ViajeSocios } from "@/components/secciones/ViajeSocios";
import { CierreParada } from "@/components/v2/CierreParada";
import { FAQ_GENERAL } from "@/lib/faq";
import { meta } from "@/lib/meta";
import { JsonLd, motelJsonLd } from "@/lib/schema";

// Versión 2 («Una parada estratégica»): todos los públicos; el trabajo es una sección, no la identidad.
// Oct/2026: Instalaciones une «Todo en un mismo lugar» y el mosaico; las tarjetas de ruta y socios vienen de la v1.
// Reseñas: no se incluyen hasta tener permiso para citar reseñas reales.
export const metadata = meta({
  title: "ACA Villa Bordeu · Alojamiento en Bahía Blanca sobre la Ruta 3",
  description:
    "Parada estratégica en Bahía Blanca: habitaciones con cochera, restaurante, Wi-Fi y recepción 24 h sobre el cruce de las rutas 3, 33 y 35. Red Hotelera ACA.",
  ruta: "/",
});

export default function Inicio() {
  return (
    <>
      <Hero />
      <Cinta />
      {/* Qué es Villa Bordeu, en una frase que se entiende sola (la que citan los buscadores con IA). */}
      <Citable>
        ACA Villa Bordeu es el alojamiento del Automóvil Club Argentino en Bahía Blanca, sobre el cruce de las rutas 3, 33 y 35, abierto desde
        1984: habitaciones con cochera cubierta, restaurante, estación YPF y recepción las 24 horas.
      </Citable>
      <Instalaciones />
      <Ubicacion />
      <HabitacionesApiladas />
      <Trabajo />
      <RestoBloque />
      <ServiciosLinea />
      <ViajeSocios />
      <FaqLista preguntas={FAQ_GENERAL.slice(0, 6)} jsonLd={false} />
      <CierreParada />
      <JsonLd data={motelJsonLd()} />
    </>
  );
}
