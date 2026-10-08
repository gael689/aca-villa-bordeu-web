import { meta } from "@/lib/meta";
import { MAPAS, SITIO, mailLink, telLink } from "@/lib/sitio";
import { linkGenerico } from "@/lib/mensaje";
import { JsonLd, motelJsonLd } from "@/lib/schema";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { PortadaPagina } from "@/components/secciones/Comunes";
import { MapaAlTocar } from "@/components/secciones/MapaAlTocar";
import { CartelVivo } from "@/components/secciones/CartelVivo";
import { foto } from "@/lib/fotos";

export const metadata = meta({
  title: "Contacto · ACA Villa Bordeu, Bahía Blanca",
  description:
    "WhatsApp +54 9 291 642-1036, info@acavillabordeu.com.ar. Camino Parque Sesquicentenario 1699, acceso Ruta 3 y 33, Bahía Blanca. Recepción las 24 horas.",
  ruta: "/contacto",
});

export default function Contacto() {
  return (
    <>
      <PortadaPagina
        foto={foto("cafeteria", "03-mostrador.jpg", "Mostrador de la recepción iluminado")}
        etiqueta="Contacto"
        titulo={
          <>
            Estamos <span className="text-rojo">las 24 horas</span>
          </>
        }
        bajada="Escribinos, llamanos o vení directo: la recepción siempre está abierta."
        alto="media"
        migas={[{ nombre: "Contacto", ruta: "/contacto" }]}
      >
        <CartelVivo />
      </PortadaPagina>

      <section className="seccion-chica">
        <div className="contenedor grid gap-3 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-3">
            <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-[var(--radio)] bg-wpp p-6 text-white md:p-8">
              <span>
                <span className="block text-[13px] font-semibold text-white/80">WhatsApp y teléfono</span>
                <span className="block font-display text-[30px] leading-none font-bold">{SITIO.telefono}</span>
              </span>
              <Icono nombre="whatsapp" className="size-9" />
            </a>
            <a href={telLink} className="flex items-center justify-between gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] md:p-8">
              <span>
                <span className="block text-[13px] font-semibold text-asfalto">Llamar</span>
                <span className="block font-display text-[30px] leading-none font-bold">{SITIO.telefono}</span>
              </span>
              <Icono nombre="telefono" className="size-8 text-rojo" />
            </a>
            <a href={mailLink} className="flex items-center justify-between gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] md:p-8">
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-asfalto">Mail</span>
                <span className="block truncate font-display text-[24px] leading-none font-bold sm:text-[28px]">{SITIO.mail}</span>
              </span>
              <Icono nombre="sobre" className="size-8 shrink-0 text-rojo" />
            </a>
            <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-[var(--radio)] bg-grafito p-6 text-white md:p-8">
              <span>
                <span className="block text-[13px] font-semibold text-white/60">Dirección</span>
                <span className="block text-[18px] font-semibold">{SITIO.direccion.calle}</span>
                <span className="block text-white/60">
                  {SITIO.direccion.acceso} · {SITIO.direccion.ciudad}
                </span>
              </span>
              <Icono nombre="pin" className="size-8 shrink-0 text-rojo" />
            </a>
            <BotonConsultar origen="contacto" className="btn w-full">
              Armar mi consulta
            </BotonConsultar>
          </div>
          <MapaAlTocar />
        </div>
      </section>
      <JsonLd data={motelJsonLd()} />
    </>
  );
}
