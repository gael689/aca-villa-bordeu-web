import Link from "next/link";
import { SITIO, MAPAS, mailLink, telLink } from "@/lib/sitio";
import { RUBROS } from "@/lib/rubros";
import { RUTAS } from "@/lib/rutas";
import { LUGARES } from "@/lib/cerca";
import { linkGenerico } from "@/lib/mensaje";
import { LogoACA } from "@/components/marca/Logo";
import { Icono } from "@/components/marca/Icono";
import { Escudo } from "@/components/marca/Escudo";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

const PRINCIPAL = [
  { href: "/empresas", texto: "Empresas" },
  { href: "/departamentos", texto: "Departamentos" },
  { href: "/restaurante", texto: "Restaurante" },
  { href: "/el-complejo", texto: "El complejo" },
  { href: "/sala-de-reuniones", texto: "Sala de reuniones" },
  { href: "/estacion-de-servicio", texto: "Estación de servicio" },
  { href: "/socios-aca", texto: "Socios ACA" },
  { href: "/historia", texto: "Historia" },
  { href: "/preguntas-frecuentes", texto: "Preguntas frecuentes" },
  { href: "/contacto", texto: "Contacto" },
];

export function Footer() {
  return (
    <footer className="oscuro grano relative overflow-hidden pt-[clamp(72px,9vw,140px)] pb-[calc(96px+env(safe-area-inset-bottom))] md:pb-10">
      <div className="contenedor relative">
        {/* Cierre comercial */}
        <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="etiqueta">Recepción abierta las 24 horas</p>
            <p className="t-h2 mt-4 max-w-[14ch]">¿Cuántos son y desde cuándo?</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <BotonConsultar origen="pie">Consultar disponibilidad</BotonConsultar>
            <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja">
              <Icono nombre="whatsapp" className="size-5" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr]">
          <div>
            <LogoACA className="h-10 w-auto text-rojo" titulo="Automóvil Club Argentino" />
            <p className="mt-5 max-w-[30ch] text-white/70">
              Motel del Automóvil Club Argentino sobre el cruce de las rutas 3, 33 y 35, en Bahía Blanca.
            </p>
            <address className="mt-6 space-y-2.5 not-italic">
              <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-white/85 hover:text-white">
                <Icono nombre="pin" className="mt-0.5 size-5 shrink-0 text-rojo" />
                <span>
                  {SITIO.direccion.calle}
                  <br />
                  <span className="text-white/60">{SITIO.direccion.acceso} · {SITIO.direccion.ciudad}</span>
                </span>
              </a>
              <a href={telLink} className="flex items-center gap-3 text-white/85 hover:text-white">
                <Icono nombre="telefono" className="size-5 shrink-0 text-rojo" /> {SITIO.telefono}
              </a>
              <a href={mailLink} className="flex items-center gap-3 break-all text-white/85 hover:text-white">
                <Icono nombre="sobre" className="size-5 shrink-0 text-rojo" /> {SITIO.mail}
              </a>
            </address>
            <div className="mt-6 flex gap-2">
              <a href={SITIO.redes.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid size-11 place-items-center rounded-full bg-white/8 transition-colors hover:bg-rojo">
                <Icono nombre="facebook" className="size-5" />
              </a>
              <a href={linkGenerico()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full bg-white/8 transition-colors hover:bg-wpp">
                <Icono nombre="whatsapp" className="size-5" />
              </a>
            </div>
          </div>

          <nav aria-label="Secciones">
            <p className="mb-4 text-[13px] font-semibold tracking-[0.18em] text-white/45 uppercase">El complejo</p>
            <ul className="space-y-2">
              {PRINCIPAL.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-white/80 transition-colors hover:text-white">
                    {l.texto}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Empresas">
            <p className="mb-4 text-[13px] font-semibold tracking-[0.18em] text-white/45 uppercase">Para empresas</p>
            <ul className="space-y-2">
              <li>
                <Link href="/empresas" className="text-white/80 hover:text-white">
                  Alojamiento para equipos
                </Link>
              </li>
              {RUBROS.map((r) => (
                <li key={r.slug}>
                  <Link href={`/empresas/${r.slug}`} className="text-white/80 hover:text-white">
                    {r.nombre}
                  </Link>
                </li>
              ))}
              {LUGARES.map((l) => (
                <li key={l.slug}>
                  <Link href={`/cerca-de/${l.slug}`} className="text-white/80 hover:text-white">
                    Cerca de {l.nombre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Cómo llegar">
            <p className="mb-4 text-[13px] font-semibold tracking-[0.18em] text-white/45 uppercase">Cómo llegar</p>
            <ul className="space-y-2.5">
              {RUTAS.map((r) => (
                <li key={r.slug}>
                  <Link href={`/como-llegar/${r.slug}`} className="flex items-center gap-2.5 text-white/80 hover:text-white">
                    <Escudo numero={r.rutaNacional} className="h-7 w-auto shrink-0 text-white/70" />
                    Desde {r.origen}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Firma gigante */}
        <p aria-hidden="true" className="pointer-events-none font-display text-[22vw] leading-[0.78] font-bold tracking-[-0.02em] text-white/[0.045] uppercase select-none lg:text-[17.5vw]">
          Villa Bordeu
        </p>

        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-[13px] text-white/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} ACA Villa Bordeu · Red Hotelera del{" "}
            <a href={SITIO.aca.red} target="_blank" rel="noopener noreferrer" className="enlace font-normal">
              Automóvil Club Argentino
            </a>
          </p>
          <p>
            Sitio por{" "}
            <a href="https://gaelgonzalez.com.ar" target="_blank" rel="noopener" className="enlace font-normal">
              Gael González
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
