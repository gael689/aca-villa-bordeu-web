"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { track } from "@vercel/analytics";
import { CARTA } from "@/lib/carta";
import { fechaCorta, linkWhatsApp, mensajePedido, type Curso, type Datos, type DiaPedido, type ItemPedido } from "@/lib/mensaje";
import { SITIO } from "@/lib/sitio";
import { Icono } from "@/components/marca/Icono";
import { bloquearScroll } from "@/components/motion/scroll";
import { conversionAds } from "@/components/layout/GoogleAds";
import { Calendario } from "@/components/consulta/Calendario";
import { Burbuja, Campo, Contador, DatosPersonales, Enviado, Opcion, revisarDatos } from "@/components/consulta/Campos";

// «Prepará tu pedido» (pedido del cliente, oct/2026), pensado para empresas que
// vienen a comer con su equipo. Un asistente que acompaña paso a paso, como una
// comida: cuántos son → entrada → plato principal → bebida → postre → día y hora
// → datos. Sale por WhatsApp (asistido: la persona aprieta enviar) o por mail.

const CLAVE = "vb-pedido-v2";

/** A qué paso del pedido va cada capítulo de la carta. */
const CURSO_DE: Record<string, Curso> = {
  "Platos fríos y sopas": "Entrada",
  "Especialidades y sugerencias": "Plato principal",
  "Parrilla y ensaladas": "Plato principal",
  Pastas: "Plato principal",
  "Arroz, legumbres y huevos": "Plato principal",
  "Bebidas y cafetería": "Bebida",
  "Postres y helados": "Postre",
};

type Plato = { clave: string; nombre: string; detalle?: string; seccion: string; curso: Curso };

const PLATOS: Plato[] = CARTA.flatMap((s) =>
  s.platos.map((p) => ({ clave: `${s.nombre}|${p.nombre}`, nombre: p.nombre, detalle: p.detalle, seccion: s.nombre, curso: CURSO_DE[s.nombre] ?? "Plato principal" })),
);

type Paso = { corto: string; titulo: string; ayuda: string; curso?: Curso; opcional?: boolean };

const PASOS: Paso[] = [
  { corto: "Cuántos", titulo: "¿Para cuántas personas?", ayuda: "Así te ayudamos a calcular los platos." },
  { corto: "Entrada", titulo: "¿Quieren entrada?", ayuda: "Es opcional. Si no, seguí al plato principal.", curso: "Entrada", opcional: true },
  { corto: "Principal", titulo: "Plato principal", ayuda: "Sumá cuántos de cada plato. Las variantes las aclarás al final.", curso: "Plato principal" },
  { corto: "Bebida", titulo: "Bebidas y café", ayuda: "Opcional: gaseosas, agua, cerveza, café.", curso: "Bebida", opcional: true },
  { corto: "Postre", titulo: "¿Y de postre?", ayuda: "Es opcional.", curso: "Postre", opcional: true },
  { corto: "Cuándo", titulo: "¿Qué días y a qué hora?", ayuda: "Podés marcar uno o varios días. Te lo confirmamos por WhatsApp o mail." },
  { corto: "Enviar", titulo: "Tus datos", ayuda: "Revisá el pedido y envialo." },
];

type Ctx = {
  cantidades: Record<string, number>;
  sumar: (clave: string, delta: number) => void;
  vaciar: () => void;
  total: number;
  abrir: () => void;
};

const PedidoCtx = createContext<Ctx | null>(null);

function usePedido() {
  const c = useContext(PedidoCtx);
  if (!c) throw new Error("usePedido fuera de PedidoProvider");
  return c;
}

