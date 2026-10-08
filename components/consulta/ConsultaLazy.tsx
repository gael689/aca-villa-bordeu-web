"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useConsulta } from "./ConsultaContext";

// El panel (con su calendario) no hace falta para el primer pintado. Se trae
// cuando el navegador está ocioso, así el clic en «Consultar» es instantáneo
// pero no compite con la carga inicial.
const Consulta = dynamic(() => import("./Consulta").then((m) => m.Consulta), { ssr: false });

export function ConsultaLazy() {
  const { abierta } = useConsulta();
  const [ocioso, setOcioso] = useState(false);

  useEffect(() => {
    const listo = () => setOcioso(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(listo, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(listo, 2500);
    return () => window.clearTimeout(id);
  }, []);

  return ocioso || abierta ? <Consulta /> : null;
}
