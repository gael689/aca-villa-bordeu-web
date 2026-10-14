"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";
import {
  ESTADIAS,
  NECESIDADES,
  fechaCorta,
  linkWhatsApp,
  mensajeEmpresa,
  mensajeViaje,
  noches,
  type Estadia,
  type Modo,
  type Necesidad,
} from "@/lib/mensaje";
import { SITIO } from "@/lib/sitio";
import { Icono, type IconoNombre } from "@/components/marca/Icono";
import { bloquearScroll } from "@/components/motion/scroll";
import { conversionAds } from "@/components/layout/GoogleAds";
import { Calendario } from "./Calendario";
import { useConsulta } from "./ConsultaContext";

const CLAVE = "vb-consulta-v1";
const PASOS: Record<Modo, string[]> = {
  empresa: ["Equipo", "Cuándo", "Qué necesitan", "Enviar"],
  viaje: ["Cuándo", "Quiénes", "Enviar"],
};
const ICONO_NECESIDAD: Record<Necesidad, IconoNombre> = {
  Desayuno: "taza",
  "Almuerzo o vianda": "cubiertos",
  Cena: "luna",
  Lavandería: "lavarropas",
  "Cochera para vehículos": "camion",
  "Sala de reuniones": "reunion",
};

const aFecha = (s: string | null | undefined) => {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
};
const hoy0 = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

/** Escribe el mensaje como si se estuviera tipeando; solo la primera vez que aparece. */
function Burbuja({ texto }: { texto: string }) {
  const [n, setN] = useState<number>(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches ? Infinity : 0,
  );
  useEffect(() => {
    if (n === Infinity) return;
    const paso = Math.max(1, Math.ceil(texto.length / 40));
    const id = window.setInterval(() => {
      setN((v) => {
        const sig = v + paso;
        if (sig >= texto.length) {
          window.clearInterval(id);
          return Infinity;
        }
        return sig;
      });
    }, 16);
    return () => window.clearInterval(id);
    // Solo al montar: los cambios posteriores del texto se muestran de golpe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <figure className="relative">
      <figcaption className="mb-2 text-[13px] font-semibold text-asfalto">Así nos llega tu consulta</figcaption>
      <div className="relative rounded-[18px] rounded-tl-[4px] bg-[#e2f4e8] px-4 py-3.5 text-[15px] leading-relaxed whitespace-pre-line text-tinta shadow-[0_1px_0_rgb(0_0_0/0.05)]">
        <span aria-hidden="true" className="invisible block">
          {texto}
        </span>
        <span className="absolute inset-0 px-4 py-3.5" aria-label={texto}>
          {texto.slice(0, n)}
          {n !== Infinity && (
            <span className="ml-px inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-tinta align-baseline" aria-hidden="true" />
          )}
        </span>
      </div>
    </figure>
  );
}

function Contador({
  etiqueta,
  ayuda,
  valor,
  min,
  max,
  onCambiar,
  grande = false,
}: {
  etiqueta: string;
  ayuda?: string;
  valor: number;
  min: number;
  max: number;
  onCambiar: (v: number) => void;
  grande?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--linea)] py-4">
      <div>
        <p className="text-[17px] font-semibold">{etiqueta}</p>
        {ayuda && <p className="text-sm text-asfalto">{ayuda}</p>}
      </div>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onCambiar(Math.max(min, valor - 1))}
          disabled={valor <= min}
          aria-label={`Menos ${etiqueta.toLowerCase()}`}
          className="grid size-11 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)] transition hover:shadow-[inset_0_0_0_1.5px_var(--color-amarillo-hondo)] disabled:opacity-30"
        >
          <Icono nombre="menos" className="size-4" grosor={2} />
        </button>
        <span className={`num text-center font-display font-bold ${grande ? "w-14 text-4xl" : "w-10 text-2xl"}`} aria-live="polite">
          {valor}
        </span>
        <button
          type="button"
          onClick={() => onCambiar(Math.min(max, valor + 1))}
          disabled={valor >= max}
          aria-label={`Más ${etiqueta.toLowerCase()}`}
          className="grid size-11 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)] transition hover:shadow-[inset_0_0_0_1.5px_var(--color-amarillo-hondo)] disabled:opacity-30"
        >
          <Icono nombre="mas" className="size-4" grosor={2} />
        </button>
      </div>
    </div>
  );
}

