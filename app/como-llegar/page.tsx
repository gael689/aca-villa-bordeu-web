import Link from "next/link";
import { meta } from "@/lib/meta";
import { MAPAS, SITIO } from "@/lib/sitio";
import { RUTAS } from "@/lib/rutas";
import { LUGARES } from "@/lib/cerca";
import { DISTANCIAS_ZONA } from "@/lib/datos";
import { Escudo } from "@/components/marca/Escudo";
import { Icono } from "@/components/marca/Icono";
import { Cierre, Citable, PortadaPagina } from "@/components/secciones/Comunes";
import { Distancias } from "@/components/secciones/Distancias";
import { MapaAlTocar } from "@/components/secciones/MapaAlTocar";

export const metadata = meta({
  title: "Cómo llegar a ACA Villa Bordeu · Rutas 3, 33 y 35",
  description:
    "ACA Villa Bordeu está en el acceso de las rutas 3 y 33, al suroeste de Bahía Blanca. Distancias, cómo llegar desde cada ciudad y el GPS en un toque.",
  ruta: "/como-llegar",
});

export default function ComoLlegar() {
  return (
    <>
      <PortadaPagina
        fondo={
          <div aria-hidden="true" className="absolute top-[14%] -right-[18%] bottom-[4%] flex gap-4 text-white/[0.07] sm:right-[2%] md:gap-8" data-parallax="8">
            <Escudo numero="3" className="h-full w-auto" />
            <Escudo numero="33" className="hidden h-full w-auto md:block" />
          </div>
        }
        etiqueta="Cómo llegar"
        titulo={
          <>
            En el cruce de <span className="text-rojo">las rutas</span>
          </>
        }
        bajada={`${SITIO.direccion.calle}, ${SITIO.direccion.acceso}. Al suroeste de Bahía Blanca, sin entrar al centro.`}
        alto="media"
        migas={[{ nombre: "Cómo llegar", ruta: "/como-llegar" }]}
      >
        <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="btn">
          <span>Abrir en Google Maps</span>
          <span className="burbuja" aria-hidden="true">
            <Icono nombre="pin" className="size-4" grosor={2} />
          </span>
        </a>
        <a href={MAPAS.waze} target="_blank" rel="noopener noreferrer" className="btn btn-claro">
          <span>Abrir en Waze</span>
          <span className="burbuja" aria-hidden="true">
            <Icono nombre="ruta" className="size-4" grosor={2} />
          </span>
        </a>
      </PortadaPagina>

      <Citable>
        ACA Villa Bordeu está en el suroeste de Bahía Blanca, donde se cruzan las rutas nacionales 3, 33, 22 y 35: a 8 km del centro, 7 km de General Cerri y
        12 km del Polo Petroquímico.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <MapaAlTocar />
        </div>
      </section>

      <section className="seccion-chica">
        <div className="contenedor">
          <Distancias />
        </div>
      </section>

      {/* Desde cada ruta */}
      <section className="seccion">
        <div className="contenedor">
          <p className="etiqueta" data-reveal>
            Desde tu ciudad
          </p>
          <h2 className="t-h2 mt-4 max-w-[14ch]" data-split>
            Elegí por dónde venís
          </h2>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RUTAS.map((r, i) => (
              <li key={r.slug} data-reveal data-delay={String(i * 0.06)}>
                <Link href={`/como-llegar/${r.slug}`} className="group flex h-full flex-col justify-between gap-10 rounded-[var(--radio)] bg-grafito p-7 text-white transition-transform duration-500 ease-[var(--ease-pt)] hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <Escudo numero={r.rutaNacional} className="h-16 w-auto text-white" />
                    <Icono nombre="flecha" className="size-6 text-white/50 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-rojo" grosor={2} />
                  </div>
                  <div>
                    <p className="font-display text-[34px] leading-none font-bold uppercase">Desde {r.origen}</p>
                    <p className="num mt-2 text-white/60">
                      {r.km} km · {r.horas}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            <li data-reveal>
              <div className="flex h-full flex-col justify-between gap-6 rounded-[var(--radio)] bg-rojo p-7 text-white">
                <p className="font-display text-[30px] leading-none font-bold uppercase">Cerca del trabajo</p>
                <ul className="space-y-2">
                  {LUGARES.map((l) => (
                    <li key={l.slug}>
                      <Link href={`/cerca-de/${l.slug}`} className="flex items-center justify-between gap-3 border-b border-white/25 pb-2 font-semibold">
                        {l.nombre}
                        <span className="num text-white/75">{l.distancia.km} km</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* La zona */}
      <section className="seccion gris">
        <div className="contenedor grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="etiqueta" data-reveal>
              Si venís de la zona
            </p>
            <h2 className="t-h2 mt-4 max-w-[12ch]" data-split>
              Para no meterte en el centro
            </h2>
            <p className="mt-5 max-w-[34ch] text-asfalto" data-reveal>
              Médicos, trámites o un evento en Bahía: llegás por la ruta, dejás el auto en la puerta y al otro día volvés.
            </p>
          </div>
          <ul className="divide-y divide-[color:var(--linea)] border-y border-[color:var(--linea)]">
            {DISTANCIAS_ZONA.map((d) => (
              <li key={d.lugar} className="flex items-center justify-between gap-4 py-4" data-reveal>
                <span className="font-display text-[24px] leading-none font-bold uppercase">{d.lugar}</span>
                <span className="num text-right">
                  <span className="font-display text-[28px] font-bold text-rojo">{d.km}</span> km
                  <span className="ml-3 text-asfalto">~{d.min} min</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cierre titulo="¿Para cuándo venís?" origen="llegar-cierre" />
    </>
  );
}
