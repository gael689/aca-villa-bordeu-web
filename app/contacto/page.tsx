import { meta } from "@/lib/meta";
import { MAPAS, SITIO, mailLink, telLink } from "@/lib/sitio";
import { linkGenerico } from "@/lib/mensaje";
import { JsonLd, motelJsonLd } from "@/lib/schema";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Citable, PortadaPagina } from "@/components/secciones/Comunes";
import { MapaAlTocar } from "@/components/secciones/MapaAlTocar";
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
            Contacto: estamos <span className="resalte">las 24 horas</span>
          </>
        }
        bajada="Escribinos, llamanos o vení directo: la recepción siempre está abierta."
        alto="media"
        migas={[{ nombre: "Contacto", ruta: "/contacto" }]}
      />

      <Citable>
        ACA Villa Bordeu está en {SITIO.direccion.calle}, {SITIO.direccion.acceso}, {SITIO.direccion.ciudad}, provincia de {SITIO.direccion.provincia}. La
        recepción atiende las 24 horas: teléfono {SITIO.telefono}, WhatsApp {SITIO.celular} y mail {SITIO.mail}.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <h2 className="t-h2 mb-8" data-split>
            Llamanos, escribinos o <span className="resalte">vení</span>
          </h2>
        </div>
        <div className="contenedor grid gap-3 lg:grid-cols-[1fr_1.3fr]">
          <div className="flex flex-col gap-3">
            <address className="flex flex-col gap-3 not-italic">
              <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-[var(--radio)] bg-wpp p-6 text-white md:p-8">
                <span>
                  <span className="block text-[13px] font-semibold text-white/80">WhatsApp</span>
                  <span className="block font-display text-[30px] leading-none font-bold">{SITIO.celular}</span>
                </span>
                <Icono nombre="whatsapp" className="size-9" />
              </a>
              <a href={telLink} className="flex items-center justify-between gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] md:p-8">
                <span>
                  <span className="block text-[13px] font-semibold text-asfalto">Llamar</span>
                  <span className="block font-display text-[30px] leading-none font-bold">{SITIO.telefono}</span>
                </span>
                <Icono nombre="telefono" className="size-8 text-acento" />
              </a>
              <a href={mailLink} className="flex items-center justify-between gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] md:p-8">
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-asfalto">Mail</span>
                  <span className="block truncate font-display text-[24px] leading-none font-bold sm:text-[28px]">{SITIO.mail}</span>
                </span>
                <Icono nombre="sobre" className="size-8 shrink-0 text-acento" />
              </a>
              <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-[var(--radio)] bg-grafito p-6 text-white md:p-8">
                <span>
                  <span className="block text-[13px] font-semibold text-white/60">Dirección</span>
                  <span className="block text-[18px] font-semibold">{SITIO.direccion.calle}</span>
                  <span className="block text-white/60">
                    {SITIO.direccion.acceso} · {SITIO.direccion.ciudad}
                  </span>
                </span>
                <Icono nombre="pin" className="size-8 shrink-0 text-acento" />
              </a>
            </address>
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
