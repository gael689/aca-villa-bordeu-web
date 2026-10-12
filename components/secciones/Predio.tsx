import Image from "next/image";
import Link from "next/link";
import { PREDIO } from "@/lib/datos";
import { foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";

/**
 * Los lugares del predio como un índice: número, nombre grande, una línea y
 * la foto siempre a la vista. Nada que tocar para entenderlo.
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
            Dormís, comés, entrenás, te reunís y cargás combustible sin salir del predio.
          </p>
        </div>
      )}

      <ol className="border-t border-[color:var(--linea)]">
        {PREDIO.map((p, i) => {
          const f = p.foto ? foto(p.foto[0], p.foto[1], p.titulo) : null;
          const fila = (
            <>
              <span className="num font-display text-[15px] font-bold text-rojo md:text-[17px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="min-w-0">
                <span className="block font-display text-[clamp(26px,3.2vw,52px)] leading-[0.95] font-bold uppercase transition-colors duration-500 group-hover:text-rojo">
                  {p.titulo}
                </span>
                <span className="mt-2 block max-w-[46ch] text-[15px] text-asfalto md:text-base">{p.texto}</span>
              </span>
              <span className="relative aspect-[4/3] w-[96px] shrink-0 overflow-hidden rounded-2xl bg-grafito sm:w-[150px] lg:w-[220px]">
                {f ? (
                  <Image
                    src={f.src}
                    alt={f.alt}
                    fill
                    sizes="(min-width: 1024px) 220px, 150px"
                    placeholder="blur"
                    blurDataURL={f.blurDataURL}
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-pt)] group-hover:scale-110"
                  />
                ) : (
                  <span className="grid size-full place-items-center text-white/70">
                    <Icono nombre={p.icono} className="size-9" grosor={1.3} />
                  </span>
                )}
              </span>
            </>
          );
          const clase = "group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-[color:var(--linea)] py-5 sm:gap-8 md:py-7";
          return (
            <li key={p.id} data-reveal data-delay={String(i * 0.05)}>
              {p.href ? (
                <Link href={p.href} className={clase}>
                  {fila}
                </Link>
              ) : (
                <div className={clase}>{fila}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
