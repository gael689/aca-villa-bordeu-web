"use client";

import { useEffect, useState } from "react";

const hora = () =>
  new Intl.DateTimeFormat("es-AR", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Argentina/Buenos_Aires" }).format(new Date());

/** «Abierto ahora · 21:47»: la recepción atiende las 24 horas. La hora es la de Bahía Blanca. */
export function CartelVivo({ className = "" }: { className?: string }) {
  const [h, setH] = useState<string | null>(null);
  useEffect(() => {
    // La hora solo existe en el navegador; en el servidor se muestra sin hora.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setH(hora());
    const id = window.setInterval(() => setH(hora()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span
      className={`chip !bg-black/35 !text-white backdrop-blur-md [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.14)] ${className}`}
      aria-label="Recepción abierta las 24 horas"
    >
      <span className="punto-vivo" aria-hidden="true" />
      Abierto ahora
      {h && <span className="num text-white/60">· {h}</span>}
    </span>
  );
}
