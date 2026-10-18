import { notFound } from "next/navigation";
import Link from "next/link";
import { meta } from "@/lib/meta";
import { LUGARES } from "@/lib/cerca";
import { RUBROS } from "@/lib/rubros";
import { MAPAS } from "@/lib/sitio";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina } from "@/components/secciones/Comunes";

export const dynamicParams = false;

export function generateStaticParams() {
  return LUGARES.map((l) => ({ lugar: l.slug }));
}

const buscar = (slug: string) => LUGARES.find((l) => l.slug === slug);

export async function generateMetadata({ params }: PageProps<"/cerca-de/[lugar]">) {
  const l = buscar((await params).lugar);
  if (!l) return {};
  return meta({ title: l.title, description: l.description, ruta: `/cerca-de/${l.slug}` });
}

export default async function PaginaLugar({ params }: PageProps<"/cerca-de/[lugar]">) {
  const l = buscar((await params).lugar);
  if (!l) notFound();
  const rubro = l.rubro ? RUBROS.find((r) => r.slug === l.rubro) : undefined;
  const otros = LUGARES.filter((x) => x.slug !== l.slug);
  const empresa = !!rubro;

  return (
    <>
      <PortadaPagina
        fondo={
          <p aria-hidden="true" className="absolute right-[4%] bottom-[8%] font-display text-[min(38vw,420px)] leading-none font-bold text-white/[0.06]" data-parallax="8">
            {l.distancia.km}km
          </p>
        }
        etiqueta={`Cerca ${l.nombreCon}`}
        titulo={l.h1}
        bajada={l.bajada}
        alto="media"
        migas={[{ nombre: `Cerca ${l.nombreCon}`, ruta: `/cerca-de/${l.slug}` }]}
      >
        <BotonConsultar modo={empresa ? "empresa" : undefined} rubro={empresa ? l.nombre : undefined} origen={`cerca-${l.slug}`}>
          Consultar disponibilidad
        </BotonConsultar>
      </PortadaPagina>

      {/* Distancia destacada */}
      <section className="seccion-chica">
        <div className="contenedor">
          <div className="cartel flex flex-wrap items-center justify-between gap-6 p-6 text-white md:p-10">
            <div>
              <p className="text-[13px] font-semibold tracking-[0.16em] text-white/50 uppercase">Desde Villa Bordeu hasta</p>
              <p className="font-display text-[clamp(32px,4vw,56px)] leading-none font-bold uppercase">{l.distancia.lugar}</p>
            </div>
            <div className="flex items-end gap-8">
              <p className="num font-display text-[clamp(64px,8vw,120px)] leading-none font-bold text-acento">
                <span data-contador={l.distancia.km}>{l.distancia.km}</span>
                <span className="ml-1 text-[24px] text-white/60">km</span>
              </p>
              <p className="pb-2 text-white/70">~{l.distancia.min} min</p>
            </div>
          </div>
        </div>
      </section>

      <Citable>{l.citable}</Citable>

      <section className="seccion-chica">
        <div className="contenedor grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5 text-[18px] leading-relaxed">
            {l.textos.map((p) => (
              <p key={p.slice(0, 30)} data-reveal>
                {p}
              </p>
            ))}
            <div className="flex flex-wrap gap-2.5 pt-3" data-reveal>
              <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="btn btn-oscuro sin-burbuja">
                <Icono nombre="pin" className="size-5" /> Cómo llegar al predio
              </a>
            </div>
          </div>
          <div className="self-start rounded-[var(--radio)] bg-white p-7 shadow-[inset_0_0_0_1px_var(--linea)] md:p-9" data-reveal>
            <p className="etiqueta">Le sirve a</p>
            <ul className="mt-5 space-y-3">
              {l.paraQuien.map((q) => (
                <li key={q} className="flex gap-3">
                  <Icono nombre="check" className="mt-1 size-5 shrink-0 text-acento" grosor={2.4} />
                  <span>{q}</span>
                </li>
              ))}
            </ul>
            {rubro && (
              <Link href={`/empresas/${rubro.slug}`} className="enlace mt-6 text-[15px]">
                Alojamiento para {rubro.nombre.toLowerCase()}
              </Link>
            )}
          </div>
        </div>
      </section>

      <FaqLista preguntas={l.preguntas} titulo={`Cerca ${l.nombreCon}`} />

      <section className="seccion-chica gris">
        <div className="contenedor">
          <p className="etiqueta mb-6">Otros lugares cerca</p>
          <ul className="grid gap-2 md:grid-cols-3">
            {otros.map((o) => (
              <li key={o.slug}>
                <Link href={`/cerca-de/${o.slug}`} className="group flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-[inset_0_0_0_1px_var(--linea)] transition-colors hover:bg-grafito hover:text-white">
                  <span>
                    <span className="block font-display text-[24px] leading-none font-bold uppercase">{o.nombre}</span>
                    <span className="num text-[14px] opacity-70">
                      {o.distancia.km} km · ~{o.distancia.min} min
                    </span>
                  </span>
                  <Icono nombre="flecha" className="size-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" grosor={2} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Cierre modo={empresa ? "empresa" : undefined} origen={`cerca-${l.slug}-cierre`} />
    </>
  );
}
