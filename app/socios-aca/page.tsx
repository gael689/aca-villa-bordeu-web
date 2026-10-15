import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { SITIO } from "@/lib/sitio";
import type { Pregunta } from "@/lib/tipos";
import { Icono } from "@/components/marca/Icono";
import { LogoACA } from "@/components/marca/Logo";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina } from "@/components/secciones/Comunes";
import { OficinaCortesia } from "@/components/secciones/OficinaCortesia";

export const metadata = meta({
  title: "Socios ACA: hotel en Bahía Blanca · ACA Villa Bordeu",
  description:
    "Villa Bordeu es el alojamiento de la Red Hotelera del Automóvil Club Argentino en Bahía Blanca, primera parada del corredor patagónico. Beneficios para socios.",
  ruta: "/socios-aca",
});

// Red Hotelera ACA hacia el sur, según aca.org.ar/red-hotelera-aca (relevamiento/mercado.md §1).
const RED_SUR = [
  { nombre: "Villa Bordeu", lugar: "Bahía Blanca, Buenos Aires", aca: true },
  { nombre: "Choele Choel", lugar: "Río Negro" },
  { nombre: "Cipolletti", lugar: "Río Negro" },
  { nombre: "Los Menucos", lugar: "Río Negro" },
  { nombre: "Las Grutas", lugar: "Río Negro" },
  { nombre: "Los Altares", lugar: "Chubut" },
  { nombre: "Punta Cuevas", lugar: "Puerto Madryn, Chubut" },
  { nombre: "Puerto Pirámides", lugar: "Chubut" },
  { nombre: "El Calafate", lugar: "Santa Cruz" },
  { nombre: "Bahía San Sebastián", lugar: "Tierra del Fuego" },
];

const PREGUNTAS: Pregunta[] = [
  { p: "¿Cómo uso mi beneficio de socio?", r: "Contanos que sos socio cuando consultes por WhatsApp o mail, y tené a mano tu credencial al llegar." },
  { p: "¿Cuál es el beneficio para socios?", r: "Escribinos por WhatsApp o mail con las fechas y cuántos son, y te pasamos todo." },
  { p: "¿Puedo alojarme si no soy socio?", r: "Sí, Villa Bordeu recibe a socios y a no socios." },
  { p: "¿La estación de servicio tiene beneficios ACA?", r: "Es una estación ACA YPF. Los beneficios de combustible para socios son los de la red ACA: consultalos en aca.org.ar." },
];

export default function Socios() {
  return (
    <>
      <PortadaPagina
        fondo={
          <div aria-hidden="true" className="absolute top-1/2 -right-[6%] w-[min(80vw,900px)] -translate-y-1/2 text-amarillo/25" data-parallax="8">
            <LogoACA className="h-auto w-full" />
          </div>
        }
        etiqueta="Socios ACA"
        titulo={
          <>
            Tu carnet <span className="resalte">también vale acá</span>
          </>
        }
        bajada="Villa Bordeu es parte de la Red Hotelera del Automóvil Club Argentino: la primera parada ACA camino al sur."
        alto="media"
        migas={[{ nombre: "Socios ACA", ruta: "/socios-aca" }]}
      >
        <BotonConsultar modo="viaje" origen="socios-portada">
          Consultar como socio
        </BotonConsultar>
      </PortadaPagina>

      <Citable>
        ACA Villa Bordeu es el alojamiento del Automóvil Club Argentino en Bahía Blanca. Integra la Red Hotelera ACA, con beneficios para socios, y es la primera
        parada de la red en el corredor hacia la Patagonia.
      </Citable>

      {/* Cifras del ACA */}
      <section className="seccion-chica">
        <div className="contenedor grid gap-3 sm:grid-cols-3">
          {[
            { n: SITIO.fundacionACA, t: "Año de fundación del Automóvil Club Argentino" },
            { n: SITIO.aliancaYPF, t: "Año del primer convenio ACA–YPF" },
            { n: 28, t: "Hoteles propios en la Red Hotelera ACA" },
          ].map((c, i) => (
            <div key={c.t} className="rounded-[var(--radio)] bg-white p-7 shadow-[inset_0_0_0_1px_var(--linea)]" data-reveal data-delay={String(i * 0.08)}>
              <p className="num font-display text-[72px] leading-none font-bold text-acento">
                <span data-contador={c.n}>{c.n}</span>
              </p>
              <p className="mt-3 text-asfalto">{c.t}</p>
            </div>
          ))}
        </div>
        <p className="contenedor mt-4 text-[13px] text-asfalto">Fuentes: aca.org.ar, Boletín Oficial y La Nación.</p>
      </section>

      {/* La red hacia el sur */}
      <section className="oscuro grano relative overflow-hidden seccion">
        <div className="contenedor relative grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="etiqueta" data-reveal>
              La red hacia el sur
            </p>
            <h2 className="t-h2 mt-4 max-w-[12ch]" data-split>
              La primera parada del camino
            </h2>
            <p className="mt-5 max-w-[36ch] text-white/70" data-reveal>
              Desde Bahía Blanca, la Red Hotelera ACA sigue hasta Tierra del Fuego. Si vas a la Patagonia, empezás acá.
            </p>
            <a href={SITIO.aca.red} target="_blank" rel="noopener noreferrer" className="btn btn-claro mt-8" data-reveal>
              <span>Ver toda la red en aca.org.ar</span>
              <span className="burbuja" aria-hidden="true">
                <Icono nombre="flecha" className="size-4" grosor={2} />
              </span>
            </a>
          </div>
          <ol className="relative pl-10">
            <span aria-hidden="true" className="absolute top-3 bottom-3 left-[13px] w-[3px] rounded-full bg-gradient-to-b from-amarillo to-white/15" data-linea style={{ transformOrigin: "top" }} />
            {RED_SUR.map((h, i) => (
              <li key={h.nombre} className="relative border-b border-white/8 py-4" data-reveal data-delay={String(i * 0.04)}>
                <span className={`absolute top-1/2 -left-10 -translate-y-1/2 rounded-full ${h.aca ? "size-[29px] border-[3px] border-amarillo bg-grafito" : "ml-[7px] size-[15px] bg-white/40"}`} />
                <p className={`font-display text-[26px] leading-none font-bold uppercase ${h.aca ? "text-acento" : ""}`}>{h.nombre}</p>
                <p className="text-[14px] text-white/55">{h.lugar}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <OficinaCortesia
        titulo={
          <>
            Si viajás <span className="resalte">trabajando</span>
          </>
        }
        texto="Villa Bordeu tiene una oficina de cortesía con escritorio privado: para una videollamada, mandar unos mails o terminar algo pendiente antes de seguir viaje."
      />

      <FaqLista preguntas={PREGUNTAS} titulo="Para socios" />
      <Cierre titulo="¿Viajás con tu credencial?" modo="viaje" origen="socios-cierre" imagen={foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA")} />
    </>
  );
}
