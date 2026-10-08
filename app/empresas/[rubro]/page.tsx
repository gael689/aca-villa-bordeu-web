import { notFound } from "next/navigation";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { RUBROS } from "@/lib/rubros";
import { LUGARES } from "@/lib/cerca";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina, TarjetaEnlace } from "@/components/secciones/Comunes";
import { Distancias } from "@/components/secciones/Distancias";

export const dynamicParams = false;

export function generateStaticParams() {
  return RUBROS.map((r) => ({ rubro: r.slug }));
}

const buscar = (slug: string) => RUBROS.find((r) => r.slug === slug);

export async function generateMetadata({ params }: PageProps<"/empresas/[rubro]">) {
  const r = buscar((await params).rubro);
  if (!r) return {};
  return meta({ title: r.title, description: r.description, ruta: `/empresas/${r.slug}` });
}

export default async function PaginaRubro({ params }: PageProps<"/empresas/[rubro]">) {
  const r = buscar((await params).rubro);
  if (!r) notFound();
  const [c, a] = r.foto.split("/");
  const portada = foto(c, a, r.h1);
  const otros = RUBROS.filter((x) => x.slug !== r.slug);
  const cerca = r.cerca ? LUGARES.find((l) => l.slug === r.cerca) : undefined;

  return (
    <>
      <PortadaPagina
        foto={portada}
        etiqueta={`Empresas · ${r.nombre}`}
        titulo={r.h1}
        bajada={r.bajada}
        migas={[
          { nombre: "Empresas", ruta: "/empresas" },
          { nombre: r.nombre, ruta: `/empresas/${r.slug}` },
        ]}
      >
        <BotonConsultar modo="empresa" rubro={r.nombre} origen={`rubro-${r.slug}`}>
          Consultar para mi equipo
        </BotonConsultar>
      </PortadaPagina>

      <Citable>{r.citable}</Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <Distancias lista={r.distancias} titulo="Hasta el trabajo" bajada="Medido desde el predio, por la ruta y sin tránsito." />
        </div>
      </section>

      {/* Necesidades del rubro */}
      <section className="seccion">
        <div className="contenedor">
          <p className="etiqueta" data-reveal>
            Cómo lo resolvemos
          </p>
          <h2 className="t-h2 mt-4 max-w-[16ch]" data-split>
            Lo que necesita tu equipo
          </h2>
          <ul className="mt-12 grid gap-3 md:grid-cols-2">
            {r.necesidades.map((n, i) => (
              <li key={n.titulo} className="rounded-[var(--radio)] bg-white p-7 shadow-[inset_0_0_0_1px_var(--linea)] md:p-9" data-reveal data-delay={String((i % 2) * 0.08)}>
                <p className="num font-display text-[15px] font-bold text-rojo">0{i + 1}</p>
                <p className="mt-3 font-display text-[30px] leading-none font-bold uppercase">{n.titulo}</p>
                <p className="mt-3 text-asfalto">{n.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contexto con fuente */}
      <section className="oscuro grano relative overflow-hidden seccion-chica">
        <div className="contenedor relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
          <span className="grid size-16 place-items-center rounded-full bg-rojo">
            <Icono nombre="casco" className="size-8" grosor={1.6} />
          </span>
          <div>
            <p className="max-w-[44ch] font-display text-[clamp(26px,2.6vw,42px)] leading-[1.05] font-semibold uppercase" data-reveal>
              {r.contexto.texto}
            </p>
            <p className="mt-4 text-[14px] text-white/55" data-reveal>
              Fuente:{" "}
              <a href={r.contexto.url} target="_blank" rel="noopener noreferrer" className="enlace font-normal">
                {r.contexto.fuente}
              </a>
            </p>
          </div>
        </div>
      </section>

      <FaqLista preguntas={r.preguntas} titulo={`Preguntas de ${r.nombre.toLowerCase()}`} />

      <section className="seccion-chica gris">
        <div className="contenedor">
          <p className="etiqueta mb-6">Otros rubros</p>
          <div className="grid gap-3 md:grid-cols-3">
            {otros.map((o) => {
              const [oc, oa] = o.foto.split("/");
              return <TarjetaEnlace key={o.slug} href={`/empresas/${o.slug}`} foto={foto(oc, oa, o.nombre)} titulo={o.nombre} />;
            })}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-[15px]">
            <Link href="/empresas" className="enlace">
              Todo para empresas
            </Link>
            {cerca && (
              <Link href={`/cerca-de/${cerca.slug}`} className="enlace">
                Alojamiento cerca de {cerca.nombre}
              </Link>
            )}
            <Link href="/como-llegar" className="enlace">
              Cómo llegar
            </Link>
          </div>
        </div>
      </section>

      <Cierre modo="empresa" origen={`rubro-${r.slug}-cierre`} />
    </>
  );
}
