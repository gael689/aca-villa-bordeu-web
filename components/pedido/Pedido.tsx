"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";
import { datosCompletos, fechaCorta, linkWhatsApp, mensajePedido, type Datos, type ItemPedido } from "@/lib/mensaje";
import { SITIO } from "@/lib/sitio";
import { Icono } from "@/components/marca/Icono";
import { bloquearScroll } from "@/components/motion/scroll";
import { conversionAds } from "@/components/layout/GoogleAds";
import { Calendario } from "@/components/consulta/Calendario";
import { Burbuja, Campo, Contador, DatosPersonales, revisarDatos } from "@/components/consulta/Campos";

// «Prepará tu pedido» (pedido del cliente, oct/2026): las empresas que vienen a
// comer arman el pedido desde la carta —platos, cuántos son, día y hora— y lo
// mandan por WhatsApp (asistido: la persona aprieta enviar) o por mail.

const CLAVE = "vb-pedido-v1";

type Ctx = {
  cantidades: Record<string, number>;
  sumar: (plato: string, delta: number) => void;
  total: number;
  /** modo pedido: recién ahí aparecen los «+ Agregar» de la carta */
  armando: boolean;
  empezar: () => void;
  salir: () => void;
  abrir: () => void;
};

const PedidoCtx = createContext<Ctx | null>(null);

function usePedido() {
  const c = useContext(PedidoCtx);
  if (!c) throw new Error("usePedido fuera de PedidoProvider");
  return c;
}

/** Lleva la carta a la vista, al primer capítulo. */
const irALaCarta = () => document.querySelector("#carta > section")?.scrollIntoView({ behavior: "smooth", block: "start" });

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [armando, setArmando] = useState(false);
  const [abierta, setAbierta] = useState(false);

  // Si recarga la página, el pedido sigue ahí (y sigue en modo pedido).
  useEffect(() => {
    try {
      const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? "null");
      if (g && typeof g === "object" && Object.keys(g).length) {
        /* eslint-disable react-hooks/set-state-in-effect */
        setCantidades(g);
        setArmando(true);
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(cantidades));
    } catch {}
  }, [cantidades]);

  const sumar = useCallback((plato: string, delta: number) => {
    setCantidades((c) => {
      const n = Math.max(0, Math.min(99, (c[plato] ?? 0) + delta));
      const sig = { ...c };
      if (n) sig[plato] = n;
      else delete sig[plato];
      return sig;
    });
  }, []);

  const total = Object.values(cantidades).reduce((a, b) => a + b, 0);
  const empezar = useCallback(() => {
    setArmando(true);
    irALaCarta();
    track("pedido_empieza");
  }, []);
  const salir = useCallback(() => {
    setArmando(false);
    setCantidades({});
  }, []);
  const abrir = useCallback(() => {
    setAbierta(true);
    track("pedido_abre");
  }, []);
  const valor = useMemo(() => ({ cantidades, sumar, total, armando, empezar, salir, abrir }), [cantidades, sumar, total, armando, empezar, salir, abrir]);

  return (
    <PedidoCtx.Provider value={valor}>
      <div data-armando={armando || undefined}>{children}</div>
      <BarraPedido oculta={abierta} />
      <PanelPedido abierta={abierta} cerrar={() => setAbierta(false)} />
    </PedidoCtx.Provider>
  );
}

