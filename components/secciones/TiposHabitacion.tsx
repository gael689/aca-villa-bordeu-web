"use client";

import { useEffect, useState, type KeyboardEvent } from "react";
import { TIPOS, INCLUYE, type TipoHabitacion } from "@/lib/habitaciones";
import { Galeria } from "@/components/galeria/Galeria";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { linkGenerico } from "@/lib/mensaje";

/** Pestañas single / doble / triple. El hash (#doble) elige la pestaña al llegar desde el inicio. */
export function TiposHabitacion() {
  const [actual, setActual] = useState<TipoHabitacion["slug"]>("doble");

  useEffect(() => {
    const leer = () => {
      const h = window.location.hash.replace("#", "");
      if (TIPOS.some((t) => t.slug === h)) setActual(h as TipoHabitacion["slug"]);
    };
    // El hash solo existe en el navegador: se lee al montar.
     
    leer();
    window.addEventListener("hashchange", leer);
    return () => window.removeEventListener("hashchange", leer);
  }, []);

  const elegir = (slug: TipoHabitacion["slug"]) => {
    setActual(slug);
    history.replaceState(null, "", `#${slug}`);
  };

  // Flechas entre pestañas, como piden las pestañas accesibles (solo la elegida entra con Tab).
  const conFlechas = (e: KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    const i = (TIPOS.findIndex((x) => x.slug === actual) + d + TIPOS.length) % TIPOS.length;
    elegir(TIPOS[i].slug);
    document.getElementById(`pestana-${TIPOS[i].slug}`)?.focus();
  };

  return (
    <div>
      {TIPOS.map((x) => (
        <span key={x.slug} id={x.slug} className="block -translate-y-[calc(var(--header-h)+40px)]" aria-hidden="true" />
      ))}
      <div role="tablist" aria-label="Tipo de habitación" onKeyDown={conFlechas} className="relative mb-8 inline-grid grid-cols-3 rounded-full bg-hormigon p-1.5">
        <span
          aria-hidden="true"
          className="absolute inset-y-1.5 left-1.5 w-[calc((100%-12px)/3)] rounded-full bg-tinta transition-transform duration-500 ease-[var(--ease-pt)]"
          style={{ transform: `translateX(${TIPOS.findIndex((x) => x.slug === actual) * 100}%)` }}
        />
        {TIPOS.map((x) => (
          <button
            key={x.slug}
            id={`pestana-${x.slug}`}
            role="tab"
            aria-selected={x.slug === actual}
            aria-controls={`panel-${x.slug}`}
            tabIndex={x.slug === actual ? 0 : -1}
            onClick={() => elegir(x.slug)}
            className={`relative h-12 min-w-[96px] rounded-full px-5 font-display text-[20px] font-bold uppercase transition-colors sm:min-w-[140px] ${x.slug === actual ? "text-white" : "text-asfalto"}`}
          >
            {x.nombre}
          </button>
        ))}
      </div>

      {/* Los tres paneles van en el HTML (los buscadores leen single y triple aunque no estén elegidas); los
          inactivos quedan con `hidden`. Al sacarle el `hidden`, `paso-entra` vuelve a correr como antes. */}
      {TIPOS.map((t) => (
        <div key={t.slug} id={`panel-${t.slug}`} role="tabpanel" aria-labelledby={`pestana-${t.slug}`} hidden={t.slug !== actual} className="paso-entra">
          <Galeria fotos={t.fotos} nombre={`Habitación ${t.nombre}`} prioridad={t.slug === "doble"} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="font-display text-[clamp(48px,6vw,96px)] leading-[0.9] font-bold uppercase">{t.nombre}</h2>
              <p className="mt-2 text-[18px] font-semibold">{t.camas}</p>
              <p className="mt-2 max-w-[44ch] text-asfalto">{t.frase}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {INCLUYE.map((i) => (
                  <li key={i} className="chip">
                    <Icono nombre="check" className="size-3.5 text-acento" grosor={2.6} />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <BotonConsultar modo="viaje" origen={`habitaciones-${t.slug}`}>
                Consultar
              </BotonConsultar>
              <a href={linkGenerico(`una habitación ${t.nombre.toLowerCase()}`)} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja">
                <Icono nombre="whatsapp" className="size-5" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
