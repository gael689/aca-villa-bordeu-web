"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MENU } from "@/lib/navegacion";
import { foto } from "@/lib/fotos";
import { SITIO, telLink } from "@/lib/sitio";
import { linkGenerico } from "@/lib/mensaje";
import { Lockup } from "@/components/marca/Logo";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { bloquearScroll } from "@/components/motion/scroll";

/**
 * Encabezado flotante. Sobre la portada es transparente y claro; al bajar se
 * vuelve una píldora de vidrio. Siempre fijo: nunca se esconde.
 */
export function Header() {
  const pathname = usePathname();
  const [arriba, setArriba] = useState(true);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const cierreMega = useRef<number | undefined>(undefined);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setArriba(window.scrollY < 40);
      });
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Al navegar se cierran los menús. Ajuste de estado al cambiar la ruta, sin efecto.
  const [rutaPrevia, setRutaPrevia] = useState(pathname);
  if (rutaPrevia !== pathname) {
    setRutaPrevia(pathname);
    setMenu(false);
    setMega(false);
  }

  useEffect(() => {
    bloquearScroll(menu);
  }, [menu]);

  const claro = arriba && !menu;
  const activo = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-[110]"
      >
        <div className={`transition-[padding] duration-500 ease-[var(--ease-pt)] ${claro ? "px-0 pt-0" : "px-2 pt-2 md:px-4 md:pt-3"}`}>
          <div
            className={[
              "mx-auto flex h-[var(--header-h)] max-w-[1680px] items-center justify-between gap-4 transition-all duration-500 ease-[var(--ease-pt)]",
              claro
                ? "px-[var(--gutter)] text-white"
                : menu
                  ? "rounded-[22px] px-4 text-white md:px-6"
                  : "vidrio h-[64px] rounded-[22px] px-4 text-tinta shadow-[0_18px_40px_-24px_rgb(0_0_0/0.45),inset_0_0_0_1px_rgb(255_255_255/0.6)] md:px-6",
            ].join(" ")}
          >
            <Link href="/" aria-label="ACA Villa Bordeu, inicio" className="shrink-0">
              <Lockup tono={claro || menu ? "claro" : "oscuro"} />
            </Link>

            <nav aria-label="Principal" className="hidden items-center gap-1 min-[1100px]:flex">
              {MENU.map((m) =>
                m.hijos ? (
                  <div
                    key={m.href}
                    className="relative"
                    onMouseEnter={() => {
                      window.clearTimeout(cierreMega.current);
                      setMega(true);
                    }}
                    onMouseLeave={() => {
                      cierreMega.current = window.setTimeout(() => setMega(false), 160);
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={mega}
                      onClick={() => setMega((v) => !v)}
                      className={`flex h-10 items-center gap-1.5 rounded-full px-4 text-[15px] font-semibold whitespace-nowrap transition-colors ${claro ? "hover:bg-white/12" : "hover:bg-tinta/6"} ${activo(m.href) || m.hijos.some((h) => activo(h.href)) ? (claro ? "text-amarillo" : "text-dorado") : ""}`}
                    >
                      {m.texto}
                      <Icono nombre="der" className={`size-3.5 transition-transform duration-300 ${mega ? "-rotate-90" : "rotate-90"}`} grosor={2.2} />
                    </button>
                    {mega && (
                      <div className="mega absolute top-full left-1/2 w-[640px] -translate-x-1/2 pt-3">
                        <div className="grid grid-cols-[1fr_1.1fr] gap-2 rounded-[24px] bg-white p-2 text-tinta shadow-[0_30px_70px_-30px_rgb(0_0_0/0.5)]">
                          <ul className="p-1">
                            {m.hijos.map((h) => (
                              <li key={h.href}>
                                <Link
                                  href={h.href}
                                  className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-papel"
                                >
                                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-papel text-acento transition-colors group-hover:bg-amarillo group-hover:text-tinta">
                                    {h.icono && <Icono nombre={h.icono} className="size-5" grosor={1.7} />}
                                  </span>
                                  <span>
                                    <span className="block text-[15px] leading-tight font-semibold">{h.texto}</span>
                                    <span className="block text-[13px] text-asfalto">{h.detalle}</span>
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <div className="relative overflow-hidden rounded-[18px]">
                            {(() => {
                              const f = foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio de Villa Bordeu");
                              return <Image src={f.src} alt="" fill sizes="340px" className="object-cover" placeholder="blur" blurDataURL={f.blurDataURL} />;
                            })()}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            <p className="absolute inset-x-4 bottom-4 font-display text-[26px] leading-none font-bold text-white uppercase">
                              Todo en
                              <br />
                              un mismo predio
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={m.href}
                    href={m.href}
                    aria-current={activo(m.href) ? "page" : undefined}
                    className={`flex h-10 items-center rounded-full px-4 text-[15px] font-semibold whitespace-nowrap transition-colors ${claro ? "hover:bg-white/12" : "hover:bg-tinta/6"} ${activo(m.href) ? (claro ? "text-amarillo" : "text-dorado") : ""}`}
                  >
                    {m.texto}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={linkGenerico()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Escribir por WhatsApp"
                className="hidden size-11 place-items-center rounded-full bg-wpp text-white transition-[filter] hover:brightness-110 sm:grid"
              >
                <Icono nombre="whatsapp" className="size-5" />
              </a>
              <BotonConsultar origen="encabezado" className="btn hidden !min-h-11 !text-[14px] md:inline-flex">
                Reservas
              </BotonConsultar>
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                aria-expanded={menu}
                aria-controls="menu-movil"
                aria-label={menu ? "Cerrar menú" : "Abrir menú"}
                className={`relative grid size-11 place-items-center rounded-full min-[1100px]:hidden ${claro || menu ? "bg-white/12" : "bg-tinta/6"}`}
              >
                <span className={`absolute h-[2px] w-5 rounded bg-current transition-transform duration-500 ease-[var(--ease-pt)] ${menu ? "rotate-45" : "-translate-y-[4px]"}`} />
                <span className={`absolute h-[2px] w-5 rounded bg-current transition-transform duration-500 ease-[var(--ease-pt)] ${menu ? "-rotate-45" : "translate-y-[4px]"}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {menu && (
        <div id="menu-movil" className="menu-movil fixed inset-0 z-[105] overflow-y-auto bg-grafito text-white min-[1100px]:hidden" data-lenis-prevent>
          <div className="flex min-h-full flex-col px-[var(--gutter)] pt-[calc(var(--header-h)+24px)] pb-[max(24px,env(safe-area-inset-bottom))]">
            <nav aria-label="Menú" className="flex-1">
              <ul>
                {[{ href: "/", texto: "Inicio" }, ...MENU.filter((m) => !m.hijos), ...(MENU.find((m) => m.hijos)?.hijos ?? [])].map((m, i) => (
                  <li key={m.href + m.texto} className="item border-b border-white/10" style={{ ["--i" as string]: i }}>
                    <Link
                      href={m.href}
                      className={`flex items-center justify-between py-3.5 font-display text-[34px] leading-none font-bold uppercase sm:text-[42px] ${activo(m.href) ? "text-acento" : ""}`}
                    >
                      {m.texto}
                      <Icono nombre="flecha" className="size-6 text-white/40" grosor={1.8} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="item mt-8 grid gap-2.5" style={{ ["--i" as string]: 11 }}>
              <BotonConsultar origen="menu" className="btn w-full">
                Reservas
              </BotonConsultar>
              <div className="grid grid-cols-2 gap-2.5">
                <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja">
                  <Icono nombre="whatsapp" className="size-5" /> WhatsApp
                </a>
                <a href={telLink} className="btn btn-fantasma sin-burbuja">
                  <Icono nombre="telefono" className="size-5" /> Llamar
                </a>
              </div>
              <p className="mt-3 flex items-center gap-2 text-sm text-white/60">
                <span className="punto-vivo" aria-hidden="true" /> Recepción abierta las 24 horas · {SITIO.telefono}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