export function PedidoProvider({ children }: { children: ReactNode }) {
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [abierta, setAbierta] = useState(false);

  // Si recarga la página, el pedido sigue ahí.
  useEffect(() => {
    try {
      const g = JSON.parse(sessionStorage.getItem(CLAVE) ?? "null");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (g && typeof g === "object") setCantidades(g);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(cantidades));
    } catch {}
  }, [cantidades]);

  const sumar = useCallback((clave: string, delta: number) => {
    setCantidades((c) => {
      const n = Math.max(0, Math.min(999, (c[clave] ?? 0) + delta));
      const sig = { ...c };
      if (n) sig[clave] = n;
      else delete sig[clave];
      return sig;
    });
  }, []);
  const vaciar = useCallback(() => setCantidades({}), []);

  const total = Object.values(cantidades).reduce((a, b) => a + b, 0);
  const abrir = useCallback(() => {
    setAbierta(true);
    track("pedido_abre");
  }, []);
  const valor = useMemo(() => ({ cantidades, sumar, vaciar, total, abrir }), [cantidades, sumar, vaciar, total, abrir]);

  return (
    <PedidoCtx.Provider value={valor}>
      {children}
      <BarraPedido oculta={abierta} />
      <PanelPedido abierta={abierta} cerrar={() => setAbierta(false)} />
    </PedidoCtx.Provider>
  );
}

/** Abre el asistente del pedido. Si ya hay platos elegidos, invita a seguir. */
export function BotonAbrirPedido({ className = "btn", children }: { className?: string; children?: ReactNode }) {
  const { abrir, total } = usePedido();
  return (
    <button type="button" onClick={abrir} className={className}>
      <span>{total ? `Seguir con mi pedido (${total})` : (children ?? "Armar el pedido")}</span>
      <span className="burbuja" aria-hidden="true">
        <Icono nombre="cubiertos" className="size-4" grosor={2} />
      </span>
    </button>
  );
}

/** Píldora flotante para retomar el pedido si se cerró el panel a mitad de camino. */
function BarraPedido({ oculta }: { oculta: boolean }) {
  const { total, abrir } = usePedido();
  const visible = total > 0 && !oculta;
  return (
    <div
      // Con un pedido en curso, la barra fija del celular se esconde (ver globals.css).
      data-pedido-activo={total > 0 || undefined}
      inert={!visible}
      className={[
        "fixed inset-x-2 bottom-[max(8px,env(safe-area-inset-bottom))] z-[101] mx-auto max-w-[460px] md:bottom-5",
        "transition-[transform,opacity] duration-500 ease-[var(--ease-pt)]",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-[130%] opacity-0",
      ].join(" ")}
    >
      <button
        type="button"
        onClick={abrir}
        className="flex h-[60px] w-full items-center gap-3 rounded-full bg-amarillo pr-2 pl-5 text-tinta shadow-[0_20px_40px_-16px_rgb(0_0_0/0.6)]"
      >
        <Icono nombre="cubiertos" className="size-5 shrink-0" grosor={2} />
        <span className="flex-1 text-left text-[15px] font-semibold">
          Tu pedido · {total} {total === 1 ? "plato" : "platos"}
        </span>
        <span className="flex h-11 items-center gap-1.5 rounded-full bg-tinta px-4 text-[14px] font-semibold text-white">
          Seguir <Icono nombre="der" className="size-4" grosor={2} />
        </span>
      </button>
    </div>
  );
}

