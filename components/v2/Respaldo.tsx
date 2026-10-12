import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { foto } from "@/lib/fotos";
import { SITIO } from "@/lib/sitio";
import { LogoACA } from "@/components/marca/Logo";

const DATOS = [
  { n: String(SITIO.fundacionACA), t: "Fundación del Automóvil Club Argentino" },
  { n: "28", t: "Hoteles propios en la Red Hotelera ACA" },
  { n: String(SITIO.aliancaYPF), t: "Primer convenio ACA–YPF" },
];

/**
 * «El respaldo del ACA»: corta, para dar confianza. Datos con fuente en relevamiento/mercado.md.
 *
 * GUARDADA, SIN USO (12/10/2026): Rodrigo prefirió las dos tarjetas de la v1
 * (`ViajeSocios`). Para volver atrás, en app/page.tsx cambiar <ViajeSocios /> por
 * <Respaldo /> (import desde "@/components/v2/Respaldo"). Ojo: tiene la etiqueta
 * oscura en rojo y el café con el logo, que también usa el bloque del Resto.
 */
export function Respaldo() {
  const f = foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA dibujado en la espuma");
  return (
    <section className="oscuro grano relative overflow-hidden seccion">
      <div className="contenedor relative grid items-center gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
        <div className="relative aspect-[4/5] max-h-[620px] overflow-hidden rounded-[var(--radio)]" data-clip>
          <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 42vw, 100vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
        </div>
        <div>
          <LogoACA className="h-11 w-auto text-rojo" titulo="Automóvil Club Argentino" />
          <h2 className="t-h2 mt-8 max-w-[14ch]" data-split>
            El respaldo del ACA
          </h2>
          <p className="mt-5 max-w-[44ch] text-white/70" data-reveal>
            Villa Bordeu es parte de la Red Hotelera del Automóvil Club Argentino, la primera parada de la red camino a la Patagonia. Los socios tienen
            beneficios.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/12 pt-8">
            {DATOS.map((d) => (
              <div key={d.t} data-reveal>
                <dt className="sr-only">{d.t}</dt>
                <dd className="num font-display text-[clamp(34px,3.4vw,54px)] leading-none font-bold text-white">
                  <span data-contador={d.n}>{d.n}</span>
                </dd>
                <dd className="mt-2 text-[13px] text-white/55">{d.t}</dd>
              </div>
            ))}
          </dl>
          <Link href="/socios-aca" className="enlace mt-10 inline-flex items-center gap-2 text-[15px]">
            Beneficios para socios <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
