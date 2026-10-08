import Image from "next/image";
import Link from "next/link";
import { PREDIO } from "@/lib/datos";
import { foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";

/**
 * Los lugares del complejo en una grilla compacta: foto, número, nombre y una
 * línea, siempre a la vista. Nada que tocar para entenderlo.
 */
export function Predio({ titulo = true }: { titulo?: boolean }) {
  return (
    <div>
      {titulo && (
        <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-[1fr_1fr] lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              El predio
            </p>
            <h2 className="t-h2 mt-4" data-split>
              Todo en un <span className="rojo-txt">mismo lugar</span>
            </h2>
          </div>
          <p className="lead text-asfalto lg:justify-self-end" data-reveal>
            Dormís, comés, entrenás, te reunís y cargás combustible sin salir del complejo.
          </p>
        </div>
      )}

      <ol className="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
        {PREDIO.map((p, i) => {
          const f = p.foto ? foto(p.foto[0], p.foto[1], p.titulo) : null;
          const contenido = (
            <>
              <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radio)] bg-grafito">
                {f ? (
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    placeholder="blur"
                    blurDataURL={f.blurDataURL}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-pt)] group-hover:scale-105"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-white/70">
                    <Icono nombre={p.icono} className="size-10" grosor={1.3} />
                  </span>
                )}
              </span>
              <span className="mt-4 flex items-baseline gap-2.5">
                <span className="num font-display text-[14px] font-bold text-rojo">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-[clamp(20px,1.8vw,28px)] leading-none font-bold uppercase transition-colors duration-500 group-hover:text-rojo">
                  {p.titulo}
                </span>
              </span>
              <span className="mt-2 block text-[14px] text-asfalto md:text-[15px]">{p.texto}</span>
            </>
          );
          return (
            <li key={p.id} data-reveal data-delay={String((i % 4) * 0.06)}>
              {p.href ? (
                <Link href={p.href} className="group block">
                  {contenido}
                </Link>
              ) : (
                <div className="group">{contenido}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
