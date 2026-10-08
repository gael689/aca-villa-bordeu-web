import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { SITIO } from "@/lib/sitio";
import { FAQ_GENERAL } from "@/lib/faq";
import { JsonLd, departamentosJsonLd } from "@/lib/schema";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina, Servicios, TarjetaEnlace } from "@/components/secciones/Comunes";
import { TiposDepto } from "@/components/secciones/TiposDepto";

export const metadata = meta({
  title: "Departamentos en Bahía Blanca sobre la ruta · ACA Villa Bordeu",
  description:
    "26 departamentos single, doble y triple con baño privado, wifi y cochera cubierta en la puerta, sobre las rutas 3 y 33 en Bahía Blanca. Pet friendly.",
  ruta: "/departamentos",
});

export default function Departamentos() {
  return (
    <>
      <PortadaPagina
        foto={foto("habitaciones", "01-triple-dos-camas.jpg", "Departamento con paredes grafito, cabecera de madera y luz cálida")}
        etiqueta="Departamentos"
        titulo={
          <>
            Departamentos en Bahía Blanca, <span className="text-rojo">sobre la ruta</span>
          </>
        }
        bajada="Veintiséis departamentos con baño privado y la cochera cubierta en la puerta. Para quedarse una noche o varias semanas."
        migas={[{ nombre: "Departamentos", ruta: "/departamentos" }]}
      >
        <BotonConsultar modo="viaje" origen="deptos-portada">
          Consultar disponibilidad
        </BotonConsultar>
      </PortadaPagina>

      <Citable>
        ACA Villa Bordeu tiene {SITIO.departamentos} departamentos single, doble y triple en Bahía Blanca, todos con baño privado, wifi, calefacción y aire,
        y una cochera cubierta frente a cada puerta.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <TiposDepto />
        </div>
      </section>

      <Servicios titulo="Y en el mismo predio" />

      <section className="seccion">
        <div className="contenedor grid gap-3 md:grid-cols-3">
          <TarjetaEnlace href="/restaurante" foto={foto("restaurante", "01-salon-noche.jpg", "Salón del Resto")} titulo="Restaurante" texto="Cocinamos desde 1984" />
          <TarjetaEnlace href="/empresas" foto={foto("predio", "cocheras-noche.jpg", "Cocheras cubiertas")} titulo="Para empresas" texto="Alojá a tu equipo completo" />
          <TarjetaEnlace href="/el-complejo" foto={foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio")} titulo="El complejo" texto="Gimnasio, sala y más" />
        </div>
      </section>

      <FaqLista preguntas={FAQ_GENERAL.filter((q) => /cochera|noche|mascota|adaptado|desayuno|reservo|Cuánto/.test(q.p))} />
      <Cierre modo="viaje" origen="deptos-cierre" imagen={foto("habitaciones", "03-doble-vista-larga.jpg", "Departamento doble")} />
      <JsonLd data={departamentosJsonLd()} />
    </>
  );
}
