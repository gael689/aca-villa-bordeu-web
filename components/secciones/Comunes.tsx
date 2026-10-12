import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Pregunta } from "@/lib/tipos";
import type { Foto } from "@/lib/fotos";
import { foto } from "@/lib/fotos";
import { SERVICIOS } from "@/lib/datos";
import { linkGenerico, type Modo } from "@/lib/mensaje";
import { JsonLd, faqJsonLd, migasJsonLd } from "@/lib/schema";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

/** Portada de las páginas internas: foto a sangre, migas, H1 con la búsqueda y bajada. */
export function PortadaPagina({
  foto: f,
  fondo,
  etiqueta,
  titulo,
  bajada,
  migas,
  children,
  alto = "alta",
}: {
  foto?: Foto;
  /** fondo gráfico cuando no hay foto (p. ej. el escudo de ruta gigante) */
  fondo?: ReactNode;
  etiqueta: string;
  titulo: ReactNode;
  bajada?: ReactNode;
  migas: { nombre: string; ruta: string }[];
  children?: ReactNode;
  alto?: "alta" | "media";
}) {
  return (
    <section data-hero className={`relative bg-grafito text-white ${alto === "alta" ? "min-h-[86svh]" : "min-h-[68svh]"} flex`}>
      <div data-hero-ventana className="grano absolute inset-0 overflow-hidden">
        {f ? (
          <>
            <div className="absolute inset-x-0 -inset-y-[8%]" data-parallax="6">
              <Image src={f.src} alt={f.alt} fill priority sizes="100vw" quality={75} placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_11/0.55)_0%,rgb(10_10_11/0.35)_40%,rgb(10_10_11/0.92)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_10_11/0.7)_0%,rgb(10_10_11/0.35)_50%,transparent_85%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,#2a1517_0%,#141516_60%)]" />
            {fondo}
          </>
        )}
      </div>
      <div data-hero-contenido className="contenedor relative flex w-full flex-col justify-end pt-[calc(var(--header-h)+40px)] pb-10 md:pb-16">
        <Migas items={migas} />
        {/* `etiqueta` queda como dato (no se muestra): la portada va sin pre-título. */}
        <h1 className="t-h1 hero-in mt-5 max-w-[18ch] [text-shadow:0_2px_24px_rgb(0_0_0/0.5)]" data-etiqueta={etiqueta} style={{ ["--i" as string]: 1 }}>
          {titulo}
        </h1>
        {bajada && (
          <p className="lead hero-in mt-5 text-white/90 [text-shadow:0_1px_14px_rgb(0_0_0/0.6)]" style={{ ["--i" as string]: 2 }}>
            {bajada}
          </p>
        )}
        {children && (
          <div className="hero-in mt-8 flex flex-wrap gap-3" style={{ ["--i" as string]: 3 }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function Migas({ items }: { items: { nombre: string; ruta: string }[] }) {
  return (
    <>
      <nav aria-label="Migas de pan" className="text-[13px] font-semibold text-white/60">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-white">
              Inicio
            </Link>
          </li>
          {items.map((it, i) => (
            <li key={it.ruta} className="flex items-center gap-1.5">
              <Icono nombre="der" className="size-3" grosor={2.4} />
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-white/90">
                  {it.nombre}
                </span>
              ) : (
                <Link href={it.ruta} className="hover:text-white">
                  {it.nombre}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={migasJsonLd(items)} />
    </>
  );
}

/** Párrafo que se entiende solo: lo que leen y citan los buscadores con IA. */
export function Citable({ children }: { children: ReactNode }) {
  // Los textos largos (rutas, rubros) van más chicos para que no se vuelvan un muro.
  const largo = (Array.isArray(children) ? children.join("") : String(children)).length > 230;
  return (
    <section className="seccion-chica">
      <div className="contenedor">
        <p
          className={`font-display leading-[1.04] font-semibold uppercase ${largo ? "max-w-[58ch] text-[clamp(22px,2.2vw,36px)]" : "max-w-[46ch] text-[clamp(28px,3.2vw,52px)]"}`}
          data-palabras
        >
          {children}
        </p>
      </div>
    </section>
  );
}

export function FaqLista({ preguntas, titulo = "Preguntas frecuentes", etiqueta = "Antes de escribirnos" }: { preguntas: Pregunta[]; titulo?: string; etiqueta?: string }) {
  return (
    <section className="seccion">
      <div className="contenedor grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
          <p className="etiqueta" data-reveal>
            {etiqueta}
          </p>
          <h2 className="t-h2 mt-4" data-split>
            {titulo}
          </h2>
          <p className="mt-5 max-w-[32ch] text-asfalto" data-reveal>
            ¿No está lo que buscás? Escribinos: la recepción atiende las 24 horas.
          </p>
          <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja mt-6" data-reveal>
            <Icono nombre="whatsapp" className="size-5" /> Preguntar por WhatsApp
          </a>
        </div>
        <div className="divide-y divide-[color:var(--linea)] border-y border-[color:var(--linea)]">
          {preguntas.map((q) => (
            <details key={q.p} className="acordeon group">
              <summary className="flex items-center justify-between gap-6 py-5 md:py-6">
                <span className="text-[18px] leading-snug font-semibold md:text-[20px]">{q.p}</span>
                <span className="mas grid size-10 shrink-0 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)]">
                  <Icono nombre="mas" className="size-4" grosor={2.2} />
                </span>
              </summary>
              <p className="max-w-[60ch] pb-6 text-[17px] text-asfalto">{q.r}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqJsonLd(preguntas)} />
    </section>
  );
}

/** Cierre a sangre con la consulta. Va al final de cada página. */
export function Cierre({
  titulo = "¿Cuántos son y desde cuándo?",
  modo,
  origen = "cierre",
  imagen = foto("restaurante", "02-barra-led.jpg", "Barra iluminada de noche"),
}: {
  titulo?: string;
  modo?: Modo;
  origen?: string;
  imagen?: Foto;
}) {
  return (
    <section className="relative overflow-hidden bg-grafito text-white">
      <div className="absolute inset-x-0 -inset-y-[12%]" data-parallax="10">
        <Image src={imagen.src} alt="" fill sizes="100vw" placeholder="blur" blurDataURL={imagen.blurDataURL} className="object-cover opacity-60" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(10_10_11/0.35),rgb(10_10_11/0.85))]" />
      <div className="contenedor relative py-[clamp(110px,16vw,240px)] text-center">
        <p className="etiqueta justify-center !text-white/75" data-reveal>
          Te respondemos por WhatsApp o mail
        </p>
        <h2 className="t-display mx-auto mt-5 max-w-[12ch]" data-split>
          {titulo}
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3" data-reveal>
          <BotonConsultar modo={modo} origen={origen}>
            {modo === "empresa" ? "Consultar para mi equipo" : "Consultar disponibilidad"}
          </BotonConsultar>
          <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja">
            <Icono nombre="whatsapp" className="size-5" /> WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/** Grilla de servicios con íconos que se dibujan. */
export function Servicios({ titulo = "Lo que hay en el predio", oscuro = false }: { titulo?: string; oscuro?: boolean }) {
  return (
    <section className={`seccion ${oscuro ? "oscuro" : "gris"}`}>
      <div className="contenedor">
        <p className="etiqueta" data-reveal>
          Servicios
        </p>
        <h2 className="t-h2 mt-4 max-w-[16ch]" data-split>
          {titulo}
        </h2>
        <ul className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radio)] bg-[color:var(--linea)] md:grid-cols-3 lg:grid-cols-4">
          {SERVICIOS.map((s, i) => (
            <li key={s.titulo} className={`group p-5 transition-colors md:p-7 ${oscuro ? "bg-grafito hover:bg-grafito-2" : "bg-papel hover:bg-white"}`} data-reveal data-delay={String((i % 4) * 0.06)}>
              <span data-dibujar className="block">
                <Icono nombre={s.icono} className="size-9 text-rojo transition-transform duration-500 group-hover:-translate-y-1" grosor={1.4} />
              </span>
              <p className="mt-5 font-display text-[22px] leading-none font-bold uppercase md:text-[26px]">{s.titulo}</p>
              <p className={`mt-2 text-[15px] ${oscuro ? "text-white/60" : "text-asfalto"}`}>{s.texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Tarjeta con foto que lleva a otra página. */
export function TarjetaEnlace({ href, foto: f, titulo, texto }: { href: string; foto: Foto; titulo: string; texto?: string }) {
  return (
    <Link href={href} className="group tarjeta relative flex min-h-[320px] flex-col justify-end bg-grafito text-white" data-clip>
      <Image src={f.src} alt="" fill sizes="(min-width: 1024px) 33vw, 100vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-pt)] group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
      <div className="relative flex items-end justify-between gap-4 p-6">
        <div>
          <p className="font-display text-[30px] leading-none font-bold uppercase">{titulo}</p>
          {texto && <p className="mt-2 text-[15px] text-white/75">{texto}</p>}
        </div>
        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-tinta transition-transform duration-500 ease-[var(--ease-pt)] group-hover:rotate-[-45deg] group-hover:bg-rojo group-hover:text-white">
          <Icono nombre="der" className="size-5" grosor={2} />
        </span>
      </div>
    </Link>
  );
}
