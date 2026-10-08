import type { Distancia } from "@/lib/tipos";
import { DISTANCIAS_TRABAJO } from "@/lib/datos";
import { Escudo } from "@/components/marca/Escudo";

/**
 * Tablero «A cuánto estás», con estética de cartel de distancias vial.
 * Los números cuentan hasta su valor una vez (motor: data-contador).
 */
export function Distancias({
  lista = DISTANCIAS_TRABAJO,
  titulo = "A cuánto estás",
  bajada = "Medido desde el predio, por la ruta y sin tránsito.",
  encabezado = true,
}: {
  lista?: Distancia[];
  titulo?: string;
  bajada?: string;
  encabezado?: boolean;
}) {
  return (
    <div>
      {encabezado && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <p className="etiqueta" data-reveal>
              Ubicación
            </p>
            <h2 className="t-h2 mt-4" data-split>
              {titulo}
            </h2>
          </div>
          <p className="max-w-[30ch] text-asfalto" data-reveal>
            {bajada}
          </p>
        </div>
      )}
      <div className="cartel overflow-hidden text-white">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <Escudo numero="3" className="h-10 w-auto text-white" dibujar />
            <Escudo numero="33" className="h-10 w-auto text-white" dibujar />
            <Escudo numero="35" className="h-10 w-auto text-white" dibujar />
          </div>
          <p className="text-right text-[12px] font-semibold tracking-[0.2em] text-white/50 uppercase">Desde Villa Bordeu</p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((d) => (
            <li key={d.lugar} className="flex items-end justify-between gap-4 border-b border-white/8 px-5 py-5 sm:odd:border-r lg:border-r lg:[&:nth-child(3n)]:border-r-0 md:px-8 md:py-7">
              <div className="min-w-0">
                <p className="font-display text-[22px] leading-tight font-semibold uppercase md:text-[26px]">{d.lugar}</p>
                {d.nota && <p className="text-[13px] text-white/50">{d.nota}</p>}
              </div>
              <div className="shrink-0 text-right">
                <p className="num font-display text-[44px] leading-none font-bold text-ambar md:text-[56px]">
                  <span data-contador={d.km}>{d.km}</span>
                  <span className="ml-1 text-[18px] text-white/60">km</span>
                </p>
                <p className="num text-[13px] font-semibold text-white/55">~{d.min} min</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
