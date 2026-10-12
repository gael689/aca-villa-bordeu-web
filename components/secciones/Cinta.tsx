import { Escudo } from "@/components/marca/Escudo";
import { LogoACA } from "@/components/marca/Logo";

const ITEMS = ["ACA desde 1904", "Villa Bordeu desde 1984", "Estación YPF en el predio", "26 departamentos", "Recepción 24 horas", "Pet friendly"];
const RUTAS = ["3", "33", "35", "22"];

/** Cinta en movimiento con los escudos de ruta. Se inclina apenas con la velocidad del scroll. */
export function Cinta({ tono = "rojo" }: { tono?: "rojo" | "oscuro" }) {
  const fila = (
    <div className="flex shrink-0 items-center gap-8 pr-8 md:gap-12 md:pr-12">
      {ITEMS.map((t, i) => (
        <span key={t} className="flex items-center gap-8 md:gap-12">
          {i % 2 === 0 ? (
            <Escudo numero={RUTAS[(i / 2) % RUTAS.length]} className="h-11 w-auto md:h-14" />
          ) : (
            <LogoACA className="h-5 w-auto md:h-6" />
          )}
          <span className="font-display text-[30px] leading-none font-bold whitespace-nowrap uppercase md:text-[44px]">{t}</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={`overflow-hidden py-5 md:py-7 ${tono === "rojo" ? "bg-rojo text-white" : "bg-grafito text-white"}`}>
      <p className="sr-only">ACA desde 1904, Villa Bordeu desde 1984, estación YPF en el predio, 26 departamentos, recepción 24 horas, pet friendly.</p>
      <div data-sesgo aria-hidden="true">
        <div className="marquesina">
          {fila}
          {fila}
        </div>
      </div>
    </div>
  );
}
