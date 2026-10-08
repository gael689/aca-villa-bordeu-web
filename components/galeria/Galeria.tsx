"use client";

import { ViewTransition, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";
import { bloquearScroll } from "@/components/motion/scroll";

function Celda({
  f,
  i,
  className,
  sizes,
  priority = false,
  onAbrir,
}: {
  f: Foto;
  i: number;
  className: string;
  sizes: string;
  priority?: boolean;
  onAbrir: (i: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onAbrir(i)}
      aria-label={`Ampliar foto: ${f.alt}`}
      data-cursor="Ampliar"
      className={`group relative block overflow-hidden bg-hormigon ${className}`}
    >
      <Image
        src={f.src}
        alt={f.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={f.blurDataURL}
        className="object-cover transition-[scale] duration-[1.6s] ease-[var(--ease-pt)] group-hover:scale-[1.05]"
      />
    </button>
  );
}

/**
 * Mosaico tipo galería (una grande + cuatro) en escritorio, carrusel con snap
 * en celular, y visor a pantalla completa. La primera foto comparte nombre de
 * transición con la tarjeta del inicio: al entrar, la foto «viaja».
 */
export function Galeria({ fotos, nombre, transicion }: { fotos: Foto[]; nombre: string; transicion?: string }) {
  const [abierta, setAbierta] = useState<number | null>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const inicioX = useRef<number | null>(null);
  const total = fotos.length;

  const cerrar = useCallback(() => setAbierta(null), []);
  const mover = useCallback((d: number) => setAbierta((v) => (v === null ? v : (v + d + total) % total)), [total]);

  useEffect(() => {
    const el = dlg.current;
    if (!el) return;
    if (abierta !== null && !el.open) {
      el.showModal();
      bloquearScroll(true);
    } else if (abierta === null && el.open) {
      el.close();
      bloquearScroll(false);
    }
  }, [abierta]);

  useEffect(() => {
    if (abierta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") mover(1);
      if (e.key === "ArrowLeft") mover(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierta, mover]);

  const actual = abierta !== null ? fotos[abierta] : null;

  return (
    <>
      {/* Escritorio: mosaico */}
      <div className="relative hidden h-[min(72svh,680px)] grid-cols-4 grid-rows-2 gap-2 md:grid">
        {transicion ? (
          <ViewTransition name={transicion}>
            <div className="col-span-2 row-span-2">
              <Celda onAbrir={setAbierta} f={fotos[0]} i={0} className="size-full" sizes="50vw" priority />
            </div>
          </ViewTransition>
        ) : (
          <Celda onAbrir={setAbierta} f={fotos[0]} i={0} className="col-span-2 row-span-2" sizes="50vw" priority />
        )}
        {fotos.slice(1, 5).map((f, k) => (
          <Celda onAbrir={setAbierta} key={f.src} f={f} i={k + 1} className="" sizes="25vw" />
        ))}
        <button
          type="button"
          onClick={() => setAbierta(0)}
          className="btn btn-claro absolute right-5 bottom-5 !min-h-11 !px-5 shadow-[0_10px_30px_-10px_rgb(43_33_24/0.5)]"
        >
          <Icono nombre="mas" className="size-4" /> Ver todas las fotos
        </button>
      </div>

      {/* Celular: carrusel */}
      <div className="sin-barra -mx-[var(--gutter)] flex snap-x snap-mandatory gap-2 overflow-x-auto px-[var(--gutter)] md:hidden">
        {fotos.map((f, i) => (
          <Celda onAbrir={setAbierta} key={f.src} f={f} i={i} className="aspect-[4/5] w-[84vw] shrink-0 snap-center" sizes="84vw" priority={i === 0} />
        ))}
      </div>
      <p className="mt-3 text-[13px] text-tinta/85 md:hidden">Deslizá para ver más · tocá para ampliar</p>

      <dialog
        ref={dlg}
        aria-label={`Fotos de ${nombre}`}
        onCancel={(e) => {
          e.preventDefault();
          cerrar();
        }}
        onClick={(e) => {
          if (e.target === dlg.current) cerrar();
        }}
        className="sobre-grafito visor-entra m-0 size-full max-h-none max-w-none border-0 p-0 backdrop:bg-grafito"
      >
        {actual && (
          <div
            className="relative flex h-dvh w-full flex-col"
            onPointerDown={(e) => (inicioX.current = e.clientX)}
            onPointerUp={(e) => {
              if (inicioX.current === null) return;
              const dx = e.clientX - inicioX.current;
              inicioX.current = null;
              if (Math.abs(dx) > 60) mover(dx < 0 ? 1 : -1);
            }}
          >
            <div className="flex items-center justify-between px-[var(--gutter)] py-4">
              <p className="font-display text-[15px] tracking-[0.14em] uppercase">{nombre}</p>
              <button type="button" onClick={cerrar} aria-label="Cerrar galería" className="grid size-11 place-items-center transition-transform hover:rotate-90">
                <Icono nombre="cerrar" className="size-6" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image key={actual.src} src={actual.src} alt={actual.alt} fill sizes="100vw" quality={82} className="visor-entra object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 px-[var(--gutter)] py-5">
              <p className="max-w-[60ch] text-[14px] text-crema/85">{actual.alt}</p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => mover(-1)}
                  aria-label="Foto anterior"
                  className="grid size-12 place-items-center border border-crema/25 transition-colors hover:border-rojo"
                >
                  <Icono nombre="izq" className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() => mover(1)}
                  aria-label="Foto siguiente"
                  className="grid size-12 place-items-center border border-crema/25 transition-colors hover:border-rojo"
                >
                  <Icono nombre="der" className="size-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
