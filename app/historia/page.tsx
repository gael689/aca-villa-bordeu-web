import Image from "next/image";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, PortadaPagina } from "@/components/secciones/Comunes";

export const metadata = meta({
  title: "Nuestra historia · ACA Villa Bordeu, Bahía Blanca",
  description:
    "Del Automóvil Club Argentino de 1904 a ACA Villa Bordeu, en el cruce de rutas de Bahía Blanca, abierto desde 1984. Una historia de ruta.",
  ruta: "/historia",
});

// Hitos con fuente (relevamiento/mercado.md §1). Los de Villa Bordeu se completan con datos del cliente.
const HITOS = [
  {
    anio: "1904",
    titulo: "Nace el Automóvil Club Argentino",
    texto: "El 11 de junio de 1904 se funda el ACA para fomentar el turismo en auto y pedir la construcción de caminos.",
    foto: null,
  },
  {
    anio: "1936",
    titulo: "El convenio con YPF",
    texto: "El Plan ACA–YPF le da al club una red nacional de combustible, auxilio y alojamiento. Es la base de la red de estaciones que sigue hasta hoy.",
    foto: null,
  },
  {
    anio: "1984",
    titulo: "Abre Villa Bordeu",
    texto: "Abre sus puertas en el cruce de rutas de Bahía Blanca: alojamiento y restaurante para los que paran en la ruta.",
    foto: foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de botellas del Resto"),
  },
  {
    anio: "Hoy",
    titulo: "Todo en un mismo predio",
    texto: "Las habitaciones, el gimnasio, sala de reuniones, tienda propia y la estación YPF. La base de los equipos que trabajan en la zona y de los viajeros que van al sur.",
    foto: foto("habitaciones", "01-triple-dos-camas.jpg", "Habitación con paredes grafito y cabecera de madera"),
  },
];

export default function Historia() {
  return (
    <>
      <PortadaPagina
        foto={foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de madera con botellas iluminadas en el Resto")}
        etiqueta="Nuestra historia"
        titulo={
          <>
            Nuestra historia: más de un siglo <span className="resalte">en la ruta</span>
          </>
        }
        bajada="Del club que en 1904 pedía caminos al cruce de rutas donde hoy paran los equipos que trabajan en Bahía Blanca."
        alto="media"
        migas={[{ nombre: "Historia", ruta: "/historia" }]}
      />

      <section className="seccion">
        <div className="contenedor">
          {/* La línea va fuera del <ol>: dentro de una lista solo puede haber <li>. */}
          <div className="relative">
            <span aria-hidden="true" className="absolute top-0 bottom-0 left-[11px] w-[2px] bg-[color:var(--linea)] md:left-1/2" />
            <ol>
              {HITOS.map((h, i) => (
                <li key={h.anio} className={`relative grid gap-6 pb-16 pl-10 md:grid-cols-2 md:gap-16 md:pl-0 ${i % 2 ? "" : "md:[&>*:first-child]:order-2"}`}>
                  <span aria-hidden="true" className="absolute top-3 left-0 size-6 rounded-full border-4 border-papel bg-amarillo md:left-1/2 md:-translate-x-1/2" />
                  <div className={i % 2 ? "md:pl-12" : "md:pr-12 md:text-right"}>
                    <p className="font-display text-[clamp(72px,9vw,150px)] leading-[0.85] font-bold text-acento" data-reveal>
                      {/^\d{4}$/.test(h.anio) ? <time dateTime={h.anio}>{h.anio}</time> : h.anio}
                    </p>
                    <h2 className="mt-3 font-display text-[32px] leading-none font-bold uppercase" data-reveal>
                      {h.titulo}
                    </h2>
                    <p className={`mt-3 max-w-[40ch] text-[17px] text-asfalto ${i % 2 ? "" : "md:ml-auto"}`} data-reveal>
                      {h.texto}
                    </p>
                  </div>
                  <div className={i % 2 ? "md:pr-12" : "md:pl-12"}>
                    {h.foto && (
                      <div className="tarjeta relative aspect-[4/3]" data-clip>
                        <Image src={h.foto.src} alt={h.foto.alt} fill sizes="(min-width: 768px) 45vw, 100vw" placeholder="blur" blurDataURL={h.foto.blurDataURL} className="object-cover" />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex justify-center" data-reveal>
            <BotonConsultar origen="historia">Sumate a la historia</BotonConsultar>
          </div>
        </div>
      </section>

      <Cierre origen="historia-cierre" />
    </>
  );
}
