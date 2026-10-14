import { LOGO_ACA_PATH, LOGO_ACA_VIEWBOX } from "@/lib/logo";

/** Las letras ACA. Toma el color del texto (en la web, el rojo oficial del ACA: `text-marca-aca`). */
export function LogoACA({ className = "h-8 w-auto", titulo }: { className?: string; titulo?: string }) {
  return (
    <svg viewBox={LOGO_ACA_VIEWBOX} className={className} role={titulo ? "img" : undefined} aria-hidden={titulo ? undefined : true}>
      {titulo ? <title>{titulo}</title> : null}
      <path d={LOGO_ACA_PATH} fill="currentColor" />
    </svg>
  );
}

/**
 * Lockup de Villa Bordeu: ACA + «Villa Bordeu», como el cartel y el perfil de Facebook.
 * `tono="claro"` para usar sobre fotos o fondos oscuros.
 */
export function Lockup({ className = "", tono = "oscuro" }: { className?: string; tono?: "oscuro" | "claro" }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <LogoACA className="h-[26px] w-auto text-marca-aca md:h-[30px]" />
      <span
        className={[
          "border-l pl-3 font-display text-[15px] leading-[0.95] font-semibold tracking-[0.08em] uppercase md:text-[17px]",
          tono === "claro" ? "border-white/35 text-white" : "border-tinta/25 text-tinta",
        ].join(" ")}
      >
        Villa
        <br />
        Bordeu
      </span>
    </span>
  );
}
