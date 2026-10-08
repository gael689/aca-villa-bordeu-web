import { notFound } from "next/navigation";
import Link from "next/link";
import { meta } from "@/lib/meta";
import { RUTAS } from "@/lib/rutas";
import { MAPAS } from "@/lib/sitio";
import { Escudo } from "@/components/marca/Escudo";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina } from "@/components/secciones/Comunes";

export const dynamicParams = false;

export function generateStaticParams() {
  return RUTAS.map((r) => ({ ruta: r.slug }));
}

const buscar = (slug: string) => RUTAS.find((r) => r.slug === slug);

export async function generateMetadata({ params }: PageProps<"/como-llegar/[ruta]">) {
  const r = buscar((await params).ruta);
  if (!r) return {};
  return meta({ title: r.title, description: r.description, ruta: `/como-llegar/${r.slug}` });
}

export default async function PaginaRuta({ params }: PageProps<"/como-llegar/[ruta]">) {
  const r = buscar((await params).ruta);
  if (!r) notFound();
  const otras = RUTAS.filter((x) => x.slug !== r.slug);

  return (
    <>
      <PortadaPagina
        fondo={
          <div aria-hidden="true" className="absolute top-[14%] -right-[18%] bottom-[4%] text-white/[0.08] sm:right-[4%]" data-parallax="8">
            <Escudo numero={r.rutaNacional} className="h-full w-auto" />
          </div>
        }
        etiqueta={`Cómo llegar · Ruta Nacional ${r.rutaNacional}`}
        titulo={r.h1}
        bajada={r.bajada}
        alto="media"
        migas={[
          { nombre: "Cómo llegar", ruta: "/como-llegar" },
          { nombre: `Desde ${r.origen}`, ruta: `/como-llegar/${r.slug}` },
        ]}
      >
        <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="btn">
          <span>Abrir en el GPS</span>
          <span className="burbuja" aria-hidden="true">
            <Icono nombre="pin" className="size-4" grosor={2} />
          </span>
        </a>
        <BotonConsultar modo="viaje" origen={`ruta-${r.slug}`} className="btn btn-claro">
          Consultar disponibilidad
        </BotonConsultar>
      </PortadaPagina>

      {/* El viaje en números */}
      <section className="seccion-chica">
        <div className="contenedor">
          <div className="cartel grid gap-px overflow-hidden text-white sm:grid-cols-3">
            <div className="flex items-center gap-5 p-6 md:p-8">
              <Escudo numero={r.rutaNacional} className="h-16 w-auto text-white" dibujar />
              <div>
                <p className="text-[13px] font-semibold tracking-[0.16em] text-white/50 uppercase">Desde</p>
                <p className="font-display text-[34px] leading-none font-bold uppercase">{r.origen}</p>
              </div>
            </div>
            <div className="border-white/10 p-6 sm:border-l md:p-8">
              <p className="text-[13px] font-semibold tracking-[0.16em] text-white/50 uppercase">Distancia</p>
              <p className="num font-display text-[52px] leading-none font-bold text-ambar">
                <span data-contador={r.km}>{r.km}</span>
                <span className="ml-1 text-[20px] text-white/60">km</span>
              </p>
            </div>
            <div className="border-white/10 p-6 sm:border-l md:p-8">
              <p className="text-[13px] font-semibold tracking-[0.16em] text-white/50 uppercase">Manejando</p>
              <p className="font-display text-[52px] leading-none font-bold text-ambar">{r.horas}</p>
              <p className="text-[13px] text-white/50">sin tránsito ni paradas</p>
            </div>
          </div>
        </div>
      </section>

      <Citable>{r.citable}</Citable>

      {/* El recorrido */}
      <section className="seccion">
        <div className="contenedor grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="etiqueta" data-reveal>
              El recorrido
            </p>
            <h2 className="t-h2 mt-4 max-w-[12ch]" data-split>
              Paso a paso por la ruta
            </h2>
            {/* Línea de ruta con las localidades */}
            <ol className="relative mt-10 space-y-5 pl-8">
              <span aria-hidden="true" className="absolute top-2 bottom-2 left-[9px] w-[3px] origin-top rounded-full bg-rojo" data-linea style={{ transformOrigin: "top" }} />
              <li className="relative" data-reveal>
                <span className="absolute top-1.5 -left-8 size-[21px] rounded-full border-[3px] border-rojo bg-papel" />
                <p className="font-display text-[22px] font-bold uppercase">{r.origen}</p>
              </li>
              {r.pasaPor.map((l, i) => (
                <li key={l} className="relative" data-reveal data-delay={String(i * 0.05)}>
                  <span className="absolute top-2 -left-[27px] size-[11px] rounded-full bg-rojo" />
                  <p className="text-[17px] font-semibold text-asfalto">{l}</p>
                </li>
              ))}
              <li className="relative" data-reveal>
                <span className="absolute top-1 -left-8 grid size-[21px] place-items-center rounded-full bg-rojo text-white">
                  <Icono nombre="pin" className="size-3" grosor={2.6} />
                </span>
                <p className="font-display text-[22px] font-bold text-rojo uppercase">ACA Villa Bordeu</p>
              </li>
            </ol>
          </div>
          <div className="space-y-5 text-[18px] leading-relaxed">
            {r.recorrido.map((p) => (
              <p key={p.slice(0, 30)} data-reveal>
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-2.5 pt-4" data-reveal>
              <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="btn btn-oscuro sin-burbuja">
                <Icono nombre="pin" className="size-5" /> Google Maps
              </a>
              <a href={MAPAS.waze} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma sin-burbuja">
                <Icono nombre="ruta" className="size-5" /> Waze
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Por qué parar acá */}
      <section className="oscuro grano relative overflow-hidden seccion">
        <div className="contenedor relative">
          <p className="etiqueta" data-reveal>
            Por qué parar acá
          </p>
          <h2 className="t-h2 mt-4 max-w-[14ch]" data-split>
            Sin entrar a la ciudad
          </h2>
          <ul className="mt-12 grid gap-3 md:grid-cols-3">
            {r.porQueParar.map((t, i) => (
              <li key={t.slice(0, 20)} className="rounded-[var(--radio)] bg-white/[0.05] p-7 text-white/85 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.08)]" data-reveal data-delay={String(i * 0.08)}>
                <p className="num font-display text-[40px] leading-none font-bold text-ambar">0{i + 1}</p>
                <p className="mt-4">{t}</p>
              </li>
            ))}
          </ul>
          {r.siguiente && (
            <p className="mt-10 max-w-[60ch] rounded-[var(--radio)] bg-rojo p-6 text-[17px] md:p-8" data-reveal>
              <strong className="block font-display text-[24px] uppercase">¿Seguís viaje?</strong>
              {r.siguiente}{" "}
              <Link href="/socios-aca" className="enlace">
                Ver la Red ACA
              </Link>
            </p>
          )}
        </div>
      </section>

      <FaqLista preguntas={r.preguntas} titulo={`Viajando desde ${r.origen}`} />

      <section className="seccion-chica gris">
        <div className="contenedor">
          <p className="etiqueta mb-6">Desde otras ciudades</p>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {otras.map((o) => (
              <li key={o.slug}>
                <Link href={`/como-llegar/${o.slug}`} className="group flex items-center gap-4 rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_var(--linea)] transition-colors hover:bg-grafito hover:text-white">
                  <Escudo numero={o.rutaNacional} className="h-12 w-auto shrink-0" />
                  <span className="font-display text-[22px] leading-none font-bold uppercase">Desde {o.origen}</span>
                  <Icono nombre="flecha" className="ml-auto size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" grosor={2} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cierre titulo="Parás y descansás" modo="viaje" origen={`ruta-${r.slug}-cierre`} />
    </>
  );
}
