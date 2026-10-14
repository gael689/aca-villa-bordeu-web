import type { Distancia } from "@/lib/tipos";
import { DISTANCIAS_TRABAJO } from "@/lib/datos";
import { Escudo } from "@/components/marca/Escudo";
import { Icono } from "@/components/marca/Icono";

/**
 * «A cuánto estás». Cada destino es una fila con su ruta dibujada: una línea
 * punteada (la doble amarilla de la ruta) que crece desde el predio
 * hasta su distancia al entrar en pantalla (motor: data-linea + data-contador).
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
  const max = Math.max(...lista.map((d) => d.km));
  const orden = [...lista].sort((a, b) => a.km - b.km);
  return (
    <div>
      {encabezado && (
        <div className="mb-10 grid gap-6 md:mb-14 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              Ubicación
            </p>
            <h2 className="t-h2 mt-4" data-split>
              {titulo}
            </h2>
          </div>
          <div className="flex items-center gap-3 lg:justify-self-end" data-reveal>
            <Escudo numero="3" className="h-9 w-auto text-tinta" dibujar />
            <Escudo numero="33" className="h-9 w-auto text-tinta" dibujar />
            <Escudo numero="35" className="h-9 w-auto text-tinta" dibujar />
            <p className="ml-2 max-w-[26ch] text-[15px] text-asfalto">{bajada}</p>
          </div>
        </div>
      )}

      <ol className="border-t border-[color:var(--linea)]">
        {orden.map((d, i) => (
          <li key={d.lugar} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-3 border-b border-[color:var(--linea)] py-5 md:grid-cols-[260px_1fr_110px] lg:grid-cols-[320px_1fr_120px] md:py-6">
            <div className="min-w-0">
              <p className="font-display text-[clamp(20px,1.7vw,26px)] leading-tight font-bold uppercase">{d.lugar}</p>
              {d.nota && <p className="text-[13px] text-asfalto">{d.nota}</p>}
            </div>

            {/* La ruta */}
            <div className="relative col-span-2 flex h-6 items-center md:col-span-1 md:row-start-1 md:col-start-2" aria-hidden="true">
              <span className="grid size-6 shrink-0 place-items-center rounded-full bg-tinta text-white">
                <Icono nombre="pin" className="size-3" grosor={2.6} />
              </span>
              <span className="relative ml-1 block h-[3px] flex-1">
                <span
                  className="absolute inset-y-0 left-0 block rounded-full bg-[repeating-linear-gradient(90deg,var(--color-amarillo-hondo)_0_14px,transparent_14px_22px)]"
                  style={{ width: `${Math.max(8, (d.km / max) * 100)}%` }}
                  data-linea
                  data-delay={String(i * 0.08)}
                />
                <span
                  className="absolute top-1/2 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-amarillo bg-papel"
                  style={{ left: `${Math.max(8, (d.km / max) * 100)}%` }}
                />
              </span>
            </div>

            <p className="num row-start-1 text-right md:col-start-3">
              <span className="font-display text-[clamp(30px,2.6vw,42px)] leading-none font-bold">
                <span data-contador={d.km}>{d.km}</span>
              </span>
              <span className="ml-1 text-[15px] font-semibold text-asfalto">km</span>
              <span className="block text-[13px] text-asfalto">~{d.min} min</span>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
