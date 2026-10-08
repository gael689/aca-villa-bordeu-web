import Image from "next/image";
import { BedDouble, SquareParking, UtensilsCrossed, Route } from "lucide-react";
import { foto } from "@/lib/fotos";
import { Escudo } from "@/components/marca/Escudo";

const ITEMS = [
  { Icono: BedDouble, verbo: "Dormí", texto: "Departamentos cómodos, con baño privado.", f: foto("habitaciones", "01-triple-dos-camas.jpg", "Departamento con cabecera de madera y luz cálida") },
  { Icono: SquareParking, verbo: "Estacioná", texto: "Cochera cubierta frente al departamento.", f: foto("habitaciones", "06-pasillo.jpg", "Pasillo con la puerta de cada departamento") },
  { Icono: UtensilsCrossed, verbo: "Comé", texto: "Restaurante en el complejo, desde 1984.", f: foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche") },
  { Icono: Route, verbo: "Seguí", texto: "Acceso directo a las rutas 3, 33 y 35.", f: null },
];

/**
 * Propuesta de valor de la versión 2: cuatro verbos que explican por qué parar
 * acá. Composición escalonada (las columnas pares bajan), sin tarjetas.
 */
export function PorQue() {
  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 className="t-h2" data-split>
            Todo en un <span className="rojo-txt">mismo lugar</span>
          </h2>
          <p className="lead text-asfalto lg:justify-self-end" data-reveal>
            Llegás por la ruta, dejás el auto en la puerta, comés y descansás. Al otro día seguís sin entrar al centro.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:mt-20 lg:grid-cols-4 lg:gap-x-6">
          {ITEMS.map(({ Icono, verbo, texto, f }, i) => (
            <li key={verbo} className={i % 2 ? "lg:translate-y-16" : ""} data-reveal data-delay={String(i * 0.08)}>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radio)] bg-grafito">
                {f ? (
                  <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 24vw, 50vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
                ) : (
                  // «Seguí»: no hay foto de la ruta; va el sistema gráfico de escudos.
                  <div className="grano absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_40%,#3a1418,#141516_70%)] text-white">
                    <div className="flex items-end gap-2">
                      <Escudo numero="3" className="h-11 w-auto sm:h-16 md:h-20" dibujar />
                      <Escudo numero="33" className="h-14 w-auto sm:h-20 md:h-24" dibujar />
                      <Escudo numero="35" className="h-11 w-auto sm:h-16 md:h-20" dibujar />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-rojo text-white">
                  <Icono className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <p className="font-display text-[clamp(24px,2.2vw,34px)] leading-none font-bold uppercase">{verbo}</p>
              </div>
              <p className="mt-2 max-w-[26ch] text-[15px] text-asfalto md:text-base">{texto}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
