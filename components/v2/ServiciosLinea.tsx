import { Car, Wifi, ConciergeBell, UtensilsCrossed, Coffee, Dumbbell, WashingMachine, Presentation, Briefcase, PawPrint, Fuel } from "lucide-react";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

// Mismos servicios confirmados que el resto del sitio, con una línea cada uno.
const SERVICIOS = [
  { Icono: Car, t: "Cochera", d: "Cubierta, frente a cada habitación." },
  { Icono: ConciergeBell, t: "Recepción 24 h", d: "Llegás a la hora que llegues." },
  { Icono: Wifi, t: "Wi-Fi", d: "En las habitaciones y en el Resto." },
  { Icono: UtensilsCrossed, t: "Restaurante", d: "El Resto cocina desde 1984." },
  { Icono: Coffee, t: "Desayuno", d: "También sin TACC." },
  { Icono: Dumbbell, t: "Gimnasio", d: "Para arrancar o cerrar el día." },
  { Icono: WashingMachine, t: "Lavandería", d: "Para la ropa de todos los días y la de trabajo." },
  { Icono: Presentation, t: "Sala de reuniones", d: "Mesa grande y pantalla." },
  { Icono: Briefcase, t: "Oficina de cortesía", d: "Un escritorio privado para trabajar tranquilo." },
  { Icono: PawPrint, t: "Pet friendly", d: "Tu mascota también viaja." },
  { Icono: Fuel, t: "Estación de servicio", d: "YPF en el mismo predio." },
];

/**
 * Servicios: título fijo a la izquierda y la lista a la derecha, en filas que
 * entran de a una con el ícono que se dibuja (motor: data-reveal + data-dibujar).
 */
export function ServiciosLinea() {
  return (
    <section className="seccion">
      <div className="contenedor grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+40px)] lg:self-start">
          <p className="etiqueta" data-reveal>
            Servicios
          </p>
          <h2 className="t-h2 mt-4 max-w-[12ch]" data-split>
            Lo que tenés <span className="resalte">en el predio</span>
          </h2>
          <p className="mt-5 max-w-[34ch] text-asfalto" data-reveal>
            Todo lo que hace falta para una noche o para varias semanas, sin salir del predio.
          </p>
          <div className="mt-8" data-reveal>
            <BotonConsultar origen="v2-servicios">Consultar disponibilidad</BotonConsultar>
          </div>
        </div>

        <ul className="grid border-t border-[color:var(--linea)] sm:grid-cols-2 sm:gap-x-10">
          {SERVICIOS.map(({ Icono, t, d }, i) => (
            <li key={t} className="group flex items-start gap-4 border-b border-[color:var(--linea)] py-5 md:py-6" data-reveal data-delay={String((i % 2) * 0.08 + Math.floor(i / 2) * 0.04)}>
              <span data-dibujar className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-acento shadow-[inset_0_0_0_1px_var(--linea)] transition-colors duration-500 group-hover:bg-amarillo group-hover:text-tinta">
                <Icono className="size-6" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-[22px] leading-none font-bold uppercase">{t}</span>
                <span className="mt-1.5 block text-[15px] text-asfalto">{d}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
