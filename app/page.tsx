import { Hero } from "@/components/secciones/Hero";
import { Cinta } from "@/components/secciones/Cinta";
import { DeptosApilados } from "@/components/secciones/DeptosApilados";
import { RestoBloque } from "@/components/secciones/RestoBloque";
import { FaqLista } from "@/components/secciones/Comunes";
import { PorQue } from "@/components/v2/PorQue";
import { Complejo } from "@/components/v2/Complejo";
import { Ubicacion } from "@/components/v2/Ubicacion";
import { Trabajo } from "@/components/v2/Trabajo";
import { ServiciosLinea } from "@/components/v2/ServiciosLinea";
import { Respaldo } from "@/components/v2/Respaldo";
import { CierreParada } from "@/components/v2/CierreParada";
import { FAQ_GENERAL } from "@/lib/faq";
import { meta } from "@/lib/meta";
import { JsonLd, motelJsonLd } from "@/lib/schema";

// Versión 2 («Una parada estratégica»): todos los públicos; el trabajo es una sección, no la identidad.
// Reseñas: no se incluyen hasta tener permiso para citar reseñas reales.
export const metadata = meta({
  title: "ACA Villa Bordeu · Alojamiento en Bahía Blanca sobre la Ruta 3",
  description:
    "Una parada estratégica en Bahía Blanca: departamentos con cochera, restaurante, Wi-Fi y recepción 24 h sobre el cruce de las rutas 3, 33 y 35. Red Hotelera ACA.",
  ruta: "/",
});

export default function Inicio() {
  return (
    <>
      <Hero />
      <Cinta />
      <PorQue />
      <Complejo />
      <Ubicacion />
      <DeptosApilados />
      <Trabajo />
      <RestoBloque />
      <ServiciosLinea />
      <Respaldo />
      <FaqLista preguntas={FAQ_GENERAL.slice(0, 6)} />
      <CierreParada />
      <JsonLd data={motelJsonLd()} />
    </>
  );
}
