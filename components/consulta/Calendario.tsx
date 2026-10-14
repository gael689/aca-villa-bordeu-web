"use client";

import { useState } from "react";
import { Icono } from "@/components/marca/Icono";

const mesAnio = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" });
const diaLargo = new Intl.DateTimeFormat("es-AR", { weekday: "long", day: "numeric", month: "long" });
const SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

const mismoDia = (a: Date | null, b: Date) => !!a && a.getTime() === b.getTime();
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function hoyLocal() {
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

/** Calendario de rango (entrada → salida), en español, semana desde el lunes. */
export function Calendario({
  entrada,
  salida,
  onElegir,
}: {
  entrada: Date | null;
  salida: Date | null;
  onElegir: (entrada: Date | null, salida: Date | null) => void;
}) {
  const hoy = hoyLocal();
  const base = entrada ?? hoy;
  const [cursor, setCursor] = useState({ y: base.getFullYear(), m: base.getMonth() });

  const primero = new Date(cursor.y, cursor.m, 1);
  const vacios = (primero.getDay() + 6) % 7;
  const diasMes = new Date(cursor.y, cursor.m + 1, 0).getDate();
  const esMesActual = cursor.y === hoy.getFullYear() && cursor.m === hoy.getMonth();
  const limite = new Date(hoy.getFullYear(), hoy.getMonth() + 17, 1);
  const esUltimo = cursor.y === limite.getFullYear() && cursor.m === limite.getMonth();

  const mover = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };

  const elegir = (dia: Date) => {
    if (!entrada || (entrada && salida)) return onElegir(dia, null);
    if (dia.getTime() <= entrada.getTime()) return onElegir(dia, null);
    onElegir(entrada, dia);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => mover(-1)}
          disabled={esMesActual}
          aria-label="Mes anterior"
          className="grid size-10 place-items-center rounded-full text-tinta transition hover:bg-hormigon disabled:opacity-25"
        >
          <Icono nombre="izq" className="size-5" />
        </button>
        <p className="font-display text-[19px] font-bold uppercase" aria-live="polite">
          {cap(mesAnio.format(primero))}
        </p>
        <button
          type="button"
          onClick={() => mover(1)}
          disabled={esUltimo}
          aria-label="Mes siguiente"
          className="grid size-10 place-items-center rounded-full text-tinta transition hover:bg-hormigon disabled:opacity-25"
        >
          <Icono nombre="der" className="size-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center" role="grid" aria-label="Elegí entrada y salida">
        {SEMANA.map((d) => (
          <span key={d} className="pb-2 text-[11px] font-medium tracking-[0.2em] text-acento" role="columnheader">
            {d}
          </span>
        ))}
        {Array.from({ length: vacios }).map((_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: diasMes }).map((_, i) => {
          const dia = new Date(cursor.y, cursor.m, i + 1);
          const pasado = dia.getTime() < hoy.getTime();
          const esE = mismoDia(entrada, dia);
          const esS = mismoDia(salida, dia);
          const enRango = !!entrada && !!salida && dia > entrada && dia < salida;
          const esHoy = mismoDia(hoy, dia);
          return (
            <div
              key={i}
              role="gridcell"
              className={[
                "relative py-0.5",
                enRango ? "bg-hormigon" : "",
                esE && salida ? "bg-gradient-to-r from-transparent from-50% to-hormigon to-50%" : "",
                esS ? "bg-gradient-to-l from-transparent from-50% to-hormigon to-50%" : "",
              ].join(" ")}
            >
              <button
                type="button"
                disabled={pasado}
                onClick={() => elegir(dia)}
                aria-label={diaLargo.format(dia)}
                aria-pressed={esE || esS}
                className={[
                  "relative mx-auto grid size-10 place-items-center rounded-full text-[15px] transition-colors",
                  pasado ? "text-tinta/25" : "cursor-pointer hover:bg-hormigon",
                  esE || esS ? "!bg-grafito text-crema" : "",
                  esHoy && !esE && !esS ? "ring-1 ring-acento ring-inset" : "",
                ].join(" ")}
              >
                {i + 1}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
