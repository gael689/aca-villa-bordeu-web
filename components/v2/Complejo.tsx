import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Car, WashingMachine, Fuel } from "lucide-react";
import { foto } from "@/lib/fotos";

// Cada espacio con su foto y su nombre a la vista. Sin nada que tocar ni descubrir:
// se entiende de un vistazo. Asimétrico en escritorio, dos columnas en celular.
const ESPACIOS = [
  { t: "Departamentos", f: foto("habitaciones", "01-triple-dos-camas.jpg", "Departamento con cabecera de madera"), clase: "col-span-2 row-span-2", href: "/departamentos" },
  { t: "Restaurante", f: foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de botellas del Resto"), clase: "", href: "/restaurante" },
  { t: "Recepción 24 h", f: foto("cafeteria", "01-recepcion-cafeteria.jpg", "Recepción con mostrador iluminado"), clase: "" },
  { t: "Gimnasio", f: foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio con pared verde y neón"), clase: "" },
  { t: "Sala de reuniones", f: foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga"), clase: "", href: "/sala-de-reuniones" },
  { t: "Cafetería", f: foto("cafeteria", "02-cafeteria-mesas.jpg", "Cafetería con mesas negras"), clase: "col-span-2" },
  { t: "Tienda Villa Bordeu", f: foto("tienda", "01-vitrina-completa.jpg", "Vitrina con productos Villa Bordeu"), clase: "hidden lg:col-span-2 lg:block" },
];

const SIN_FOTO = [
  { Icono: Car, t: "Cochera cubierta frente a cada departamento" },
  { Icono: WashingMachine, t: "Lavandería" },
  { Icono: Fuel, t: "Estación de servicio YPF" },
];

export function Complejo() {
  return (
    <section id="predio" className="seccion gris scroll-mt-[var(--header-h)]">
      <div className="contenedor">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              El complejo
            </p>
            <h2 className="t-h2 mt-4" data-split>
              Más que un lugar <span className="rojo-txt">para dormir</span>
            </h2>
          </div>
          <Link href="/el-complejo" className="enlace inline-flex items-center gap-2 text-[15px] lg:justify-self-end" data-reveal>
            Ver todo el complejo <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ul className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px] lg:auto-rows-[220px] lg:grid-cols-4">
          {ESPACIOS.map(({ t, f, clase, href }, i) => {
            const contenido = (
              <>
                <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-pt)] group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                <span className="absolute bottom-3 left-4 font-display text-[clamp(18px,1.6vw,24px)] leading-none font-bold text-white uppercase md:bottom-4 md:left-5">{t}</span>
              </>
            );
            return (
              <li key={t} className={`group relative overflow-hidden rounded-[var(--radio)] bg-grafito ${clase}`} data-clip data-delay={String(i * 0.05)}>
                {href ? (
                  <Link href={href} className="block size-full" aria-label={t}>
                    {contenido}
                  </Link>
                ) : (
                  contenido
                )}
              </li>
            );
          })}
        </ul>

        <ul className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {SIN_FOTO.map(({ Icono, t }) => (
            <li key={t} className="flex items-center gap-2.5 text-[15px] font-semibold" data-reveal>
              <Icono className="size-5 text-rojo" strokeWidth={1.7} aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
