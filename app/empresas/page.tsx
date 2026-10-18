import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { RUBROS } from "@/lib/rubros";
import { FAQ_EMPRESAS } from "@/lib/faq";
import { JsonLd, motelJsonLd } from "@/lib/schema";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina, Servicios, TarjetaEnlace } from "@/components/secciones/Comunes";
import { Distancias } from "@/components/secciones/Distancias";
import { DiaEquipo } from "@/components/secciones/DiaEquipo";
import { ParaEmpresas } from "@/components/secciones/ParaEmpresas";
import { Cinta } from "@/components/secciones/Cinta";
import { OficinaCortesia } from "@/components/secciones/OficinaCortesia";

export const metadata = meta({
  title: "Alojamiento para empresas en Bahía Blanca · ACA Villa Bordeu",
  description:
    "Alojamiento para equipos de trabajo sobre la ruta en Bahía Blanca: habitaciones con cochera, restaurante, lavandería y gimnasio. Consultá por WhatsApp.",
  ruta: "/empresas",
});

const PASOS = [
  { n: "01", titulo: "Nos contás", texto: "Cuántos son, desde cuándo y qué necesitan. Por la consulta de la web, por WhatsApp o por mail." },
  { n: "02", titulo: "Te respondemos", texto: "Te pasamos todo por el mismo medio y armamos la estadía a la medida del equipo." },
  { n: "03", titulo: "Llega el equipo", texto: "Recepción las 24 horas, cada uno a su habitación y las camionetas en la puerta." },
];

export default function Empresas() {
  return (
    <>
      <PortadaPagina
        foto={foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga, sillas blancas y pantalla")}
        etiqueta="Para empresas"
        titulo={
          <>
            Alojamiento para <span className="resalte">empresas</span> en Bahía Blanca
          </>
        }
        bajada="Tu equipo duerme, come y sale a trabajar desde un mismo predio, sobre el cruce de rutas y sin entrar al centro."
        migas={[{ nombre: "Empresas", ruta: "/empresas" }]}
      >
        <BotonConsultar modo="empresa" origen="empresas-portada">
          Consultar para mi equipo
        </BotonConsultar>
      </PortadaPagina>

      <Cinta tono="oscuro" />

      <Citable>
        ACA Villa Bordeu aloja equipos de trabajo en habitaciones con cochera cubierta, sobre las rutas 3, 33 y 35, a minutos del
        Polo Petroquímico, el puerto y General Cerri.
      </Citable>

      {/* Efecto de la v1: foto fija que cambia con la razón que se lee */}
      <ParaEmpresas />

      {/* Cómo funciona */}
      <section className="seccion-chica">
        <div className="contenedor">
          <p className="etiqueta" data-reveal>
            Cómo funciona
          </p>
          <ol className="mt-8 grid border-t border-[color:var(--linea)] md:grid-cols-3">
            {PASOS.map((p, i) => (
              <li key={p.n} className="border-b border-[color:var(--linea)] py-8 md:border-b-0 md:py-10 md:pr-10 md:[&+li]:border-l md:[&+li]:pl-10" data-reveal data-delay={String(i * 0.1)}>
                <p className="num font-display text-[56px] leading-none font-bold text-acento">{p.n}</p>
                <p className="mt-4 font-display text-[28px] leading-none font-bold uppercase">{p.titulo}</p>
                <p className="mt-3 max-w-[34ch] text-asfalto">{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex justify-center" data-reveal>
            <BotonConsultar modo="empresa" origen="empresas-pasos">
              Empezar la consulta
            </BotonConsultar>
          </div>
        </div>
      </section>

      <OficinaCortesia
        titulo={
          <>
            Un escritorio para <span className="resalte">el que coordina</span>
          </>
        }
        texto="Además de la habitación, el equipo tiene una oficina de cortesía con escritorio privado: para cerrar el parte del día, hacer una videollamada o recibir a un proveedor sin salir del predio."
      />

      <section className="seccion">
        <div className="contenedor">
          <Distancias bajada="Medido desde el predio. Salen directo al acceso, sin cruzar la ciudad." />
        </div>
      </section>

      <DiaEquipo />

      {/* Por rubro */}
      <section className="seccion gris">
        <div className="contenedor">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="etiqueta" data-reveal>
                Por rubro
              </p>
              <h2 className="t-h2 mt-4 max-w-[14ch]" data-split>
                Sabemos cómo trabaja tu equipo
              </h2>
            </div>
            <p className="max-w-[34ch] text-asfalto" data-reveal>
              Cada obra tiene su ritmo. Mirá cómo se organiza la estadía según el trabajo.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {RUBROS.map((r) => {
              const [c, a] = r.foto.split("/");
              return <TarjetaEnlace key={r.slug} href={`/empresas/${r.slug}`} foto={foto(c, a, r.fotoAlt)} titulo={r.nombre} />;
            })}
          </div>
        </div>
      </section>

      <Servicios titulo="Todo lo que el equipo necesita" />
      <FaqLista preguntas={FAQ_EMPRESAS} titulo="Lo que preguntan las empresas" jsonLd={false} />
      <Cierre modo="empresa" origen="empresas-cierre" imagen={foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones")} />
      <JsonLd data={motelJsonLd()} />
    </>
  );
}
