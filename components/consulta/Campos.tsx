"use client";

import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { erroresDatos, type CampoDato, type Datos } from "@/lib/mensaje";
import { Icono } from "@/components/marca/Icono";

// Piezas compartidas por el panel de reservas y el pedido del Resto.

/** Escribe el mensaje como si se estuviera tipeando; solo la primera vez que aparece. */
export function Burbuja({ texto, titulo = "Así nos llega tu consulta" }: { texto: string; titulo?: string }) {
  const [n, setN] = useState<number>(0);
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
      <figcaption className="mb-2 text-[13px] font-semibold text-asfalto">{titulo}</figcaption>
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

export function Contador({
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

export function Opcion({
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

export function Campo({
  id,
  etiqueta,
  valor,
  onCambiar,
  auto,
  placeholder,
  tipo = "text",
  modoTeclado,
  requerido = false,
  error,
  largo = false,
}: {
  id?: string;
  etiqueta: string;
  valor: string;
  onCambiar: (v: string) => void;
  auto?: string;
  placeholder?: string;
  tipo?: "text" | "tel" | "email" | "time";
  modoTeclado?: HTMLAttributes<HTMLInputElement>["inputMode"];
  requerido?: boolean;
  error?: string;
  /** área de texto de varias líneas */
  largo?: boolean;
}) {
  const clase = [
    "w-full rounded-xl bg-white px-4 text-[16px] outline-none transition-shadow placeholder:text-asfalto/60 focus:shadow-[inset_0_0_0_2px_var(--color-tinta)]",
    error ? "shadow-[inset_0_0_0_1.5px_var(--color-error)]" : "shadow-[inset_0_0_0_1px_var(--linea)]",
  ].join(" ");
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-semibold text-asfalto">
        {etiqueta}
        {requerido && <span className="text-acento"> *</span>}
      </span>
      {largo ? (
        <textarea
          id={id}
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          placeholder={placeholder}
          maxLength={400}
          rows={3}
          className={`${clase} block resize-none py-3`}
        />
      ) : (
        <input
          id={id}
          type={tipo}
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          autoComplete={auto}
          inputMode={modoTeclado}
          placeholder={placeholder}
          required={requerido}
          aria-invalid={error ? true : undefined}
          aria-describedby={error && id ? `${id}-error` : undefined}
          maxLength={120}
          className={`${clase} h-12`}
        />
      )}
      {error && (
        <span id={id ? `${id}-error` : undefined} className="mt-1 block text-[13px] text-error">
          {error}
        </span>
      )}
    </label>
  );
}

/** Nombre y apellido, teléfono y e-mail, marcados con *: obligatorios para enviar por mail. */
export function DatosPersonales({
  prefijo,
  datos,
  onCambiar,
  mostrarErrores,
}: {
  prefijo: string;
  datos: Datos;
  onCambiar: (d: Datos) => void;
  mostrarErrores: boolean;
}) {
  const e = mostrarErrores ? erroresDatos(datos) : {};
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-[15px] font-semibold">
        Tus datos
      </legend>
      <Campo
        id={`${prefijo}-nombre`}
        etiqueta="Nombre y apellido"
        valor={datos.nombre}
        onCambiar={(v) => onCambiar({ ...datos, nombre: v })}
        auto="name"
        requerido
        error={e.nombre}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <Campo
          id={`${prefijo}-telefono`}
          etiqueta="Teléfono"
          tipo="tel"
          modoTeclado="tel"
          valor={datos.telefono}
          onCambiar={(v) => onCambiar({ ...datos, telefono: v })}
          auto="tel"
          placeholder="Ej.: 291 456-7890"
          requerido
          error={e.telefono}
        />
        <Campo
          id={`${prefijo}-email`}
          etiqueta="E-mail"
          tipo="email"
          modoTeclado="email"
          valor={datos.email}
          onCambiar={(v) => onCambiar({ ...datos, email: v })}
          auto="email"
          requerido
          error={e.email}
        />
      </div>
    </fieldset>
  );
}

/** Lleva el foco al primer dato que falta. Devuelve false si falta alguno. */
export function revisarDatos(prefijo: string, datos: Datos): boolean {
  const e = erroresDatos(datos);
  const primero = (["nombre", "telefono", "email"] as CampoDato[]).find((c) => e[c]);
  if (!primero) return true;
  const el = document.getElementById(`${prefijo}-${primero}`);
  el?.scrollIntoView({ behavior: "smooth", block: "center" });
  el?.focus({ preventScroll: true });
  return false;
}

/**
 * Lo que queda a la vista después de enviar. Al cerrar el panel se borra todo
 * (pedido del cliente, oct/2026): la próxima consulta o pedido arranca en blanco.
 */
export function Enviado({ canal, que, email }: { canal: "whatsapp" | "mail"; que: "consulta" | "pedido"; email: string }) {
  const titulo = canal === "whatsapp" ? "Se abrió WhatsApp" : que === "pedido" ? "Recibimos tu pedido" : "Recibimos tu consulta";
  const texto =
    canal === "whatsapp"
      ? `Tu ${que} ya está escrito en WhatsApp: solo falta tocar enviar. Si no se abrió, probá con el botón de abajo.`
      : que === "pedido"
        ? `Te lo confirmamos a ${email.trim()} lo antes posible.`
        : `Te respondemos a ${email.trim()} lo antes posible. Recepción abierta las 24 horas.`;
  return (
    <div className="paso-entra mx-auto mt-2 flex max-w-[620px] items-start gap-3 rounded-2xl bg-tinta p-5 text-white" role="status">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-wpp">
        <Icono nombre={canal === "whatsapp" ? "whatsapp" : "check"} className="size-5" grosor={2.4} />
      </span>
      <p>
        <strong className="block font-display text-2xl uppercase">{titulo}</strong>
        {texto}
      </p>
    </div>
  );
}
