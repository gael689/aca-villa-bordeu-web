import Image from "next/image";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import type { Pregunta } from "@/lib/tipos";
import { Icono, type IconoNombre } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina } from "@/components/secciones/Comunes";

export const metadata = meta({
  title: "Sala de reuniones en Bahía Blanca · ACA Villa Bordeu",
  description:
    "Sala de reuniones con mesa para el equipo y pantalla, dentro del motel ACA sobre la ruta en Bahía Blanca. Para capacitaciones, inducciones y reuniones de obra.",
  ruta: "/sala-de-reuniones",
});

const USOS: { icono: IconoNombre; titulo: string; texto: string }[] = [
  { icono: "casco", titulo: "Inducciones", texto: "El primer día de la cuadrilla, todos juntos antes de salir a obra." },
  { icono: "reunion", titulo: "Reuniones de obra", texto: "Ordenar la semana con el equipo sin buscar un lugar en la ciudad." },
  { icono: "tv", titulo: "Capacitaciones", texto: "Pantalla para presentar y mesa para trabajar." },
  { icono: "cubiertos", titulo: "Con comida al lado", texto: "El Resto y la cafetería a pasos para el corte o el almuerzo." },
];

const PREGUNTAS: Pregunta[] = [
  { p: "¿La sala tiene pantalla?", r: "Sí, tiene una pantalla en la pared para presentar, y una mesa larga con sillas." },
  { p: "¿La puede usar una empresa que no se aloja en el complejo?", r: "Escribinos por WhatsApp o mail con la fecha y cuántos son, y te pasamos todo." },
  { p: "¿Se puede sumar café o almuerzo?", r: "Sí, el Resto y la cafetería están en el mismo edificio. Contanos qué necesitan cuando consultes." },
];

export default function SalaDeReuniones() {
  const mesa = foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga de madera, sillas blancas, bandera argentina y pantalla");
  const cartel = foto("sala-reuniones", "02-cartel-entrada.jpg", "Cartel de la sala de reuniones ACA Villa Bordeu");
  return (
    <>
      <PortadaPagina
        foto={mesa}
        etiqueta="Sala de reuniones"
        titulo={
          <>
            Sala de reuniones <span className="text-rojo">sobre la ruta</span>
          </>
        }
        bajada="Mesa para el equipo y pantalla para presentar, en el mismo predio donde duermen y comen."
        migas={[
          { nombre: "El complejo", ruta: "/el-complejo" },
          { nombre: "Sala de reuniones", ruta: "/sala-de-reuniones" },
        ]}
      >
        <BotonConsultar modo="empresa" rubro="Uso de la sala de reuniones" origen="sala-portada">
          Consultar por la sala
        </BotonConsultar>
      </PortadaPagina>

      <Citable>
        ACA Villa Bordeu tiene una sala de reuniones con pantalla y mesa larga en su predio de Bahía Blanca, pensada para inducciones, capacitaciones y
        reuniones de equipos que se alojan en el complejo.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <div className="tarjeta relative aspect-[4/3]" data-clip>
            <Image src={mesa.src} alt={mesa.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" placeholder="blur" blurDataURL={mesa.blurDataURL} className="object-cover" />
          </div>
          <div className="tarjeta relative aspect-[4/3] lg:aspect-auto" data-clip data-delay="0.1">
            <Image src={cartel.src} alt={cartel.alt} fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" blurDataURL={cartel.blurDataURL} className="object-cover" />
          </div>
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <p className="etiqueta" data-reveal>
            Para qué se usa
          </p>
          <h2 className="t-h2 mt-4 max-w-[14ch]" data-split>
            El lugar para ordenar el trabajo
          </h2>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {USOS.map((u, i) => (
              <li key={u.titulo} className="rounded-[var(--radio)] bg-white p-7 shadow-[inset_0_0_0_1px_var(--linea)]" data-reveal data-delay={String(i * 0.07)}>
                <Icono nombre={u.icono} className="size-8 text-rojo" grosor={1.5} />
                <p className="mt-5 font-display text-[26px] leading-none font-bold uppercase">{u.titulo}</p>
                <p className="mt-2 text-asfalto">{u.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FaqLista preguntas={PREGUNTAS} titulo="Sobre la sala" />
      <Cierre titulo="¿Para cuándo la necesitás?" modo="empresa" origen="sala-cierre" imagen={mesa} />
    </>
  );
}
