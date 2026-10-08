import { Hero } from "@/components/secciones/Hero";
import { Cinta } from "@/components/secciones/Cinta";
import { Predio } from "@/components/secciones/Predio";
import { ParaEmpresas } from "@/components/secciones/ParaEmpresas";
import { Distancias } from "@/components/secciones/Distancias";
import { DeptosApilados } from "@/components/secciones/DeptosApilados";
import { RestoBloque } from "@/components/secciones/RestoBloque";
import { DiaEquipo } from "@/components/secciones/DiaEquipo";
import { ViajeSocios } from "@/components/secciones/ViajeSocios";
import { Cierre, FaqLista, Servicios } from "@/components/secciones/Comunes";
import { FAQ_GENERAL } from "@/lib/faq";
import { JsonLd, motelJsonLd } from "@/lib/schema";

export default function Inicio() {
  return (
    <>
      <Hero />
      <Cinta />
      <section id="predio" className="seccion scroll-mt-[var(--header-h)]">
        <div className="contenedor">
          <Predio />
        </div>
      </section>
      <ParaEmpresas />
      <section className="seccion">
        <div className="contenedor">
          <Distancias />
        </div>
      </section>
      <DeptosApilados />
      <DiaEquipo />
      <RestoBloque />
      <Servicios />
      <ViajeSocios />
      <FaqLista preguntas={FAQ_GENERAL.slice(0, 7)} />
      <Cierre />
      <JsonLd data={motelJsonLd()} />
    </>
  );
}
