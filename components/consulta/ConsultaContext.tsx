"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { linkGenerico, type Modo } from "@/lib/mensaje";

export type AperturaConsulta = {
  modo?: Modo;
  /** rubro o lugar de trabajo precargado (páginas de rubro) */
  rubro?: string;
  /** cantidad de personas precargada (barra de la portada) */
  personas?: number;
  /** fecha de ingreso precargada (barra de la portada), ISO */
  ingreso?: string;
  /** de qué botón vino, para medir */
  origen?: string;
};

type Ctx = {
  abierta: boolean;
  apertura: AperturaConsulta;
  abrir: (a?: AperturaConsulta) => void;
  cerrar: () => void;
};

const ConsultaCtx = createContext<Ctx | null>(null);

export function ConsultaProvider({ children }: { children: ReactNode }) {
  const [abierta, setAbierta] = useState(false);
  const [apertura, setApertura] = useState<AperturaConsulta>({});

  const abrir = useCallback((a: AperturaConsulta = {}) => {
    setApertura(a);
    setAbierta(true);
  }, []);
  const cerrar = useCallback(() => setAbierta(false), []);

  const valor = useMemo(() => ({ abierta, apertura, abrir, cerrar }), [abierta, apertura, abrir, cerrar]);
  return <ConsultaCtx.Provider value={valor}>{children}</ConsultaCtx.Provider>;
}

export function useConsulta() {
  const c = useContext(ConsultaCtx);
  if (!c) throw new Error("useConsulta fuera de ConsultaProvider");
  return c;
}

/**
 * Cualquier «Consultar» del sitio. Es un enlace real a WhatsApp: si el
 * JavaScript no carga, igual lleva al chat con un mensaje genérico.
 */
export function BotonConsultar({
  modo,
  rubro,
  origen = "boton",
  className = "btn",
  children,
  icono = true,
}: {
  modo?: Modo;
  rubro?: string;
  origen?: string;
  className?: string;
  children: ReactNode;
  icono?: boolean;
}) {
  const { abrir } = useConsulta();
  const contexto = modo === "empresa" ? "alojamiento para un equipo de trabajo" : modo === "viaje" ? "una estadía" : undefined;
  return (
    <a
      href={linkGenerico(contexto)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      data-magnetic
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        abrir({ modo, rubro, origen });
      }}
    >
      <span>{children}</span>
      {icono ? (
        <span className="burbuja" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 17L17 7M8 7h9v9" />
          </svg>
        </span>
      ) : null}
    </a>
  );
}
