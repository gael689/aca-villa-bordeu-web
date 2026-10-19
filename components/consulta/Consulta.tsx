"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@vercel/analytics";
import { NECESIDADES, fechaCorta, linkWhatsApp, mensajeReserva, noches, type Datos, type Necesidad } from "@/lib/mensaje";
import { SITIO } from "@/lib/sitio";
import { Icono, type IconoNombre } from "@/components/marca/Icono";
import { bloquearScroll } from "@/components/motion/scroll";
import { conversionAds } from "@/components/layout/GoogleAds";
import { Calendario } from "./Calendario";
import { Burbuja, Campo, Contador, DatosPersonales, Enviado, Opcion, revisarDatos } from "./Campos";
import { useConsulta } from "./ConsultaContext";

// Solicitud de reserva: un solo formulario para viajeros y equipos de trabajo
// (19/10/2026; antes eran dos pestañas). «¿Es por trabajo?» abre empresa, rubro
// y lo que necesitan.

const CLAVE = "vb-consulta-v2";
const PASOS = ["Fechas", "Huéspedes", "Tus datos"];
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

/** Pregunta de sí o no, sin respuesta marcada hasta que la persona elige. */
function SiNo({ pregunta, ayuda, icono, valor, onCambiar }: { pregunta: string; ayuda?: string; icono: IconoNombre; valor: boolean | null; onCambiar: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[color:var(--linea)] py-4">
      <span>
        <span className="flex items-center gap-2 text-[16px] font-semibold">
          <Icono nombre={icono} className="size-5 text-acento" /> {pregunta}
        </span>
        {ayuda && <span className="block text-sm text-asfalto">{ayuda}</span>}
      </span>
      <div role="radiogroup" aria-label={pregunta} className="flex shrink-0 gap-1.5">
        {[true, false].map((v) => (
          <Opcion key={String(v)} rol="radio" activa={valor === v} onClick={() => onCambiar(v)}>
            {v ? "Sí" : "No"}
          </Opcion>
        ))}
      </div>
    </div>
  );
}

type EstadoEnvio = "nada" | "enviando" | "ok" | "whatsapp" | "error";

