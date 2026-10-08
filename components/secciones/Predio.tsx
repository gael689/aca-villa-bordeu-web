"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PREDIO } from "@/lib/datos";
import { foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";

const AEREA = foto("predio", "aerea-dia.jpg", "Vista aérea del complejo ACA Villa Bordeu, con la torre, los techos rojos y el parque");

/**
 * Plano del predio sobre la foto aérea. Los puntos se encienden uno por uno
 * (motor: data-pin-grupo); al tocar uno, la ficha cambia con su foto.
 * Sin JS: la foto con la lista debajo.
 */
export function Predio({ titulo = true }: { titulo?: boolean }) {
  const [activo, setActivo] = useState(PREDIO[0].id);
  const p = PREDIO.find((x) => x.id === activo) ?? PREDIO[0];
  const fp = foto(p.foto[0], p.foto[1], p.titulo);

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
            Dormís, comés, entrenás, te reunís y cargás combustible sin salir del complejo. Tocá cada punto del plano.
          </p>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        {/* Plano */}
        <div className="tarjeta relative aspect-[9/5] bg-grafito md:aspect-[9/4.6]" data-pin-grupo>
          <Image src={AEREA.src} alt={AEREA.alt} fill sizes="(min-width: 1024px) 60vw, 100vw" placeholder="blur" blurDataURL={AEREA.blurDataURL} className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          {PREDIO.map((pt, i) => (
            <button
              key={pt.id}
              type="button"
              data-pin-punto
              aria-pressed={pt.id === activo}
              aria-label={pt.titulo}
              onClick={() => setActivo(pt.id)}
              onMouseEnter={() => setActivo(pt.id)}
              className="plano-punto group absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
            >
              <span className="anillo absolute inset-0 rounded-full bg-rojo/60" aria-hidden="true" />
              <span
                className={[
                  "relative grid size-8 place-items-center rounded-full font-display text-[15px] font-bold shadow-[0_6px_18px_-4px_rgb(0_0_0/0.6)] transition-all duration-300 md:size-10 md:text-[17px]",
                  pt.id === activo ? "scale-110 bg-rojo text-white" : "bg-white text-tinta group-hover:bg-rojo group-hover:text-white",
                ].join(" ")}
              >
                {i + 1}
              </span>
            </button>
          ))}
          <p className="absolute bottom-3 left-4 text-[12px] font-semibold text-white/80 md:bottom-4 md:left-5">Vista aérea del complejo</p>
        </div>

        {/* Ficha del punto activo */}
        <div className="tarjeta relative flex min-h-[300px] flex-col justify-end bg-grafito text-white">
          <Image key={fp.src} src={fp.src} alt={fp.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" placeholder="blur" blurDataURL={fp.blurDataURL} className="visor-entra object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div key={p.id} className="paso-entra relative p-5 md:p-7">
            <span className="grid size-11 place-items-center rounded-full bg-rojo">
              <Icono nombre={p.icono} className="size-5" grosor={1.8} />
            </span>
            <h3 className="mt-4 font-display text-[34px] leading-none font-bold uppercase">{p.titulo}</h3>
            <p className="mt-2 max-w-[32ch] text-white/80">{p.texto}</p>
            {p.href && (
              <Link href={p.href} className="enlace mt-4 text-[15px]">
                Ver más
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Lista: en celular es la forma principal de recorrer el plano */}
      <ol className="sin-barra -mx-[var(--gutter)] mt-4 flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:grid lg:grid-cols-8 lg:px-0">
        {PREDIO.map((pt, i) => (
          <li key={pt.id} className="shrink-0">
            <button
              type="button"
              onClick={() => setActivo(pt.id)}
              aria-pressed={pt.id === activo}
              className={[
                "flex h-full w-full items-center gap-2 rounded-2xl px-3.5 py-3 text-left text-[14px] leading-tight font-semibold transition-colors",
                pt.id === activo ? "bg-tinta text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--linea)] hover:bg-hormigon",
              ].join(" ")}
            >
              <span className={`num font-display text-[18px] ${pt.id === activo ? "text-rojo" : "text-asfalto"}`}>{i + 1}</span>
              {pt.titulo}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
