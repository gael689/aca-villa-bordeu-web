import Image from "next/image";
import { foto } from "@/lib/fotos";

const ESCENAS = [
  { momento: "Al amanecer", titulo: "Desayuno antes de salir", texto: "Café, algo rico y a la camioneta, que está en la puerta.", f: foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA dibujado en la espuma") },
  { momento: "Al salir", titulo: "Recepción abierta siempre", texto: "El que sale de madrugada o vuelve tarde siempre encuentra a alguien.", f: foto("cafeteria", "01-recepcion-cafeteria.jpg", "Recepción abierta las 24 horas") },
  { momento: "A la tarde", titulo: "Reunión de equipo", texto: "La sala con pantalla para ordenar el día siguiente.", f: foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga") },
  { momento: "Al volver", titulo: "Un rato de gimnasio", texto: "Para soltar el cuerpo después de la jornada.", f: foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio con pared verde y neón") },
  { momento: "De noche", titulo: "Cena en el Resto", texto: "Mesa larga para todos, sin tener que manejar.", f: foto("restaurante", "01-salon-noche.jpg", "Salón del restaurante de noche") },
  { momento: "A descansar", titulo: "Cada uno a su habitación", texto: "Silencio, cama hecha y la ropa lista en la lavandería.", f: foto("habitaciones", "03-doble-vista-larga.jpg", "Habitación doble lista para descansar") },
];

/**
 * «Un día de tu equipo». En escritorio la sección se fija y avanza en
 * horizontal (motor: data-dia). En celular es un carrusel nativo con snap.
 *
 * El <div> de afuera no se toca: al fijar, GSAP mete la sección en un
 * `pin-spacer`, y si React la buscara como hija directa de <main> al cambiar de
 * página fallaría (removeChild) y la navegación se caería. React saca el div.
 */
export function DiaEquipo() {
  return (
    <div>
      <section data-dia className="oscuro relative overflow-hidden">
        <div className="flex min-h-[100svh] flex-col justify-center py-20 lg:h-[100svh] lg:py-0">
          <div className="contenedor mb-8 flex w-full items-end justify-between gap-6 lg:mb-12">
            <div>
              <p className="etiqueta">Un día de tu equipo</p>
              <p className="t-h2 mt-4 max-w-[14ch]">
                Todo resuelto, <span className="resalte">de punta a punta</span>
              </p>
            </div>
            <p className="hidden font-display text-[clamp(40px,5vw,84px)] leading-none font-bold text-white uppercase lg:block" data-dia-hora aria-hidden="true">
              Al amanecer
            </p>
          </div>
          <div className="sin-barra overflow-x-auto lg:overflow-visible">
            <ol data-dia-pista className="flex w-max snap-x snap-mandatory gap-3 px-[var(--gutter)] md:gap-5">
              {ESCENAS.map((e, i) => (
                <li
                  key={e.titulo}
                  data-dia-escena
                  data-hora={e.momento}
                  className="group tarjeta relative h-[56svh] max-h-[540px] w-[78vw] shrink-0 snap-center bg-grafito-2 sm:w-[46vw] lg:w-[min(30vw,460px)]"
                >
                  <Image src={e.f.src} alt={e.f.alt} fill sizes="(min-width: 1024px) 30vw, 78vw" placeholder="blur" blurDataURL={e.f.blurDataURL} className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-pt)] group-data-[activa=true]:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <p className="num font-display text-[15px] font-bold text-acento">
                      0{i + 1} · {e.momento}
                    </p>
                    <p className="mt-2 font-display text-[32px] leading-none font-bold uppercase md:text-[38px]">{e.titulo}</p>
                    <p className="mt-2 max-w-[30ch] text-white/70">{e.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="contenedor mt-8 hidden w-full lg:block">
            <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
              <div data-dia-barra className="h-full origin-left scale-x-0 bg-amarillo" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