/** Al lado de cada plato: nada hasta empezar el pedido; después «+ Agregar»; con cantidad, un − n +. */
export function BotonPlato({ plato }: { plato: string }) {
  const { cantidades, sumar, armando } = usePedido();
  const n = cantidades[plato] ?? 0;
  if (!armando) return null;
  const base = "grid place-items-center rounded-full transition-colors";
  if (!n)
    return (
      <button
        type="button"
        onClick={() => sumar(plato, 1)}
        aria-label={`Agregar ${plato} al pedido`}
        className="plato-mas flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white/10 pr-4 pl-3 text-[14px] font-semibold text-white [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.3)] transition-colors hover:bg-amarillo hover:text-tinta"
      >
        <Icono nombre="mas" className="size-4" grosor={2.4} />
        Agregar
      </button>
    );
  return (
    <div className="flex shrink-0 items-center gap-1 rounded-full bg-amarillo p-1 text-tinta">
      <button type="button" onClick={() => sumar(plato, -1)} aria-label={`Quitar un ${plato}`} className={`${base} size-8 hover:bg-tinta/10`}>
        <Icono nombre="menos" className="size-4" grosor={2.2} />
      </button>
      <span className="num w-5 text-center font-display text-[18px] font-bold" aria-live="polite">
        {n}
      </span>
      <button type="button" onClick={() => sumar(plato, 1)} aria-label={`Sumar un ${plato}`} className={`${base} size-8 hover:bg-tinta/10`}>
        <Icono nombre="mas" className="size-4" grosor={2.2} />
      </button>
    </div>
  );
}

/**
 * El botón del pedido cambia según el momento: «Empezar mi pedido» (muestra los
 * «+ Agregar»), «Elegí los platos» (lleva a la carta) o «Siguiente» (abre el panel).
 */
export function BotonAbrirPedido({ className = "btn" }: { className?: string }) {
  const { armando, total, empezar, abrir } = usePedido();
  const texto = !armando ? "Empezar mi pedido" : total ? `Siguiente: día y hora (${total})` : "Elegí los platos en la carta";
  return (
    <button type="button" onClick={!armando ? empezar : total ? abrir : irALaCarta} className={className}>
      <span>{texto}</span>
      <span className="burbuja" aria-hidden="true">
        <Icono nombre={armando && !total ? "abajo" : "cubiertos"} className="size-4" grosor={2} />
      </span>
    </button>
  );
}

/** Barra fija mientras se arma el pedido: paso 1 (elegir platos) → «Siguiente». */
function BarraPedido({ oculta }: { oculta: boolean }) {
  const { total, armando, abrir, salir } = usePedido();
  const visible = armando && !oculta;
  return (
    <div
      // En modo pedido, la barra fija del celular se esconde (ver globals.css).
      data-pedido-activo={armando || undefined}
      inert={!visible}
      className={[
        "fixed inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] z-[101] mx-auto max-w-[480px] md:bottom-5",
        "transition-[transform,opacity] duration-500 ease-[var(--ease-pt)]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
      ].join(" ")}
    >
      <div className="flex h-[64px] w-full items-center gap-2 rounded-full bg-amarillo pr-2 pl-2 text-tinta shadow-[0_20px_40px_-16px_rgb(0_0_0/0.6)]">
        <button type="button" onClick={salir} aria-label="Cancelar el pedido" className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-tinta/10">
          <Icono nombre="cerrar" className="size-5" grosor={2} />
        </button>
        {total ? (
          <>
            <span className="flex-1 text-[15px] leading-tight font-semibold">
              {total} {total === 1 ? "plato" : "platos"}
              <span className="block text-[12px] font-medium text-tinta/70">Paso 1 de 2 · listo</span>
            </span>
            <button type="button" onClick={abrir} className="flex h-12 items-center gap-1.5 rounded-full bg-tinta px-5 text-[15px] font-semibold text-white">
              Siguiente <Icono nombre="der" className="size-4" grosor={2} />
            </button>
          </>
        ) : (
          <span className="flex-1 pr-3 text-[15px] leading-tight font-semibold">
            Tocá <span className="whitespace-nowrap">«+ Agregar»</span> en los platos que quieran
            <span className="block text-[12px] font-medium text-tinta/70">Paso 1 de 2 · elegí los platos</span>
          </span>
        )}
      </div>
    </div>
  );
}

type EstadoEnvio = "nada" | "enviando" | "ok" | "error";