function Opcion({
  activa,
  onClick,
  children,
  rol = "checkbox",
}: {
  activa: boolean;
  onClick: () => void;
  children: ReactNode;
  rol?: "checkbox" | "radio";
}) {
  return (
    <button
      type="button"
      role={rol}
      aria-checked={activa}
      onClick={onClick}
      className={[
        "flex min-h-12 items-center gap-2.5 rounded-2xl px-4 py-2.5 text-left text-[15px] font-semibold transition-all duration-300",
        activa
          ? "bg-tinta text-white shadow-[0_10px_24px_-14px_rgb(0_0_0/0.6)]"
          : "bg-white text-tinta shadow-[inset_0_0_0_1px_var(--linea)] hover:shadow-[inset_0_0_0_1.5px_var(--color-amarillo-hondo)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function Interruptor({ etiqueta, ayuda, icono, valor, onCambiar }: { etiqueta: string; ayuda?: string; icono: IconoNombre; valor: boolean; onCambiar: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-[color:var(--linea)] py-4">
      <span>
        <span className="flex items-center gap-2 text-[16px] font-semibold">
          <Icono nombre={icono} className="size-5 text-acento" /> {etiqueta}
        </span>
        {ayuda && <span className="block text-sm text-asfalto">{ayuda}</span>}
      </span>
      <input type="checkbox" checked={valor} onChange={(e) => onCambiar(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-7 w-12 shrink-0 rounded-full bg-hormigon transition-colors peer-checked:bg-amarillo peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tinta after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-300 peer-checked:after:translate-x-5"
      />
    </label>
  );
}

type EstadoEnvio = "nada" | "form" | "enviando" | "ok" | "error";

export function Consulta() {
  const { abierta, apertura, cerrar } = useConsulta();
  const dlg = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const [cerrando, setCerrando] = useState(false);
  const [modo, setModo] = useState<Modo>("empresa");
  const [paso, setPaso] = useState(0);
  const [atras, setAtras] = useState(false);

  // Empresa
  const [personas, setPersonas] = useState(10);
  const [ingreso, setIngreso] = useState<Date | null>(null);
  const [estadia, setEstadia] = useState<Estadia | null>(null);
  const [necesidades, setNecesidades] = useState<Necesidad[]>(["Desayuno", "Cochera para vehículos"]);
  const [empresa, setEmpresa] = useState("");
  const [rubro, setRubro] = useState("");
  // Viaje
  const [entrada, setEntrada] = useState<Date | null>(null);
  const [salida, setSalida] = useState<Date | null>(null);
  const [sinFechas, setSinFechas] = useState(false);
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [socio, setSocio] = useState(false);
  const [mascota, setMascota] = useState(false);
  const [adaptado, setAdaptado] = useState(false);
  // Común
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [envio, setEnvio] = useState<EstadoEnvio>("nada");
  const trampa = useRef<HTMLInputElement>(null);
  const formMail = useRef<HTMLFormElement>(null);

  // Abrir / cerrar el <dialog> nativo según el contexto.
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    let t: number | undefined;

    if (abierta && !d.open) {
      // Al abrir se restaura lo guardado en sessionStorage y lo que trae el botón:
      // es la sincronización con el <dialog> nativo, que vive fuera de React.
      /* eslint-disable react-hooks/set-state-in-effect */
      try {
        const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? "null");
        if (g) {
          setModo(g.modo ?? "empresa");
          setPersonas(g.personas ?? 10);
          const i = aFecha(g.ingreso);
          setIngreso(i && i >= hoy0() ? i : null);
          setEstadia(g.estadia ?? null);
          setNecesidades(g.necesidades ?? []);
          setEmpresa(g.empresa ?? "");
          setRubro(g.rubro ?? "");
          const e = aFecha(g.entrada);
          const vig = !!e && e >= hoy0();
          setEntrada(vig ? e : null);
          setSalida(vig ? aFecha(g.salida) : null);
          setSinFechas(!!g.sinFechas);
          setAdultos(g.adultos || 2);
          setNinos(g.ninos || 0);
          setSocio(!!g.socio);
          setMascota(!!g.mascota);
          setAdaptado(!!g.adaptado);
          setNombre(g.nombre ?? "");
          setContacto(g.contacto ?? "");
        }
      } catch {}
      if (apertura.modo) setModo(apertura.modo);
      if (apertura.rubro) setRubro(apertura.rubro);
      if (apertura.personas) {
        if (apertura.modo === "viaje") setAdultos(Math.min(12, apertura.personas));
        else setPersonas(apertura.personas);
      }
      const ing = aFecha(apertura.ingreso);
      if (ing) {
        setIngreso(ing);
        setEntrada(ing);
      }
      setAtras(false);
      setPaso(0);
      setEnvio("nada");
      setCerrando(false);
      /* eslint-enable react-hooks/set-state-in-effect */
      d.showModal();
      bloquearScroll(true);
      track("consulta_abre", { origen: apertura.origen ?? "?", modo: apertura.modo ?? "?" });
    } else if (!abierta && d.open) {
      setCerrando(true);
      t = window.setTimeout(() => {
        d.close();
        setCerrando(false);
        bloquearScroll(false);
      }, 340);
    }
    return () => window.clearTimeout(t);
  }, [abierta, apertura]);

  // Guardar el estado: si cierra el panel y lo vuelve a abrir, sigue ahí.
  useEffect(() => {
    if (!abierta) return;
    try {
      sessionStorage.setItem(
        CLAVE,
        JSON.stringify({
          modo, personas, ingreso, estadia, necesidades, empresa, rubro,
          entrada, salida, sinFechas, adultos, ninos, socio, mascota, adaptado, nombre, contacto,
        }),
      );
    } catch {}
  }, [abierta, modo, personas, ingreso, estadia, necesidades, empresa, rubro, entrada, salida, sinFechas, adultos, ninos, socio, mascota, adaptado, nombre, contacto]);

  useEffect(() => {
    if (abierta) titulo.current?.focus({ preventScroll: true });
  }, [paso, abierta, modo]);

  const pasos = PASOS[modo];
  const ultimo = paso === pasos.length - 1;
  const ir = (n: number) => {
    setAtras(n < paso);
    setPaso(n);
    setEnvio((e) => (e === "ok" ? e : "nada"));
  };
  const cambiarModo = (m: Modo) => {
    if (m === modo) return;
    setModo(m);
    setAtras(false);
    setPaso(0);
    setEnvio("nada");
  };

  const puedeSeguir =
    modo === "empresa"
      ? paso === 1
        ? !!estadia || !!ingreso
        : true
      : paso === 0
        ? sinFechas || (!!entrada && !!salida)
        : true;

  const mensaje = useMemo(
    () =>
      modo === "empresa"
        ? mensajeEmpresa({ personas, ingreso, estadia, necesidades, empresa, nombre, rubro })
        : mensajeViaje({ entrada: sinFechas ? null : entrada, salida: sinFechas ? null : salida, adultos, ninos, socio, mascota, adaptado, nombre }),
    [modo, personas, ingreso, estadia, necesidades, empresa, nombre, rubro, entrada, salida, sinFechas, adultos, ninos, socio, mascota, adaptado],
  );

  const datosMedicion = () => ({
    modo,
    personas: modo === "empresa" ? personas : adultos + ninos,
    origen: apertura.origen ?? "panel",
  });

  async function enviarMail() {
    if (contacto.trim().length < 6) return;
    setEnvio("enviando");
    try {
      const r = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo, mensaje, nombre, contacto, empresa, sitio: trampa.current?.value ?? "" }),
      });
      if (!r.ok) throw new Error(String(r.status));
      setEnvio("ok");
      track("consulta_mail", datosMedicion());
      conversionAds("consulta_mail");
    } catch {
      setEnvio("error");
    }
  }

  // Al elegir «Por mail», el formulario aparece debajo de la vista previa: lo traemos a la vista.
  useEffect(() => {
    if (envio === "form") formMail.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [envio]);

  const claseEntra = atras ? "paso-entra-atras" : "paso-entra";
  const nNoches = noches(entrada, salida);

  return (
    <dialog
      ref={dlg}
      className={`consulta ${cerrando ? "cerrando" : ""}`}
      aria-labelledby="consulta-titulo"
      onCancel={(e) => {
        e.preventDefault();
        cerrar();
      }}
      onClick={(e) => {
        if (e.target === dlg.current) cerrar();
      }}
    >
      <div className="flex h-full max-h-[94dvh] flex-col md:max-h-none">
        <header className="relative shrink-0 px-5 pt-3 pb-4 md:px-8 md:pt-7">
          <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-tinta/15 md:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="etiqueta">Sin compromiso</p>
              <h2
                id="consulta-titulo"
                ref={titulo}
                tabIndex={-1}
                className="mt-1.5 font-display text-[30px] leading-none font-bold uppercase outline-none md:text-[36px]"
              >
                {modo === "empresa" ? "Tu equipo, en un lugar" : "Contanos tu viaje"}
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

          <div role="radiogroup" aria-label="Tipo de consulta" className="relative mt-4 grid grid-cols-2 rounded-full bg-hormigon p-1">
            <span
              aria-hidden="true"
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-[0_4px_14px_-6px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-[var(--ease-pt)]"
              style={{ transform: modo === "viaje" ? "translateX(100%)" : "none" }}
            />
            {(["empresa", "viaje"] as Modo[]).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={modo === m}
                onClick={() => cambiarModo(m)}
                className={`relative flex h-11 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition-colors ${modo === m ? "text-tinta" : "text-asfalto"}`}
              >
                <Icono nombre={m === "empresa" ? "casco" : "ruta"} className="size-[18px]" grosor={1.8} />
                {m === "empresa" ? "Vengo por trabajo" : "Estoy de viaje"}
              </button>
            ))}
          </div>

          <ol className="mt-4 flex gap-1.5" aria-label="Pasos">
            {pasos.map((p, i) => (
              <li key={p} className="flex-1" aria-current={i === paso ? "step" : undefined}>
                <button type="button" onClick={() => i < paso && ir(i)} disabled={i >= paso} className="block w-full text-left disabled:cursor-default">
                  <span className={`block h-[3px] rounded-full transition-colors duration-500 ${i <= paso ? "bg-amarillo" : "bg-tinta/12"}`} />
                  <span className={`mt-1.5 block text-[12px] font-semibold ${i === paso ? "text-tinta" : "text-asfalto"}`}>{p}</span>
                </button>
              </li>
            ))}
          </ol>
        </header>

        <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 md:px-8">
          <div key={`${modo}-${paso}`} className={claseEntra}>
            {/* ── EMPRESA ─────────────────────────────────────────── */}
            {modo === "empresa" && paso === 0 && (
              <div className="pt-1">
                <Contador etiqueta="¿Cuántos son?" ayuda="Las personas que se alojan" valor={personas} min={1} max={200} onCambiar={setPersonas} grande />
                <div className="mt-4 flex flex-wrap gap-2" aria-label="Atajos">
                  {[4, 8, 12, 20, 30, 50].map((n) => (
                    <Opcion key={n} rol="radio" activa={personas === n} onClick={() => setPersonas(n)}>
                      {n}
                    </Opcion>
                  ))}
                </div>
                <p className="mt-6 rounded-2xl bg-white p-4 text-[15px] text-asfalto shadow-[inset_0_0_0_1px_var(--linea)]">
                  {SITIO.habitaciones} habitaciones con cochera cubierta en la puerta, restaurante, gimnasio y estación de servicio en el mismo predio.
                </p>
              </div>
            )}

            {modo === "empresa" && paso === 1 && (
              <div className="pt-2">
                <p className="mb-3 text-[15px] font-semibold">¿Cuándo llegan?</p>
                <Calendario
                  entrada={ingreso}
                  salida={null}
                  onElegir={(e) => setIngreso(e)}
                />
                <p className="mt-3 text-sm text-asfalto" aria-live="polite">
                  {ingreso ? <>Ingreso: <strong className="text-tinta">{fechaCorta(ingreso)}</strong></> : "Si todavía no tienen fecha, salteala."}
                </p>
                <p className="mt-6 mb-3 text-[15px] font-semibold">¿Por cuánto tiempo, más o menos?</p>
                <div role="radiogroup" className="flex flex-wrap gap-2">
                  {ESTADIAS.map((e) => (
                    <Opcion key={e} rol="radio" activa={estadia === e} onClick={() => setEstadia(e)}>
                      {e}
                    </Opcion>
                  ))}
                </div>
              </div>
            )}

            {modo === "empresa" && paso === 2 && (
              <div className="pt-2">
                <p className="mb-3 text-[15px] text-asfalto">Marcá lo que les sirva. Después lo ajustamos por WhatsApp o mail.</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {NECESIDADES.map((n) => {
                    const activa = necesidades.includes(n);
                    return (
                      <Opcion key={n} activa={activa} onClick={() => setNecesidades((v) => (activa ? v.filter((x) => x !== n) : [...v, n]))}>
                        <Icono nombre={ICONO_NECESIDAD[n]} className={`size-5 shrink-0 ${activa ? "text-white" : "text-acento"}`} grosor={1.8} />
                        {n}
                        {activa && <Icono nombre="check" className="ml-auto size-4" grosor={2.4} />}
                      </Opcion>
                    );
                  })}
                </div>
              </div>
            )}

            {modo === "empresa" && paso === 3 && (
              <div className="space-y-3 pt-2">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Campo etiqueta="Empresa" valor={empresa} onCambiar={setEmpresa} auto="organization" />
                  <Campo etiqueta="Tu nombre" valor={nombre} onCambiar={setNombre} auto="name" />
                </div>
                <Campo etiqueta="Rubro o lugar de trabajo (opcional)" valor={rubro} onCambiar={setRubro} placeholder="Ej.: obra en el Polo Petroquímico" />
                <div className="pt-3">
                  <Burbuja texto={mensaje} />
                </div>
              </div>
            )}

            {/* ── VIAJE ───────────────────────────────────────────── */}
            {modo === "viaje" && paso === 0 && (
              <div className="pt-2">
                <div className={sinFechas ? "pointer-events-none opacity-35" : ""} aria-hidden={sinFechas}>
                  <Calendario
                    entrada={entrada}
                    salida={salida}
                    onElegir={(e, s) => {
                      setEntrada(e);
                      setSalida(s);
                      setSinFechas(false);
                    }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between gap-4 border-t border-[color:var(--linea)] pt-4">
                  <p className="text-[15px]" aria-live="polite">
                    {sinFechas ? (
                      "Sin fechas por ahora."
                    ) : entrada && salida ? (
                      <>
                        <span className="font-semibold">{fechaCorta(entrada)} → {fechaCorta(salida)}</span>
                        <span className="text-asfalto"> · {nNoches} {nNoches === 1 ? "noche" : "noches"}</span>
                      </>
                    ) : entrada ? (
                      <span className="text-asfalto">Ahora elegí la salida.</span>
                    ) : (
                      <span className="text-asfalto">Elegí la entrada y la salida.</span>
                    )}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSinFechas((v) => !v);
                      setEntrada(null);
                      setSalida(null);
                    }}
                    className="enlace shrink-0 text-sm"
                  >
                    {sinFechas ? "Elegir fechas" : "Todavía no sé"}
                  </button>
                </div>
              </div>
            )}

            {modo === "viaje" && paso === 1 && (
              <div className="pt-1">
                <Contador etiqueta="Adultos" valor={adultos} min={1} max={12} onCambiar={setAdultos} />
                <Contador etiqueta="Chicos" valor={ninos} min={0} max={10} onCambiar={setNinos} />
                <Interruptor etiqueta="Soy socio ACA" ayuda="Tenés beneficios en toda la red" icono="escudo" valor={socio} onCambiar={setSocio} />
                <Interruptor etiqueta="Viajo con mascota" ayuda="Somos pet friendly" icono="pata" valor={mascota} onCambiar={setMascota} />
                <Interruptor etiqueta="Necesito habitación adaptada" icono="accesible" valor={adaptado} onCambiar={setAdaptado} />
              </div>
            )}

            {modo === "viaje" && paso === 2 && (
              <div className="space-y-3 pt-2">
                <Campo etiqueta="Tu nombre (opcional)" valor={nombre} onCambiar={setNombre} auto="name" />
                <div className="pt-3">
                  <Burbuja texto={mensaje} />
                </div>
              </div>
            )}

            {/* Envío por mail: aparece debajo de la vista previa */}
            {ultimo && (envio === "form" || envio === "enviando" || envio === "error") && (
              <form
                ref={formMail}
                className="paso-entra mt-5 space-y-3 rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_var(--linea)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  void enviarMail();
                }}
              >
                <Campo
                  etiqueta="Tu mail o teléfono, para responderte"
                  valor={contacto}
                  onCambiar={setContacto}
                  auto="email"
                  requerido
                />
                {/* Trampa para robots: invisible para las personas. */}
                <input ref={trampa} type="text" name="sitio" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <button type="submit" disabled={envio === "enviando" || contacto.trim().length < 6} className="btn btn-oscuro sin-burbuja w-full disabled:opacity-40">
                  {envio === "enviando" ? "Enviando…" : "Enviar por mail"}
                </button>
                {envio === "error" && (
                  <p className="text-sm text-error" role="alert">
                    No se pudo enviar. Probá por WhatsApp o escribinos a {SITIO.mail}.
                  </p>
                )}
              </form>
            )}
            {ultimo && envio === "ok" && (
              <div className="paso-entra mt-5 flex items-start gap-3 rounded-2xl bg-tinta p-5 text-white" role="status">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-wpp">
                  <Icono nombre="check" className="size-5" grosor={2.4} />
                </span>
                <p>
                  <strong className="block font-display text-2xl uppercase">Recibimos tu consulta</strong>
                  Te respondemos a {contacto} lo antes posible. Recepción abierta las 24 horas.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="shrink-0 border-t border-[color:var(--linea)] bg-papel px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
          {!ultimo ? (
            <div className="flex gap-2.5">
              {paso > 0 && (
                <button type="button" onClick={() => ir(paso - 1)} className="btn btn-fantasma sin-burbuja px-6">
                  Atrás
                </button>
              )}
              <button type="button" onClick={() => ir(paso + 1)} disabled={!puedeSeguir} className="btn btn-oscuro flex-1 disabled:cursor-not-allowed disabled:opacity-40">
                <span>{modo === "empresa" && paso === 1 && !puedeSeguir ? "Elegí una opción" : "Siguiente"}</span>
                <span className="burbuja" aria-hidden="true">
                  <Icono nombre="der" className="size-4" grosor={2} />
                </span>
              </button>
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-[1.4fr_1fr]">
              <a
                href={linkWhatsApp(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("consulta_whatsapp", datosMedicion());
                  conversionAds("consulta_whatsapp");
                }}
                className="btn btn-wpp sin-burbuja w-full"
              >
                <Icono nombre="whatsapp" className="size-5" />
                Enviar por WhatsApp
              </a>
              <button
                type="button"
                onClick={() => setEnvio((e) => (e === "ok" ? e : "form"))}
                className="btn btn-fantasma sin-burbuja w-full"
                aria-expanded={envio !== "nada"}
              >
                <Icono nombre="sobre" className="size-5" />
                Por mail
              </button>
            </div>
          )}
        </footer>
      </div>
    </dialog>
  );
}

function Campo({
  etiqueta,
  valor,
  onCambiar,
  auto,
  placeholder,
  requerido = false,
}: {
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  auto?: string;
  placeholder?: string;
  requerido?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-asfalto">{etiqueta}</span>
      <input
        value={valor}
        onChange={(e) => onCambiar(e.target.value)}
        autoComplete={auto}
        placeholder={placeholder}
        required={requerido}
        maxLength={120}
        className="h-12 w-full rounded-xl bg-white px-4 text-[16px] shadow-[inset_0_0_0_1px_var(--linea)] outline-none transition-shadow placeholder:text-asfalto/60 focus:shadow-[inset_0_0_0_2px_var(--color-tinta)]"
      />
    </label>
  );
}
