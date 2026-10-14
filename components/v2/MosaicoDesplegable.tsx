"use client";

import { useId, useState, type ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export type TileExtra = { clave: string; clase: string; contenido: ReactNode };

/**
 * Grilla del mosaico con el botón «Y más…». Los tiles vienen renderizados del
 * servidor; acá solo se decide si los extra se ven. Están siempre en el HTML
 * (Google los lee), ocultos con `hidden` hasta que se toca el botón.
 */
export function MosaicoDesplegable({ principales, extras, className }: { principales: ReactNode; extras: TileExtra[]; className: string }) {
  const [abierto, setAbierto] = useState(false);
  const id = useId();
  return (
    <ul className={className}>
      {principales}
      <li className="col-span-2 lg:col-span-1">
        <button
          type="button"
          aria-expanded={abierto}
          aria-controls={id}
          onClick={() => setAbierto((a) => !a)}
          className="group flex size-full items-center justify-between gap-4 rounded-[var(--radio)] bg-amarillo p-5 text-left text-tinta transition-colors duration-500 hover:bg-amarillo-hondo md:p-6 lg:flex-col lg:items-start"
        >
          <span>
            <span className="block font-display text-[clamp(26px,2.4vw,38px)] leading-none font-bold uppercase">{abierto ? "Ver menos" : "Y más…"}</span>
            <span className="mt-1.5 block text-[14px] text-white/85">{abierto ? "Volver al resumen" : "Oficina de cortesía, sala, tienda y más"}</span>
          </span>
          <span className={`grid size-12 shrink-0 place-items-center rounded-full bg-white/20 transition-transform duration-500 lg:self-end ${abierto ? "" : "group-hover:rotate-90"}`}>
            {abierto ? <Minus className="size-6" aria-hidden="true" /> : <Plus className="size-6" aria-hidden="true" />}
          </span>
        </button>
      </li>
      {extras.map((t, i) => (
        <li
          key={t.clave}
          id={i === 0 ? id : undefined}
          hidden={!abierto}
          className={`tile-in ${t.clase}`}
          style={{ ["--i" as string]: i }}
        >
          {t.contenido}
        </li>
      ))}
    </ul>
  );
}