function PanelPedido({ abierta, cerrar }: { abierta: boolean; cerrar: () => void }) {
  const { cantidades, sumar, total } = usePedido();
  const dlg = useRef<HTMLDialogElement>(null);
  const trampa = useRef<HTMLInputElement>(null);
  const [cerrando, setCerrando] = useState(false);
  const [personas, setPersonas] = useState(2);
  const [dia, setDia] = useState<Date | null>(null);
  const [hora, setHora] = useState("");
  const [aclaraciones, setAclaraciones] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [datos, setDatos] = useState<Datos>({ nombre: "", telefono: "", email: "" });
  const [intentado, setIntentado] = useState(false);
  const [envio, setEnvio] = useState<EstadoEnvio>("nada");

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    let t: number | undefined;
    if (abierta && !d.open) {
      setCerrando(false);
      setEnvio((e) => (e === "ok" ? "nada" : e));
      d.showModal();
      bloquearScroll(true);
    } else if (!abierta && d.open) {
      setCerrando(true);
      t = window.setTimeout(() => {
        d.close();
        setCerrando(false);
        bloquearScroll(false);
      }, 340);
    }
    return () => window.clearTimeout(t);
  }, [abierta]);

  const items: ItemPedido[] = Object.entries(cantidades).map(([plato, cantidad]) => ({ plato, cantidad }));
  const mensaje = mensajePedido({ personas, dia, hora, items, aclaraciones, empresa, ...datos });

  // Para enviar: al menos un plato (o una aclaración), día, hora y los datos.
  const faltaPlatos = total === 0 && !aclaraciones.trim();
  const faltaCuando = !dia || !hora;
  const listo = !faltaPlatos && !faltaCuando && datosCompletos(datos);

  const revisar = () => {
    setIntentado(true);
    if (faltaPlatos || faltaCuando) {
      document.getElementById(faltaPlatos ? "pedido-platos" : "pedido-cuando")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return false;
    }
    return revisarDatos("pedido", datos);
  };

  async function enviarMail() {
    if (!revisar()) return;
    setEnvio("enviando");
    try {
      const r = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "pedido", mensaje, ...datos, empresa, sitio: trampa.current?.value ?? "" }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setEnvio("ok");
      track("pedido_mail", { platos: total, personas });
      conversionAds("pedido_mail");
    } catch {
      setEnvio("error");
    }
  }

  return (
    <dialog
      ref={dlg}
      className={`consulta ${cerrando ? "cerrando" : ""}`}
      aria-labelledby="pedido-titulo"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onClick={(e) => {
        if (e.target === dlg.current) cerrar();
      }}
    >
      <div className="flex h-full max-h-[94dvh] flex-col md:max-h-none">
        <header className="relative shrink-0 border-b border-[color:var(--linea)] px-5 pt-3 pb-4 md:px-8 md:pt-7">
          <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-tinta/15 md:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="etiqueta">Paso 2 de 2 · cuándo y tus datos</p>
              <h2 id="pedido-titulo" className="mt-1.5 font-display text-[30px] leading-none font-bold uppercase md:text-[36px]">
                Prepará tu pedido
              </h2>
            </div>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="-mr-1 grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)] transition-transform duration-500 hover:rotate-90"
            >
              <Icono nombre="cerrar" className="size-5" grosor={2} />
            </button>
          </div>
        </header>

        <div data-lenis-prevent className="min-h-0 flex-1 space-y-8 overflow-y-auto overscroll-contain px-5 py-6 md:px-8">
          {/* Platos */}
          <section id="pedido-platos" className="scroll-mt-4">
            <h3 className="text-[15px] font-semibold">Platos</h3>
            {items.length ? (
              <ul className="mt-2">
                {items.map((i) => (
                  <li key={i.plato} className="flex items-center justify-between gap-3 border-b border-[color:var(--linea)] py-3">
                    <span className="text-[16px] font-semibold">{i.plato}</span>
                    <span className="flex shrink-0 items-center gap-1">
                      <button type="button" onClick={() => sumar(i.plato, -1)} aria-label={`Quitar un ${i.plato}`} className="grid size-9 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)]">
                        <Icono nombre="menos" className="size-4" grosor={2} />
                      </button>
                      <span className="num w-7 text-center font-display text-xl font-bold">{i.cantidad}</span>
                      <button type="button" onClick={() => sumar(i.plato, 1)} aria-label={`Sumar un ${i.plato}`} className="grid size-9 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)]">
                        <Icono nombre="mas" className="size-4" grosor={2} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`mt-2 rounded-2xl bg-white p-4 text-[15px] shadow-[inset_0_0_0_1px_var(--linea)] ${intentado && faltaPlatos ? "text-error" : "text-asfalto"}`}>
                Todavía no elegiste platos. Cerrá este panel y tocá <strong>«+ Agregar»</strong> en los platos de la carta.
              </p>
            )}
            <div className="mt-4">
              <Campo
                etiqueta="Variantes o aclaraciones (opcional)"
                valor={aclaraciones}
                onCambiar={setAclaraciones}
                placeholder="Ej.: 2 ravioles a la bolognesa y 1 sin sal"
                largo
              />
            </div>
          </section>

          {/* Cuántos y cuándo */}
          <section id="pedido-cuando" className="scroll-mt-4">
            <Contador etiqueta="¿Cuántos son?" valor={personas} min={1} max={200} onCambiar={setPersonas} grande />
            <h3 className="mt-6 mb-3 text-[15px] font-semibold">¿Qué día?</h3>
            <Calendario entrada={dia} salida={null} onElegir={(e, s) => setDia(s ?? e)} />
            <p className={`mt-3 text-sm ${intentado && !dia ? "text-error" : "text-asfalto"}`} aria-live="polite">
              {dia ? (
                <>
                  Día: <strong className="text-tinta">{fechaCorta(dia)}</strong>
                </>
              ) : (
                "Elegí el día en el calendario."
              )}
            </p>
            <div className="mt-5 max-w-[220px]">
              <Campo id="pedido-hora" etiqueta="¿A qué hora?" tipo="time" valor={hora} onCambiar={setHora} requerido error={intentado && !hora ? "Elegí la hora." : undefined} />
            </div>
          </section>

          {/* Datos */}
          <section className="space-y-3">
            <DatosPersonales prefijo="pedido" datos={datos} onCambiar={setDatos} mostrarErrores={intentado} />
            <div className="pt-2">
              <Campo etiqueta="Empresa (opcional)" valor={empresa} onCambiar={setEmpresa} auto="organization" />
            </div>
          </section>

          {items.length > 0 && <Burbuja texto={mensaje} titulo="Así nos llega tu pedido" />}

          {/* Trampa para robots: invisible para las personas. */}
          <input ref={trampa} type="text" name="sitio" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          {envio === "error" && (
            <p className="text-sm text-error" role="alert">
              No se pudo enviar. Probá por WhatsApp o escribinos a {SITIO.mail}.
            </p>
          )}
          {envio === "ok" && (
            <div className="flex items-start gap-3 rounded-2xl bg-tinta p-5 text-white" role="status">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-wpp">
                <Icono nombre="check" className="size-5" grosor={2.4} />
              </span>
              <p>
                <strong className="block font-display text-2xl uppercase">Recibimos tu pedido</strong>
                Te lo confirmamos a {datos.email.trim()} lo antes posible.
              </p>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-[color:var(--linea)] bg-papel px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
          {!listo && <p className="mb-2.5 text-[13px] text-asfalto">Para enviar: platos, día, hora y tus datos.</p>}
          <div className="grid gap-2.5 sm:grid-cols-[1.4fr_1fr]">
            <a
              href={linkWhatsApp(mensaje)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                if (!revisar()) {
                  e.preventDefault();
                  return;
                }
                track("pedido_whatsapp", { platos: total, personas });
                conversionAds("pedido_whatsapp");
              }}
              className="btn btn-wpp sin-burbuja w-full"
            >
              <Icono nombre="whatsapp" className="size-5" />
              Enviar por WhatsApp
            </a>
            <button
              type="button"
              onClick={() => void enviarMail()}
              disabled={envio === "enviando" || envio === "ok"}
              className="btn btn-fantasma sin-burbuja w-full disabled:opacity-50"
            >
              <Icono nombre="sobre" className="size-5" />
              {envio === "enviando" ? "Enviando…" : envio === "ok" ? "Enviado" : "Por mail"}
            </button>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
