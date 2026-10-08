import { Car, Wifi, ConciergeBell, UtensilsCrossed, Coffee, Dumbbell, WashingMachine, Presentation, PawPrint, Fuel } from "lucide-react";

const SERVICIOS = [
  { Icono: Car, t: "Cochera" },
  { Icono: Wifi, t: "Wi-Fi" },
  { Icono: ConciergeBell, t: "Recepción 24 h" },
  { Icono: UtensilsCrossed, t: "Restaurante" },
  { Icono: Coffee, t: "Desayuno" },
  { Icono: Dumbbell, t: "Gimnasio" },
  { Icono: WashingMachine, t: "Lavandería" },
  { Icono: Presentation, t: "Sala de reuniones" },
  { Icono: PawPrint, t: "Pet friendly" },
  { Icono: Fuel, t: "Estación de servicio" },
];

/** Servicios en dos filas finas con íconos, en vez de una grilla de tarjetas. */
export function ServiciosLinea() {
  return (
    <section className="seccion-chica">
      <div className="contenedor">
        <h2 className="sr-only">Servicios</h2>
        <ul className="grid grid-cols-2 border-t border-l border-[color:var(--linea)] sm:grid-cols-5">
          {SERVICIOS.map(({ Icono, t }, i) => (
            <li
              key={t}
              className="flex flex-col items-center gap-3 border-r border-b border-[color:var(--linea)] px-3 py-7 text-center md:py-9"
              data-reveal
              data-delay={String((i % 5) * 0.05)}
            >
              <Icono className="size-7 text-rojo" strokeWidth={1.4} aria-hidden="true" />
              <span className="text-[14px] font-semibold md:text-[15px]">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
