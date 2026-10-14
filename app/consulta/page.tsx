import { meta } from "@/lib/meta";
import { SITIO, mailLink, telLink } from "@/lib/sitio";
import { linkGenerico } from "@/lib/mensaje";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { PortadaPagina } from "@/components/secciones/Comunes";
import { foto } from "@/lib/fotos";

export const metadata = meta({
  title: "Consultar disponibilidad · ACA Villa Bordeu",
  description:
    "Consultá disponibilidad en ACA Villa Bordeu por WhatsApp o mail: equipos de trabajo, viajeros y socios ACA. Recepción abierta las 24 horas en Bahía Blanca.",
  ruta: "/consulta",
});

/** Reemplaza a reservas.php del sitio viejo: dos caminos y los contactos directos. */
export default function PaginaConsulta() {
  return (
    <>
      <PortadaPagina
        foto={foto("cafeteria", "01-recepcion-cafeteria.jpg", "Recepción de Villa Bordeu con mostrador iluminado")}
        etiqueta="Consultar disponibilidad"
        titulo={
          <>
            Contanos qué <span className="resalte">necesitás</span>
          </>
        }
        bajada="Te respondemos por WhatsApp o mail. La recepción atiende las 24 horas."
        alto="media"
        migas={[{ nombre: "Consultar", ruta: "/consulta" }]}
      />
      <section className="seccion-chica">
        <div className="contenedor grid gap-3 md:grid-cols-2">
          <div className="flex flex-col justify-between gap-10 rounded-[var(--radio)] bg-amarillo p-8 text-tinta md:p-10">
            <div>
              <Icono nombre="casco" className="size-10" grosor={1.5} />
              <p className="mt-6 font-display text-[44px] leading-none font-bold uppercase">Vengo por trabajo</p>
              <p className="mt-3 max-w-[34ch] text-tinta/80">Cuántos son, desde cuándo y qué necesitan. En un minuto queda armado el pedido.</p>
            </div>
            <BotonConsultar modo="empresa" origen="consulta-empresa" className="btn btn-claro self-start">
              Consultar para mi equipo
            </BotonConsultar>
          </div>
          <div className="flex flex-col justify-between gap-10 rounded-[var(--radio)] bg-grafito p-8 text-white md:p-10">
            <div>
              <Icono nombre="ruta" className="size-10" grosor={1.5} />
              <p className="mt-6 font-display text-[44px] leading-none font-bold uppercase">Estoy de viaje</p>
              <p className="mt-3 max-w-[34ch] text-white/75">Fechas y cuántos viajan. Si sos socio ACA o venís con mascota, avisanos.</p>
            </div>
            <BotonConsultar modo="viaje" origen="consulta-viaje" className="btn self-start">
              Consultar disponibilidad
            </BotonConsultar>
          </div>
        </div>
        <div className="contenedor mt-3 grid gap-3 sm:grid-cols-3">
          <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] transition-colors hover:bg-hormigon">
            <span className="grid size-12 place-items-center rounded-full bg-wpp text-white">
              <Icono nombre="whatsapp" className="size-6" />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-asfalto">WhatsApp</span>
              <span className="block font-semibold">{SITIO.celular}</span>
            </span>
          </a>
          <a href={telLink} className="flex items-center gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] transition-colors hover:bg-hormigon">
            <span className="grid size-12 place-items-center rounded-full bg-tinta text-white">
              <Icono nombre="telefono" className="size-6" />
            </span>
            <span>
              <span className="block text-[13px] font-semibold text-asfalto">Llamar</span>
              <span className="block font-semibold">{SITIO.telefono}</span>
            </span>
          </a>
          <a href={mailLink} className="flex items-center gap-4 rounded-[var(--radio)] bg-white p-6 shadow-[inset_0_0_0_1px_var(--linea)] transition-colors hover:bg-hormigon">
            <span className="grid size-12 place-items-center rounded-full bg-amarillo text-tinta">
              <Icono nombre="sobre" className="size-6" />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold text-asfalto">Mail</span>
              <span className="block truncate font-semibold">{SITIO.mail}</span>
            </span>
          </a>
        </div>
      </section>
    </>
  );
}
