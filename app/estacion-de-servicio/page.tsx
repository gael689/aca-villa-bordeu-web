import Image from "next/image";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { MAPAS, SITIO } from "@/lib/sitio";
import type { Pregunta } from "@/lib/tipos";
import { JsonLd, estacionJsonLd } from "@/lib/schema";
import { Icono } from "@/components/marca/Icono";
import { LogoACA } from "@/components/marca/Logo";
import { Cierre, Citable, FaqLista, PortadaPagina, TarjetaEnlace } from "@/components/secciones/Comunes";

export const metadata = meta({
  title: "Estación de servicio YPF en la ruta · ACA Villa Bordeu",
  description:
    "Estación de servicio ACA YPF en el acceso de las rutas 3 y 33 en Bahía Blanca, dentro del predio de Villa Bordeu. Cargás, comés en el Resto y seguís viaje.",
  ruta: "/estacion-de-servicio",
});

const PREGUNTAS: Pregunta[] = [
  { p: "¿Dónde está la estación?", r: `Dentro del predio de ACA Villa Bordeu, en ${SITIO.direccion.calle}, sobre el acceso de las rutas 3 y 33 en Bahía Blanca.` },
  { p: "¿Puedo cargar aunque no me aloje en Villa Bordeu?", r: "Sí, la estación atiende a todos los que pasan por la ruta." },
  { p: "¿Hay dónde comer al lado?", r: "Sí: el Resto y la cafetería están en el mismo predio, a pasos de los surtidores." },
];

export default function EstacionDeServicio() {
  const aerea = foto("predio", "aerea-dia.jpg", "Vista aérea del predio con la torre y la estación de servicio a la izquierda");
  return (
    <>
      <PortadaPagina
        foto={foto("ypf", "01-surtidores-atardecer.jpg", "Estación YPF de Villa Bordeu al atardecer, con los surtidores iluminados")}
        etiqueta="Estación de servicio"
        titulo={
          <>
            ACA YPF <span className="resalte">en la ruta</span>
          </>
        }
        bajada="Combustible en el mismo predio donde dormís y comés. Para seguir viaje o para la flota del equipo."
        alto="media"
        migas={[
          { nombre: "Instalaciones", ruta: "/instalaciones" },
          { nombre: "Estación de servicio", ruta: "/estacion-de-servicio" },
        ]}
      >
        <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="btn">
          <span>Cómo llegar</span>
          <span className="burbuja" aria-hidden="true">
            <Icono nombre="pin" className="size-4" grosor={2} />
          </span>
        </a>
      </PortadaPagina>

      <Citable>
        La estación de servicio ACA YPF de Villa Bordeu está en el acceso de las rutas nacionales 3 y 33, en Bahía Blanca, dentro del mismo predio que los
        habitaciones y el restaurante del Automóvil Club Argentino.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div className="tarjeta relative aspect-[9/5]" data-clip>
            <Image src={aerea.src} alt={aerea.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" placeholder="blur" blurDataURL={aerea.blurDataURL} className="object-cover" />
          </div>
          <div className="rounded-[var(--radio)] bg-grafito p-8 text-white md:p-10" data-reveal>
            <LogoACA className="h-9 w-auto text-marca-aca" />
            <p className="mt-6 font-display text-[30px] leading-[1] font-bold uppercase">ACA e YPF, juntos desde 1936</p>
            <p className="mt-4 text-white/70">
              El convenio entre el Automóvil Club Argentino e YPF armó una red de estaciones en todo el país. Hoy la alianza suma 190 estaciones, y una de ellas
              está acá, en el cruce de rutas de Bahía Blanca.
            </p>
            <p className="mt-4 text-[13px] text-white/45">Fuente: La Nación, enero de 2026.</p>
          </div>
        </div>
      </section>

      <FaqLista preguntas={PREGUNTAS} titulo="La estación" />

      <section className="seccion-chica gris">
        <div className="contenedor grid gap-3 md:grid-cols-2">
          <TarjetaEnlace href="/restaurante" foto={foto("restaurante", "01-salon-noche.jpg", "Salón del Resto")} titulo="Comé en el Resto" texto="A pasos de los surtidores" />
          <TarjetaEnlace href="/habitaciones" foto={foto("habitaciones", "01-triple-dos-camas.jpg", "Habitación")} titulo="Quedate a dormir" texto="Con el auto en la puerta" />
        </div>
      </section>

      <Cierre titulo="¿Parás esta noche?" modo="viaje" origen="ypf-cierre" />
      <JsonLd data={estacionJsonLd()} />
    </>
  );
}