/** Un plato de la lista: «Agregar» y, con cantidad, un − n +. */
function FilaPlato({ p }: { p: Plato }) {
  const { cantidades, sumar } = usePedido();
  const n = cantidades[p.clave] ?? 0;
  const redondo = "grid size-9 place-items-center rounded-full transition-colors";
  return (
    <li className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-2.5 transition-colors ${n ? "bg-white shadow-[inset_0_0_0_1.5px_var(--color-amarillo)]" : ""}`}>
      <div className="min-w-0">
        <p className="text-[16px] leading-tight font-semibold">{p.nombre}</p>
        {p.detalle && <p className="mt-0.5 text-[13px] leading-snug text-asfalto">{p.detalle}</p>}
      </div>
      {n ? (
        <div className="flex shrink-0 items-center gap-0.5 rounded-full bg-amarillo p-1">
          <button type="button" onClick={() => sumar(p.clave, -1)} aria-label={`Quitar un ${p.nombre}`} className={`${redondo} size-8 hover:bg-tinta/10`}>
            <Icono nombre="menos" className="size-4" grosor={2.2} />
          </button>
          <span className="num w-7 text-center font-display text-[19px] font-bold" aria-live="polite">
            {n}
          </span>
          <button type="button" onClick={() => sumar(p.clave, 1)} aria-label={`Sumar un ${p.nombre}`} className={`${redondo} size-8 hover:bg-tinta/10`}>
            <Icono nombre="mas" className="size-4" grosor={2.2} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => sumar(p.clave, 1)}
          aria-label={`Agregar ${p.nombre}`}
          className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-white pr-4 pl-3 text-[14px] font-semibold shadow-[inset_0_0_0_1px_var(--linea)] transition-colors hover:bg-amarillo"
        >
          <Icono nombre="mas" className="size-4" grosor={2.4} />
          Agregar
        </button>
      )}
    </li>
  );
}

/** La lista de un paso (entrada, principal, bebida o postre), con filtros por capítulo y «Mis elegidos». */
function ListaCurso({ curso, personas }: { curso: Curso; personas: number }) {
  const { cantidades } = usePedido();
  const [filtro, setFiltro] = useState("todos");
  const platos = PLATOS.filter((p) => p.curso === curso);
  const secciones = [...new Set(platos.map((p) => p.seccion))];
  const elegidos = platos.reduce((a, p) => a + (cantidades[p.clave] ?? 0), 0);
  const conElegidos = platos.filter((p) => cantidades[p.clave]).length;
  const filtros = [
    { id: "todos", texto: "Todos" },
    ...(secciones.length > 1 ? secciones.map((s) => ({ id: s, texto: s })) : []),
    ...(conElegidos ? [{ id: "elegidos", texto: `Mis elegidos (${elegidos})` }] : []),
  ];
  const activo = filtros.some((f) => f.id === filtro) ? filtro : "todos";
  const grupos =
    activo === "todos"
      ? secciones.map((s) => ({ titulo: secciones.length > 1 ? s : "", platos: platos.filter((p) => p.seccion === s) }))
      : activo === "elegidos"
        ? [{ titulo: "", platos: platos.filter((p) => cantidades[p.clave]) }]
        : [{ titulo: "", platos: platos.filter((p) => p.seccion === activo) }];

  return (
    <div>
      {curso === "Plato principal" && (
        <div className="mb-4 rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_var(--linea)]" aria-live="polite">
          <p className="flex items-baseline justify-between gap-3 text-[15px]">
            <span>
              Llevás <strong className="num">{elegidos}</strong> {elegidos === 1 ? "plato" : "platos"} para <strong className="num">{personas}</strong>{" "}
              {personas === 1 ? "persona" : "personas"}
            </span>
            {elegidos >= personas && <Icono nombre="check" className="size-5 shrink-0 text-acento" grosor={2.4} />}
          </p>
          <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-hormigon">
            <span className="block h-full rounded-full bg-amarillo transition-[width] duration-500" style={{ width: `${Math.min(100, (elegidos / personas) * 100)}%` }} />
          </span>
        </div>
      )}
      {filtros.length > 1 && (
        <div role="radiogroup" aria-label="Filtrar" className="sin-barra -mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1 md:-mx-8 md:flex-wrap md:px-8">
          {filtros.map((f) => (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={activo === f.id}
              onClick={() => setFiltro(f.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[14px] font-semibold transition-colors ${activo === f.id ? "bg-tinta text-white" : "bg-white shadow-[inset_0_0_0_1px_var(--linea)] hover:bg-hormigon"}`}
            >
              {f.texto}
            </button>
          ))}
        </div>
      )}
      {grupos.map((g) => (
        <section key={g.titulo || activo}>
          {g.titulo && <h3 className="etiqueta mt-5 mb-1 px-3">{g.titulo}</h3>}
          <ul className="-mx-3 grid gap-x-4 gap-y-0.5 lg:grid-cols-2">
            {g.platos.map((p) => (
              <FilaPlato key={p.clave} p={p} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const mismoDia = (a: Date, b: Date) => a.getTime() === b.getTime();

/** Horario de un día (o de todos): almuerzo o cena con un toque, y la hora si la quieren precisar. */
function Horario({ titulo, d, onCambiar, onQuitar }: { titulo: string; d: DiaPedido; onCambiar: (c: Partial<DiaPedido>) => void; onQuitar?: () => void }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-[inset_0_0_0_1px_var(--linea)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[16px] font-semibold first-letter:uppercase">{titulo}</p>
        {onQuitar && (
          <button type="button" onClick={onQuitar} aria-label={`Quitar ${titulo}`} className="grid size-8 place-items-center rounded-full text-asfalto hover:bg-hormigon">
            <Icono nombre="cerrar" className="size-4" grosor={2} />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-end gap-2">
        {(["Almuerzo", "Cena"] as const).map((m) => (
          <Opcion key={m} rol="radio" activa={d.momento === m} onClick={() => onCambiar({ momento: d.momento === m ? "" : m })}>
            <Icono nombre={m === "Almuerzo" ? "sol" : "luna"} className={`size-5 ${d.momento === m ? "text-white" : "text-acento"}`} grosor={1.8} />
            {m}
          </Opcion>
        ))}
        <label className="ml-auto block">
          <span className="mb-1 block text-[12px] font-semibold text-asfalto">Hora (opcional)</span>
          <input
            type="time"
            value={d.hora}
            onChange={(e) => onCambiar({ hora: e.target.value })}
            className="h-12 w-[132px] rounded-xl bg-papel px-3 text-[16px] shadow-[inset_0_0_0_1px_var(--linea)] outline-none focus:shadow-[inset_0_0_0_2px_var(--color-tinta)]"
          />
        </label>
      </div>
    </div>
  );
}

/** Paso «Cuándo»: uno o varios días, cada uno con su horario o el mismo para todos. */
function Cuando({ dias, setDias, mismo, setMismo }: { dias: DiaPedido[]; setDias: (f: (v: DiaPedido[]) => DiaPedido[]) => void; mismo: boolean; setMismo: (v: boolean) => void }) {
  const alternar = (fecha: Date) =>
    setDias((v) =>
      v.some((x) => mismoDia(x.fecha, fecha))
        ? v.filter((x) => !mismoDia(x.fecha, fecha))
        : [...v, { fecha, momento: mismo && v[0] ? v[0].momento : "", hora: mismo && v[0] ? v[0].hora : "" }].sort((a, b) => a.fecha.getTime() - b.fecha.getTime()),
    );
  const cambiar = (i: number, c: Partial<DiaPedido>) => setDias((v) => v.map((x, k) => (mismo || k === i ? { ...x, ...c } : x)));
  const repetir = (v: boolean) => {
    setMismo(v);
    if (v) setDias((ds) => ds.map((x) => ({ ...x, momento: ds[0]?.momento ?? "", hora: ds[0]?.hora ?? "" })));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div>
        <Calendario varios={dias.map((d) => d.fecha)} onAlternar={alternar} />
        <p className="mt-3 text-sm text-asfalto" aria-live="polite">
          {dias.length ? `${dias.length} ${dias.length === 1 ? "día marcado" : "días marcados"}. Tocá un día de nuevo para quitarlo.` : "Tocá uno o varios días."}
        </p>
      </div>
      <div className="space-y-3">
        {dias.length === 0 ? (
          <p className="rounded-2xl bg-white p-4 text-[15px] text-asfalto shadow-[inset_0_0_0_1px_var(--linea)]">
            Marcá en el calendario los días del pedido. Después elegís almuerzo o cena para cada uno.
          </p>
        ) : (
          <>
            {dias.length > 1 && (
              <div className="grid grid-cols-2 gap-1 rounded-full bg-hormigon p-1" role="radiogroup" aria-label="Horario">
                {[
                  { v: true, t: "Mismo horario" },
                  { v: false, t: "Uno por día" },
                ].map((o) => (
                  <button
                    key={o.t}
                    type="button"
                    role="radio"
                    aria-checked={mismo === o.v}
                    onClick={() => repetir(o.v)}
                    className={`h-11 rounded-full text-[14px] font-semibold transition-colors ${mismo === o.v ? "bg-white text-tinta shadow-[0_4px_14px_-6px_rgb(0_0_0/0.35)]" : "text-asfalto"}`}
                  >
                    {o.t}
                  </button>
                ))}
              </div>
            )}
            {mismo ? (
              <Horario titulo={dias.length > 1 ? `Los ${dias.length} días` : fechaCorta(dias[0].fecha)} d={dias[0]} onCambiar={(c) => cambiar(0, c)} />
            ) : (
              dias.map((d, i) => (
                <Horario key={d.fecha.getTime()} titulo={fechaCorta(d.fecha)} d={d} onCambiar={(c) => cambiar(i, c)} onQuitar={() => alternar(d.fecha)} />
              ))
            )}
            {dias.length > 1 && <p className="text-[13px] text-asfalto">Es el mismo pedido para cada día. Si cambia, aclaralo en el último paso.</p>}
          </>
        )}
      </div>
    </div>
  );
}

type EstadoEnvio = "nada" | "enviando" | "ok" | "whatsapp" | "error";

function PanelPedido({ abierta, cerrar }: { abierta: boolean; cerrar: () => void }) {
  const { cantidades, total, vaciar } = usePedido();
  const dlg = useRef<HTMLDialogElement>(null);
  const cuerpo = useRef<HTMLDivElement>(null);
  const trampa = useRef<HTMLInputElement>(null);
  const [cerrando, setCerrando] = useState(false);
  const [paso, setPaso] = useState(0);
  const [atras, setAtras] = useState(false);
  const [personas, setPersonas] = useState(10);
  const [dias, setDias] = useState<DiaPedido[]>([]);
  const [mismo, setMismo] = useState(true);
  const [aclaraciones, setAclaraciones] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [datos, setDatos] = useState<Datos>({ nombre: "", telefono: "", email: "" });
  const [intentado, setIntentado] = useState(false);
  const [envio, setEnvio] = useState<EstadoEnvio>("nada");
  // Después de enviar (WhatsApp o mail) el pedido no se guarda: al cerrar, todo vuelve a cero.
  const olvidar = useRef(false);
  const enviado = envio === "ok" || envio === "whatsapp";

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    let t: number | undefined;
    if (abierta && !d.open) {
      setCerrando(false);
      d.showModal();
      bloquearScroll(true);
    } else if (!abierta && d.open) {
      setCerrando(true);
      t = window.setTimeout(() => {
        d.close();
        setCerrando(false);
        bloquearScroll(false);
        if (olvidar.current) {
          olvidar.current = false;
          setPaso(0);
          setPersonas(10);
          setDias([]);
          setMismo(true);
          setAclaraciones("");
          setEmpresa("");
          setDatos({ nombre: "", telefono: "", email: "" });
          setIntentado(false);
          setEnvio("nada");
        }
      }, 340);
    }
    return () => window.clearTimeout(t);
  }, [abierta]);

  const items: ItemPedido[] = PLATOS.filter((p) => cantidades[p.clave]).map((p) => ({ plato: p.nombre, cantidad: cantidades[p.clave], curso: p.curso }));
  const deCurso = (c: Curso) => items.filter((i) => i.curso === c).reduce((a, i) => a + i.cantidad, 0);
  const comida = deCurso("Entrada") + deCurso("Plato principal");
  const mensaje = mensajePedido({ personas, dias, items, aclaraciones, empresa, ...datos });

  const actual = PASOS[paso];
  const ultimo = paso === PASOS.length - 1;
  const ir = (n: number) => {
    setAtras(n < paso);
    setPaso(n);
    cuerpo.current?.scrollTo({ top: 0 });
  };

  // Qué hace falta para avanzar en cada paso, y qué dice el botón.
  let puedeSeguir = true;
  let textoSeguir = "Siguiente";
  if (actual.curso === "Plato principal" && comida === 0) {
    puedeSeguir = false;
    textoSeguir = "Elegí al menos un plato";
  } else if (actual.opcional && actual.curso && deCurso(actual.curso) === 0) {
    textoSeguir = actual.curso === "Entrada" ? "Sin entrada, seguir" : actual.curso === "Bebida" ? "Sin bebidas, seguir" : "Sin postre, seguir";
  } else if (paso === 5 && (!dias.length || dias.some((d) => !d.momento && !d.hora))) {
    puedeSeguir = false;
    textoSeguir = !dias.length ? "Elegí al menos un día" : "Elegí almuerzo o cena";
  }

  const revisar = () => {
    setIntentado(true);
    return revisarDatos("pedido", datos);
  };

  async function enviarMail() {
    if (!revisar()) return;
    setEnvio("enviando");
    try {
      const r = await fetch(SITIO.consultaApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ modo: "pedido", mensaje, ...datos, empresa, sitio: trampa.current?.value ?? "" }),
      });
      if (!r.ok) throw new Error(String(r.status));
      marcarEnviado("ok");
      track("pedido_mail", { platos: total, personas });
      conversionAds("pedido_mail");
    } catch {
      setEnvio("error");
    }
  }

  const marcarEnviado = (canal: "ok" | "whatsapp") => {
    olvidar.current = true;
    try {
      sessionStorage.removeItem(CLAVE);
    } catch {}
    setEnvio(canal);
  };

  // Cerrar el panel: si el pedido ya salió, se vacía (lo demás se limpia cuando termina de cerrarse).
  const salir = () => {
    if (olvidar.current) vaciar();
    cerrar();
  };

  return (
    <dialog
      ref={dlg}
      className={`consulta centro ${cerrando ? "cerrando" : ""}`}
      aria-labelledby="pedido-titulo"
      onCancel={(e) => {
        e.preventDefault();
        salir();
      }}
      onClick={(e) => {
        if (e.target === dlg.current) salir();
      }}
    >
      <div className="flex h-full max-h-[94dvh] flex-col md:max-h-none">
        <header className="relative shrink-0 px-5 pt-3 pb-4 md:px-8 md:pt-7">
          <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-tinta/15 md:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="etiqueta">
                Paso {paso + 1} de {PASOS.length} · {actual.corto}
              </p>
              <h2 id="pedido-titulo" className="mt-1.5 font-display text-[30px] leading-none font-bold uppercase md:text-[36px]">
                {actual.titulo}
              </h2>
              <p className="mt-2 text-[14px] text-asfalto">{actual.ayuda}</p>
            </div>
            <button
              type="button"
              onClick={salir}
              aria-label="Cerrar"
              className="-mr-1 grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-[inset_0_0_0_1px_var(--linea)] transition-transform duration-500 hover:rotate-90"
            >
              <Icono nombre="cerrar" className="size-5" grosor={2} />
            </button>
          </div>
          <ol className="mt-4 flex gap-1" aria-label="Pasos">
            {PASOS.map((p, i) => (
              <li key={p.corto} className="flex-1" aria-current={i === paso ? "step" : undefined}>
                <button
                  type="button"
                  onClick={() => i < paso && ir(i)}
                  disabled={i >= paso}
                  aria-label={`Volver a ${p.corto}`}
                  className={`block h-[3px] w-full rounded-full transition-colors duration-500 disabled:cursor-default ${i <= paso ? "bg-amarillo" : "bg-tinta/12"}`}
                />
              </li>
            ))}
          </ol>
        </header>

        <div ref={cuerpo} data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-[color:var(--linea)] px-5 pt-4 pb-6 md:px-8">
          <div key={paso} className={atras ? "paso-entra-atras" : "paso-entra"}>
            {paso === 0 && (
              <div className="mx-auto max-w-[620px]">
                <Contador etiqueta="Personas" ayuda="Las que van a comer" valor={personas} min={1} max={300} onCambiar={setPersonas} grande />
                <div className="mt-4 flex flex-wrap gap-2" aria-label="Atajos">
                  {[2, 4, 6, 10, 15, 20, 30].map((n) => (
                    <Opcion key={n} rol="radio" activa={personas === n} onClick={() => setPersonas(n)}>
                      {n}
                    </Opcion>
                  ))}
                </div>
                <p className="mt-6 rounded-2xl bg-white p-4 text-[15px] text-asfalto shadow-[inset_0_0_0_1px_var(--linea)]">
                  Ideal para equipos de trabajo: en los próximos pasos elegís la entrada, el plato principal, la bebida y el postre, cuántos de cada uno.
                </p>
              </div>
            )}

            {actual.curso && <ListaCurso curso={actual.curso} personas={personas} />}

            {paso === 5 && <Cuando dias={dias} setDias={setDias} mismo={mismo} setMismo={setMismo} />}

            {ultimo && enviado && <Enviado canal={envio === "whatsapp" ? "whatsapp" : "mail"} que="pedido" email={datos.email} />}

            {ultimo && !enviado && (
              <div className="mx-auto max-w-[680px] space-y-5">
                <DatosPersonales prefijo="pedido" datos={datos} onCambiar={setDatos} mostrarErrores={intentado} />
                <Campo etiqueta="Empresa (opcional)" valor={empresa} onCambiar={setEmpresa} auto="organization" />
                <Campo
                  etiqueta="Variantes o aclaraciones (opcional)"
                  valor={aclaraciones}
                  onCambiar={setAclaraciones}
                  placeholder="Ej.: 3 milanesas napolitanas y 2 suizas, una sin sal"
                  largo
                />
                <Burbuja texto={mensaje} titulo="Así nos llega tu pedido" />
                <button type="button" onClick={() => ir(1)} className="enlace text-sm">
                  Cambiar platos
                </button>
                {/* Trampa para robots: invisible para las personas. */}
                <input ref={trampa} type="text" name="sitio" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                {envio === "error" && (
                  <p className="text-sm text-error" role="alert">
                    No se pudo enviar. Probá por WhatsApp o escribinos a {SITIO.mail}.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="shrink-0 border-t border-[color:var(--linea)] bg-papel px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-8">
          {!ultimo ? (
            <div className="flex items-center gap-2.5">
              {paso > 0 && (
                <button type="button" onClick={() => ir(paso - 1)} className="btn btn-fantasma sin-burbuja px-6">
                  Atrás
                </button>
              )}
              <button type="button" onClick={() => ir(paso + 1)} disabled={!puedeSeguir} className="btn btn-oscuro flex-1 disabled:cursor-not-allowed disabled:opacity-40">
                <span>{textoSeguir}</span>
                <span className="burbuja" aria-hidden="true">
                  <Icono nombre="der" className="size-4" grosor={2} />
                </span>
              </button>
            </div>
          ) : enviado ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button type="button" onClick={salir} className="btn btn-oscuro sin-burbuja w-full">
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
            // Por mail hacen falta los datos (el hotel responde a ese mail); por WhatsApp sale igual.
            <div className="grid gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void enviarMail()}
                disabled={envio === "enviando"}
                className="btn btn-oscuro sin-burbuja w-full disabled:opacity-50"
              >
                <Icono nombre="sobre" className="size-5" />
                {envio === "enviando" ? "Enviando…" : "Enviar pedido"}
              </button>
              <a
                href={linkWhatsApp(mensaje)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  track("pedido_whatsapp", { platos: total, personas });
                  conversionAds("pedido_whatsapp");
                  // Después del clic: el link tiene que abrirse antes de que el botón se reemplace.
                  window.setTimeout(() => marcarEnviado("whatsapp"));
                }}
                className="btn btn-wpp sin-burbuja w-full"
              >
                <Icono nombre="whatsapp" className="size-5" />
                Enviar por WhatsApp
              </a>
            </div>
          )}
        </footer>
      </div>
    </dialog>
  );
}
