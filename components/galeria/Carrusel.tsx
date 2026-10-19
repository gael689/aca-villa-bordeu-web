"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icono } from "@/components/marca/Icono";

/**
 * Tira horizontal de fotos con flechas: con mouse no hay forma cómoda de
 * desplazarla de costado (pedido de Gael, 19/10/2026). En el celular se sigue
 * deslizando con el dedo.
 */
export function Carrusel({ children, className = "" }: { children: ReactNode; className?: string }) {
  const pista = useRef<HTMLDivElement>(null);
  const [borde, setBorde] = useState({ inicio: true, fin: false });

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const medir = () => setBorde({ inicio: el.scrollLeft <= 4, fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    window.addEventListener("resize", medir);
    return () => {
      el.removeEventListener("scroll", medir);
      window.removeEventListener("resize", medir);
    };
  }, []);

  const mover = (sentido: 1 | -1) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: sentido * el.clientWidth * 0.7, behavior: "smooth" });
  };

  const flecha = "grid size-12 place-items-center rounded-full bg-white text-tinta shadow-[inset_0_0_0_1px_var(--linea)] transition hover:shadow-[inset_0_0_0_1.5px_var(--color-amarillo-hondo)] disabled:opacity-30";
  return (
    <div>
      <div ref={pista} className={className}>
        {children}
      </div>
      <div className="mt-4 flex justify-end gap-2 px-[var(--gutter)]">
        <button type="button" onClick={() => mover(-1)} disabled={borde.inicio} aria-label="Fotos anteriores" className={flecha}>
          <Icono nombre="izq" className="size-5" />
        </button>
        <button type="button" onClick={() => mover(1)} disabled={borde.fin} aria-label="Fotos siguientes" className={flecha}>
          <Icono nombre="der" className="size-5" />
        </button>
      </div>
    </div>
  );
}