export function Consulta() {
  const { abierta, apertura, cerrar } = useConsulta();
  const dlg = useRef<HTMLDialogElement>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const [cerrando, setCerrando] = useState(false);
  const [paso, setPaso] = useState(0);
  const [atras, setAtras] = useState(false);

  const [entrada, setEntrada] = useState<Date | null>(null);
  const [salida, setSalida] = useState<Date | null>(null);
  const [sinFechas, setSinFechas] = useState(false);
  const [adultos, setAdultos] = useState(2);
  const [ninos, setNinos] = useState(0);
  const [socio, setSocio] = useState<boolean | null>(null);
  const [trabajo, setTrabajo] = useState<boolean | null>(null);
  const [empresa, setEmpresa] = useState("");
  const [rubro, setRubro] = useState("");
  const [necesidades, setNecesidades] = useState<Necesidad[]>([]);
  const [mascota, setMascota] = useState(false);
  const [adaptado, setAdaptado] = useState(false);
  const [datos, setDatos] = useState<Datos>({ nombre: "", telefono: "", email: "" });
  const [intentado, setIntentado] = useState(false);
  const [envio, setEnvio] = useState<EstadoEnvio>("nada");
  const trampa = useRef<HTMLInputElement>(null);
  // Después de enviar (WhatsApp o mail) no se guarda nada: al cerrar, todo vuelve a cero.
  const olvidar = useRef(false);

  const reiniciar = () => {
    setEntrada(null);
    setSalida(null);
    setSinFechas(false);
    setAdultos(2);
    setNinos(0);
    setSocio(null);
    setTrabajo(null);
    setEmpresa("");
    setRubro("");
    setNecesidades([]);
    setMascota(false);
    setAdaptado(false);
    setDatos({ nombre: "", telefono: "", email: "" });
    setIntentado(false);
    setEnvio("nada");
    setPaso(0);
  };

  const marcarEnviado = (canal: "ok" | "whatsapp") => {
    olvidar.current = true;
    try {
      sessionStorage.removeItem(CLAVE);
    } catch {}
    setEnvio(canal);
  };

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
          const e = aFecha(g.entrada);
          const vig = !!e && e >= hoy0();
          setEntrada(vig ? e : null);
          setSalida(vig ? aFecha(g.salida) : null);
          setSinFechas(!!g.sinFechas);
          setAdultos(g.adultos || 2);
          setNinos(g.ninos || 0);
          setSocio(g.socio ?? null);
          setTrabajo(g.trabajo ?? null);
          setEmpresa(g.empresa ?? "");
          setRubro(g.rubro ?? "");
          setNecesidades(g.necesidades ?? []);
          setMascota(!!g.mascota);
          setAdaptado(!!g.adaptado);
          setDatos({ nombre: g.nombre ?? "", telefono: g.telefono ?? "", email: g.email ?? "" });
        }
      } catch {}
      // Los botones de Empresas abren con «por trabajo» marcado; los de viaje, sin marcar.
      if (apertura.modo === "empresa") setTrabajo(true);
      if (apertura.rubro) setRubro(apertura.rubro);
      if (apertura.personas) setAdultos(Math.min(200, apertura.personas));
      const ing = aFecha(apertura.ingreso);
      if (ing) {
        setEntrada(ing);
        setSalida(null);
        setSinFechas(false);
      }
      setAtras(false);
      setPaso(0);
      setEnvio("nada");
      setIntentado(false);
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
        if (olvidar.current) {
          olvidar.current = false;
          reiniciar();
        }
      }, 340);
    }
    return () => window.clearTimeout(t);
  }, [abierta, apertura]);

  // Guardar el estado: si cierra el panel y lo vuelve a abrir, sigue ahí.
  useEffect(() => {
    if (!abierta || olvidar.current) return;
    try {
      sessionStorage.setItem(
        CLAVE,
        JSON.stringify({ entrada, salida, sinFechas, adultos, ninos, socio, trabajo, empresa, rubro, necesidades, mascota, adaptado, ...datos }),
      );
    } catch {}
  }, [abierta, entrada, salida, sinFechas, adultos, ninos, socio, trabajo, empresa, rubro, necesidades, mascota, adaptado, datos]);

  useEffect(() => {
    if (abierta) titulo.current?.focus({ preventScroll: true });
  }, [paso, abierta]);

  const ultimo = paso === PASOS.length - 1;
  const ir = (n: number) => {
    setAtras(n < paso);
    setPaso(n);
    setEnvio((e) => (e === "ok" ? e : "nada"));
  };

  const puedeSeguir = paso === 0 ? sinFechas || (!!entrada && !!salida) : true;

  const mensaje = useMemo(
    () =>
      mensajeReserva({
        entrada: sinFechas ? null : entrada,
        salida: sinFechas ? null : salida,
        adultos, ninos, socio, trabajo, empresa, rubro, necesidades, mascota, adaptado, ...datos,
      }),
    [entrada, salida, sinFechas, adultos, ninos, socio, trabajo, empresa, rubro, necesidades, mascota, adaptado, datos],
  );

  // El servidor de mail sigue distinguiendo equipo de trabajo y viaje en el asunto.
  const modo = trabajo ? "empresa" : "viaje";
  const datosMedicion = () => ({ modo, personas: adultos + ninos, origen: apertura.origen ?? "panel" });

  // Por mail hacen falta nombre, teléfono y e-mail (el hotel responde a ese mail).
  // Por WhatsApp sale igual: el número ya llega con el mensaje.
  async function enviarMail() {
    setIntentado(true);
    if (!revisarDatos("consulta", datos)) return;
    setEnvio("enviando");
    try {
      const r = await fetch(SITIO.consultaApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo, mensaje, ...datos, empresa, sitio: trampa.current?.value ?? "" }),
      });
      if (!r.ok) throw new Error(String(r.status));
      marcarEnviado("ok");
      track("consulta_mail", datosMedicion());
      conversionAds("consulta_mail");
    } catch {
      setEnvio("error");
    }
  }

  const enviado = envio === "ok" || envio === "whatsapp";
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
              <h2
                id="consulta-titulo"
                ref={titulo}
                tabIndex={-1}
                className="font-display text-[30px] leading-none font-bold uppercase outline-none md:text-[36px]"
              >
                Solicitud de reserva
              </h2>
              <p className="mt-1.5 text-[15px] text-asfalto">Consultá disponibilidad y te respondemos a la brevedad.</p>
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

          <ol className="mt-4 flex gap-1.5" aria-label="Pasos">
            {PASOS.map((p, i) => (
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
          {ultimo && enviado ? (
            <Enviado canal={envio === "whatsapp" ? "whatsapp" : "mail"} que="consulta" email={datos.email} />
          ) : (
            <div key={paso} className={claseEntra}>
              {paso === 0 && (
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
                        <span className="text-asfalto">
                          Ingreso: <strong className="text-tinta">{fechaCorta(entrada)}</strong>. Ahora elegí el día de salida.
                        </span>
                      ) : (
                        <span className="text-asfalto">Elegí el día de ingreso y el de salida.</span>
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

              {paso === 1 && (
                <div className="pt-1">
                  <Contador etiqueta="Adultos" valor={adultos} min={1} max={200} onCambiar={setAdultos} />
                  {/* Atajos para grupos de trabajo: llegar a 30 con «+» es tedioso. */}
                  <div className="flex flex-wrap gap-2 border-b border-[color:var(--linea)] pb-4" role="radiogroup" aria-label="Atajos de adultos">
                    {[1, 2, 4, 8, 12, 20, 30, 50].map((n) => (
                      <Opcion key={n} rol="radio" activa={adultos === n} onClick={() => setAdultos(n)}>
                        {n}
                      </Opcion>
                    ))}
                  </div>
                  <Contador etiqueta="Chicos" valor={ninos} min={0} max={50} onCambiar={setNinos} />
                  <SiNo pregunta="¿Sos socio ACA?" ayuda="Tenés beneficios en toda la red" icono="escudo" valor={socio} onCambiar={setSocio} />
                  <SiNo pregunta="¿Es por trabajo?" icono="casco" valor={trabajo} onCambiar={setTrabajo} />
                  {trabajo && (
                    <div className="paso-entra space-y-4 border-b border-[color:var(--linea)] py-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Campo etiqueta="Empresa" valor={empresa} onCambiar={setEmpresa} auto="organization" />
                        <Campo etiqueta="Rubro o lugar de trabajo" valor={rubro} onCambiar={setRubro} placeholder="Ej.: obra en el Polo" />
                      </div>
                      <div>
                        <p className="mb-2.5 text-[13px] font-semibold text-asfalto">¿Qué van a necesitar?</p>
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
                    </div>
                  )}
                  <Interruptor etiqueta="Viajo con mascota" ayuda="Somos pet friendly" icono="pata" valor={mascota} onCambiar={setMascota} />
                  <Interruptor etiqueta="Necesito habitación adaptada" icono="accesible" valor={adaptado} onCambiar={setAdaptado} />
                  <p className="mt-6 rounded-2xl bg-white p-4 text-[15px] text-asfalto shadow-[inset_0_0_0_1px_var(--linea)]">
                    Habitaciones con cochera cubierta en la puerta, restaurante, gimnasio y estación de servicio en el mismo predio.
                  </p>
                </div>
              )}

              {paso === 2 && (
                <div className="space-y-3 pt-2">
                  <DatosPersonales prefijo="consulta" datos={datos} onCambiar={setDatos} mostrarErrores={intentado} />
                  <div className="pt-3">
                    <Burbuja texto={mensaje} titulo="Así nos llega tu solicitud" />
                  </div>
                </div>
              )}

              {/* Trampa para robots: invisible para las personas. */}
              {ultimo && <input ref={trampa} type="text" name="sitio" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />}
              {ultimo && envio === "error" && (
                <p className="paso-entra mt-5 text-sm text-error" role="alert">
                  No se pudo enviar. Probá por WhatsApp o escribinos a {SITIO.mail}.
                </p>
              )}
            </div>
          )}
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
                <span>{paso === 0 && !puedeSeguir ? "Elegí las fechas" : "Siguiente"}</span>
                <span className="burbuja" aria-hidden="true">
                  <Icono nombre="der" className="size-4" grosor={2} />
                </span>
              </button>
            </div>
          ) : enviado ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button type="button" onClick={cerrar} className="btn btn-oscuro sin-burbuja w-full">
                Listo, cerrar
              </button>
              {envio === "whatsapp" && (
                <a href={linkWhatsApp(mensaje)} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma sin-burbuja w-full">
                  <Icono nombre="whatsapp" className="size-5" />
                  Abrir WhatsApp de nuevo
                </a>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-2.5">
              <button type="button" onClick={() => ir(paso - 1)} aria-label="Atrás" className="btn btn-fantasma sin-burbuja shrink-0 px-4 sm:px-6">
                <Icono nombre="izq" className="size-4 sm:hidden" grosor={2} />
                <span className="max-sm:sr-only">Atrás</span>
              </button>
            <div className="grid flex-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void enviarMail()}
                disabled={envio === "enviando"}
                className="btn btn-oscuro sin-burbuja w-full disabled:opacity-50"
              >
                <Icono nombre="sobre" className="size-5" />
                {envio === "enviando" ? "Enviando…" : "Enviar solicitud"}
              </button>
              <a
                href={linkWhatsApp(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("consulta_whatsapp", datosMedicion());
                  conversionAds("consulta_whatsapp");
                  // Después del clic: el link tiene que abrirse antes de que el botón se reemplace.
                  window.setTimeout(() => marcarEnviado("whatsapp"));
                }}
                className="btn btn-wpp sin-burbuja w-full"
              >
                <Icono nombre="whatsapp" className="size-5" />
                Enviar por WhatsApp
              </a>
            </div>
            </div>
          )}
        </footer>
      </div>
    </dialog>
  );
}
