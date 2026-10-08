import { meta } from "@/lib/meta";
import { FAQ_EMPRESAS, FAQ_GENERAL } from "@/lib/faq";
import { Cierre, FaqLista, PortadaPagina } from "@/components/secciones/Comunes";
import { Icono } from "@/components/marca/Icono";

export const metadata = meta({
  title: "Preguntas frecuentes · ACA Villa Bordeu, Bahía Blanca",
  description:
    "Cochera, recepción 24 horas, mascotas, desayuno sin TACC, socios ACA y alojamiento para empresas: lo que más nos preguntan sobre ACA Villa Bordeu.",
  ruta: "/preguntas-frecuentes",
});

export default function Preguntas() {
  return (
    <>
      <PortadaPagina
        fondo={
          <div aria-hidden="true" className="absolute top-1/2 right-[3%] w-[min(60vw,560px)] -translate-y-1/2 text-white/[0.07]" data-parallax="8">
            <Icono nombre="campana" className="h-auto w-full" grosor={0.6} />
          </div>
        }
        etiqueta="Preguntas frecuentes"
        titulo={
          <>
            Lo que más <span className="text-rojo">nos preguntan</span>
          </>
        }
        bajada="Y si no está acá, escribinos: la recepción atiende las 24 horas."
        alto="media"
        migas={[{ nombre: "Preguntas frecuentes", ruta: "/preguntas-frecuentes" }]}
      />
      <FaqLista preguntas={FAQ_GENERAL} titulo="Estadía" etiqueta="Para todos" />
      <FaqLista preguntas={FAQ_EMPRESAS} titulo="Empresas" etiqueta="Equipos de trabajo" />
      <Cierre origen="faq-cierre" />
    </>
  );
}
