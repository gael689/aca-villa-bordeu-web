import Image from "next/image";
import Link from "next/link";
import { CalendarRange, Users, WashingMachine, MapPin, ArrowUpRight } from "lucide-react";
import { foto } from "@/lib/fotos";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

const BENEFICIOS = [
  { Icono: CalendarRange, titulo: "Estadías", texto: "De unos días a varias semanas." },
  { Icono: Users, titulo: "Equipos", texto: "Todos en el mismo predio." },
  { Icono: WashingMachine, titulo: "Lavandería", texto: "Para la ropa de trabajo." },
  { Icono: MapPin, titulo: "Ubicación", texto: "Minutos al Polo, al puerto y a Cerri." },
];

/** «También es una buena base para trabajar»: importante, pero sin dominar la página. */
export function Trabajo() {
  const f = foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga, sillas blancas y pantalla");
  return (
    <section className="seccion gris">
      <div className="contenedor grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radio)]" data-clip>
          <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
        </div>
        <div>
          <p className="etiqueta" data-reveal>
            Trabajo y estadías
          </p>
          <h2 className="t-h2 mt-4 max-w-[16ch]" data-split>
            También es una buena base <span className="rojo-txt">para trabajar</span>
          </h2>
          <p className="mt-5 max-w-[46ch] text-asfalto" data-reveal>
            Para estadías laborales, equipos o viajes de trabajo, Villa Bordeu reúne alojamiento, restaurante, estacionamiento y servicios en un mismo lugar.
          </p>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 border-t border-[color:var(--linea)]">
            {BENEFICIOS.map(({ Icono, titulo, texto }, i) => (
              <li key={titulo} className="border-b border-[color:var(--linea)] py-5" data-reveal data-delay={String(i * 0.06)}>
                <Icono className="size-6 text-rojo" strokeWidth={1.6} aria-hidden="true" />
                <p className="mt-3 font-display text-[22px] leading-none font-bold uppercase">{titulo}</p>
                <p className="mt-1 text-[14px] text-asfalto">{texto}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4" data-reveal>
            <BotonConsultar modo="empresa" origen="v2-trabajo">
              Consultar estadía
            </BotonConsultar>
            <Link href="/empresas" className="enlace inline-flex items-center gap-2 text-[15px]">
              Más para empresas <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
