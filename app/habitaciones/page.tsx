import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { FAQ_GENERAL } from "@/lib/faq";
import { JsonLd, habitacionesJsonLd } from "@/lib/schema";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina, Servicios, TarjetaEnlace } from "@/components/secciones/Comunes";
import { TiposHabitacion } from "@/components/secciones/TiposHabitacion";

export const metadata = meta({
  title: "Habitaciones en Bahía Blanca sobre la ruta · ACA Villa Bordeu",
  description:
    "Habitaciones single, doble y triple con baño privado, wifi y cochera cubierta en la puerta, sobre las rutas 3 y 33 en Bahía Blanca. Pet friendly.",
  ruta: "/habitaciones",
});

export default function Habitaciones() {
  return (
    <>
      <PortadaPagina
        foto={foto("habitaciones", "01-triple-dos-camas.jpg", "Habitación con paredes grafito, cabecera de madera y luz cálida")}
        etiqueta="Habitaciones"
        titulo={
          <>
            Habitaciones en Bahía Blanca, <span className="resalte">sobre la ruta</span>
          </>
        }
        bajada="Habitaciones con baño privado y la cochera cubierta en la puerta. Para quedarse una noche o varias semanas."
        migas={[{ nombre: "Habitaciones", ruta: "/habitaciones" }]}
      >
        <BotonConsultar modo="viaje" origen="habitaciones-portada">
          Consultar disponibilidad
        </BotonConsultar>
      </PortadaPagina>

      <Citable>
        ACA Villa Bordeu tiene habitaciones single, doble y triple en Bahía Blanca, todas con baño privado, wifi, calefacción y aire,
        y una cochera cubierta frente a cada puerta.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <TiposHabitacion />
        </div>
      </section>

      <Servicios titulo="Y en el mismo predio" />

      <section className="seccion">
        <div className="contenedor grid gap-3 md:grid-cols-3">
          <TarjetaEnlace href="/restaurante" foto={foto("restaurante", "01-salon-noche.jpg", "Salón del Resto")} titulo="Restaurante" texto="Cocinamos desde 1984" />
          <TarjetaEnlace href="/empresas" foto={foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones")} titulo="Para empresas" texto="Alojá a tu equipo completo" />
          <TarjetaEnlace href="/instalaciones" foto={foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio")} titulo="Instalaciones" texto="Gimnasio, sala y más" />
        </div>
      </section>

      <FaqLista preguntas={FAQ_GENERAL.filter((q) => /cochera|noche|mascota|adaptado|desayuno|reservo|Cuánto/.test(q.p))} jsonLd={false} />
      <Cierre modo="viaje" origen="habitaciones-cierre" imagen={foto("habitaciones", "03-doble-vista-larga.jpg", "Habitación doble")} />
      <JsonLd data={habitacionesJsonLd()} />
    </>
  );
}
