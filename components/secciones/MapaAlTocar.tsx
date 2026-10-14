"use client";

import { useState } from "react";
import { MAPAS } from "@/lib/sitio";
import { Icono } from "@/components/marca/Icono";

/** El mapa de Google se carga recién al tocar: no pesa al abrir la página. */
export function MapaAlTocar() {
  const [cargado, setCargado] = useState(false);
  return (
    <div className="tarjeta relative aspect-[4/3] bg-grafito md:aspect-[16/9]">
      {cargado ? (
        <iframe src={MAPAS.embed} title="Mapa de ACA Villa Bordeu" className="absolute inset-0 size-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      ) : (
        <button type="button" onClick={() => setCargado(true)} className="group absolute inset-0 grid place-items-center overflow-hidden text-white">
          <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgb(241_187_1/0.3),transparent_45%),repeating-linear-gradient(0deg,transparent_0_38px,rgb(255_255_255/0.05)_38px_39px),repeating-linear-gradient(90deg,transparent_0_38px,rgb(255_255_255/0.05)_38px_39px)]" />
          <span className="relative flex flex-col items-center gap-4">
            <span className="relative grid size-16 place-items-center rounded-full bg-amarillo text-tinta">
              <span className="absolute inset-0 animate-ping rounded-full bg-amarillo/50" />
              <Icono nombre="pin" className="relative size-7" grosor={2} />
            </span>
            <span className="font-display text-[26px] font-bold uppercase">Ver el mapa</span>
          </span>
        </button>
      )}
    </div>
  );
}
