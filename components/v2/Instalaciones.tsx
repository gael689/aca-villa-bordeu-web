import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  BedDouble,
  Briefcase,
  ConciergeBell,
  Dumbbell,
  Fuel,
  PawPrint,
  Presentation,
  ShoppingBag,
  SquareParking,
  UtensilsCrossed,
  WashingMachine,
} from "lucide-react";
import { foto, type Foto } from "@/lib/fotos";
import { MosaicoDesplegable, type TileExtra } from "./MosaicoDesplegable";

type Tile = { Icono: LucideIcon; t: string; d: string; f: Foto | null; clase: string; href?: string };

// Lo principal, con el formato de «Todo en un mismo lugar»: verbo, ícono y una línea.
// Asimétrico en escritorio (4 columnas), dos columnas en celular.
const PRINCIPALES: Tile[] = [
  { Icono: BedDouble, t: "Dormí", d: "26 habitaciones con baño privado.", f: foto("habitaciones", "01-triple-dos-camas.jpg", "Habitación con cabecera de madera y luz cálida"), clase: "col-span-2 row-span-2", href: "/habitaciones" },
  { Icono: SquareParking, t: "Estacioná", d: "Cochera cubierta frente a la habitación.", f: foto("predio", "01-exterior-atardecer.jpg", "Exterior de Villa Bordeu al atardecer, con el estacionamiento y la estación YPF"), clase: "col-span-2" },
  { Icono: UtensilsCrossed, t: "Comé", d: "Restaurante en el predio.", f: foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche"), clase: "", href: "/restaurante" },
  { Icono: Dumbbell, t: "Entrená", d: "Gimnasio con ventanales.", f: foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio con pared verde y neón"), clase: "" },
  { Icono: Fuel, t: "Cargá", d: "Estación YPF en el predio.", f: foto("ypf", "01-surtidores-atardecer.jpg", "Surtidores de la estación YPF al atardecer"), clase: "", href: "/estacion-de-servicio" },
  { Icono: ConciergeBell, t: "Recepción y cafetería", d: "Abierta las 24 horas.", f: foto("cafeteria", "01-recepcion-cafeteria.jpg", "Recepción con mostrador iluminado y cafetería"), clase: "lg:col-span-2" },
];

// Lo que aparece al tocar «Y más…».
const EXTRAS: Tile[] = [
  { Icono: Briefcase, t: "Oficina de cortesía", d: "Un escritorio privado para trabajar tranquilo.", f: foto("oficina-cortesia", "01-oficina.jpg", "Oficina de cortesía con escritorio de madera, sillón y paredes de listones"), clase: "col-span-2" },
  { Icono: Presentation, t: "Sala de reuniones", d: "Mesa grande y pantalla.", f: foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga"), clase: "", href: "/sala-de-reuniones" },
  { Icono: ShoppingBag, t: "Tienda", d: "Productos Villa Bordeu.", f: foto("tienda", "01-vitrina-completa.jpg", "Vitrina con productos Villa Bordeu"), clase: "" },
  { Icono: WashingMachine, t: "Lavandería", d: "Para la ropa de todos los días y la de trabajo.", f: null, clase: "" },
  { Icono: PawPrint, t: "Pet friendly", d: "Tu mascota también viaja.", f: null, clase: "" },
];

const BASE = "group relative overflow-hidden rounded-[var(--radio)]";

function Contenido({ Icono, t, d, f }: Tile) {
  return (
    <>
      {f ? (
        <>
          <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-pt)] group-hover:scale-105" />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
        </>
      ) : null}
      <span className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-3.5 md:p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-amarillo text-tinta md:size-10">
          <Icono className="size-[18px] md:size-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className={`block font-display text-[clamp(19px,1.8vw,28px)] leading-none font-bold uppercase ${f ? "text-white" : "text-tinta"}`}>{t}</span>
          <span className={`mt-1 line-clamp-2 block text-[13px] leading-snug md:text-[14px] ${f ? "text-white/80" : "text-asfalto"}`}>{d}</span>
        </span>
      </span>
    </>
  );
}

function envolver(tile: Tile) {
  return tile.href ? (
    <Link href={tile.href} className="block size-full">
      <Contenido {...tile} />
    </Link>
  ) : (
    <Contenido {...tile} />
  );
}

const fondo = (tile: Tile) => (tile.f ? "bg-grafito" : "bg-white shadow-[inset_0_0_0_1px_var(--linea)]");

/**
 * Inicio · «Instalaciones»: une la propuesta de valor y el mosaico del predio en una
 * sola sección asimétrica (pedido del dueño, oct/2026). Lo secundario se despliega
 * con «Y más…» para no ocupar tanto espacio.
 */
export function Instalaciones() {
  const extras: TileExtra[] = [
    ...EXTRAS.map((tile) => ({ clave: tile.t, clase: `${BASE} ${fondo(tile)} ${tile.clase}`, contenido: envolver(tile) })),
    {
      clave: "ver-todas",
      clase: "col-span-2",
      contenido: (
        <Link href="/instalaciones" className="group flex size-full items-center justify-between gap-4 rounded-[var(--radio)] bg-tinta p-5 text-white md:p-6">
          <span className="font-display text-[clamp(22px,2vw,30px)] leading-none font-bold uppercase">Ver todas las instalaciones</span>
          <ArrowUpRight className="size-7 shrink-0 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
        </Link>
      ),
    },
  ];

  return (
    <section id="predio" className="seccion scroll-mt-[var(--header-h)]">
      <div className="contenedor">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              Instalaciones
            </p>
            <h2 className="t-h2 mt-4" data-split>
              Todo en un <span className="resalte">mismo lugar</span>
            </h2>
          </div>
          <p className="lead text-asfalto lg:justify-self-end" data-reveal>
            Llegás por la ruta, dejás el auto en la puerta, comés y descansás. Al otro día seguís sin entrar al centro.
          </p>
        </div>

        <MosaicoDesplegable
          className="mt-12 grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] lg:auto-rows-[230px] lg:grid-cols-4"
          principales={PRINCIPALES.map((tile, i) => (
            <li key={tile.t} className={`${BASE} ${fondo(tile)} ${tile.clase}`} data-clip data-delay={String(i * 0.05)}>
              {envolver(tile)}
            </li>
          ))}
          extras={extras}
        />
      </div>
    </section>
  );
}
