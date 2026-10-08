"use client";

import { useState } from "react";
import { useConsulta } from "@/components/consulta/ConsultaContext";
import { Icono } from "@/components/marca/Icono";
import { linkGenerico, type Modo } from "@/lib/mensaje";

const hoyISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * La barra de consulta sobre la portada (el patrón de cualquier hotel: fechas
 * y huéspedes a mano). Sin precios: abre la consulta con lo cargado.
 */
export function BarraHero() {
  const { abrir } = useConsulta();
  const [modo, setModo] = useState<Modo>("empresa");
  const [personas, setPersonas] = useState(10);
  const [fecha, setFecha] = useState("");

  return (
    <form
      action={linkGenerico()}
      onSubmit={(e) => {
        e.preventDefault();
        abrir({ modo, personas, ingreso: fecha ? `${fecha}T00:00:00` : undefined, origen: "barra-portada" });
      }}
      className="vidrio-oscuro grid grid-cols-2 gap-1.5 rounded-[24px] p-1.5 text-white shadow-[0_30px_60px_-30px_rgb(0_0_0/0.7)] [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.12)] md:flex md:items-stretch md:rounded-full"
    >
      <fieldset className="col-span-2 flex rounded-full bg-white/8 p-1 md:col-span-1">
        <legend className="sr-only">Motivo</legend>
        {(["empresa", "viaje"] as Modo[]).map((m) => (
          <label
            key={m}
            className={`flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold whitespace-nowrap transition-colors md:flex-none ${modo === m ? "bg-white text-tinta" : "text-white/80 hover:text-white"}`}
          >
            <input type="radio" name="modo" value={m} checked={modo === m} onChange={() => {
                setModo(m);
                setPersonas(m === "viaje" ? 2 : 10);
              }} className="sr-only" />
            <Icono nombre={m === "empresa" ? "casco" : "ruta"} className="size-4" grosor={2} />
            {m === "empresa" ? "Trabajo" : "Viaje"}
          </label>
        ))}
      </fieldset>

      <div className="flex items-center justify-between gap-2 rounded-[18px] bg-white/8 px-4 py-2 md:min-w-[190px] md:rounded-full">
        <span className="text-[12px] leading-tight font-semibold text-white/60">
          {modo === "empresa" ? "Personas" : "Huéspedes"}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" aria-label="Menos" onClick={() => setPersonas((n) => Math.max(1, n - 1))} className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">
            <Icono nombre="menos" className="size-3.5" grosor={2.4} />
          </button>
          <span className="num w-8 text-center font-display text-[22px] font-bold" aria-live="polite">
            {personas}
          </span>
          <button type="button" aria-label="Más" onClick={() => setPersonas((n) => Math.min(200, n + 1))} className="grid size-8 place-items-center rounded-full bg-white/10 hover:bg-white/20">
            <Icono nombre="mas" className="size-3.5" grosor={2.4} />
          </button>
        </div>
      </div>

      <label className="flex flex-col justify-center rounded-[18px] bg-white/8 px-4 py-1.5 md:min-w-[180px] md:rounded-full">
        <span className="text-[12px] leading-tight font-semibold text-white/60">{modo === "empresa" ? "Llegan el" : "Entrada"}</span>
        <input
          type="date"
          min={hoyISO()}
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          className="w-full bg-transparent text-[15px] font-semibold text-white outline-none [color-scheme:dark]"
        />
      </label>

      <button type="submit" className="btn col-span-2 !min-h-[52px] md:ml-auto md:!min-h-0">
        <span>Consultar</span>
        <span className="burbuja" aria-hidden="true">
          <Icono nombre="flecha" className="size-4" grosor={2} />
        </span>
      </button>
    </form>
  );
}
