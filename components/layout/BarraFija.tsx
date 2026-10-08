"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Icono } from "@/components/marca/Icono";
import { linkGenerico } from "@/lib/mensaje";
import { MAPAS } from "@/lib/sitio";

/**
 * Celular: barra flotante abajo con WhatsApp y Consultar, pasada la portada.
 * Escritorio: un botón de WhatsApp flotante en la esquina.
 * En las páginas de empresas, la consulta arranca en modo empresa.
 */
export function BarraFija() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const empresa = pathname.startsWith("/empresas") || pathname.startsWith("/cerca-de") || pathname === "/sala-de-reuniones";

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const fin = document.documentElement.scrollHeight - window.innerHeight - window.scrollY < 260;
        setVisible(window.scrollY > Math.min(480, window.innerHeight * 0.6) && !fin);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return (
    <>
      <div
        className={[
          "fixed inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] z-[100] md:hidden",
          "transition-[transform,opacity] duration-600 ease-[var(--ease-pt)]",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
        ].join(" ")}
        inert={!visible}
      >
        <div className="vidrio-oscuro flex gap-2 rounded-full p-1.5 shadow-[0_20px_40px_-16px_rgb(0_0_0/0.6)]">
          <a
            href={linkGenerico()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp"
            className="grid h-12 w-14 shrink-0 place-items-center rounded-full bg-wpp text-white"
          >
            <Icono nombre="whatsapp" className="size-6" />
          </a>
          <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" aria-label="Cómo llegar" className="grid h-12 w-14 shrink-0 place-items-center rounded-full bg-white/12 text-white">
            <Icono nombre="pin" className="size-6" grosor={1.8} />
          </a>
          <BotonConsultar modo={empresa ? "empresa" : undefined} origen="barra" className="btn flex-1 !min-h-12 !px-4" icono={false}>
            {empresa ? "Consultar estadía" : "Consultar"}
          </BotonConsultar>
        </div>
      </div>

      <a
        href={linkGenerico()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escribir por WhatsApp"
        className={[
          "group fixed right-5 bottom-5 z-[100] hidden h-14 items-center gap-0 rounded-full bg-wpp pr-4 pl-4 text-white shadow-[0_18px_40px_-14px_rgb(31_168_85/0.7)] md:flex",
          "transition-all duration-500 ease-[var(--ease-pt)] hover:gap-2.5 hover:pr-5",
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-8 opacity-0",
        ].join(" ")}
      >
        <Icono nombre="whatsapp" className="size-6" />
        <span className="max-w-0 overflow-hidden text-[15px] font-semibold whitespace-nowrap transition-[max-width] duration-500 ease-[var(--ease-pt)] group-hover:max-w-[160px]">
          Escribinos
        </span>
      </a>
    </>
  );
}
