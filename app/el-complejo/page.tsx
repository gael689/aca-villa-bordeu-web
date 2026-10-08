import Image from "next/image";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { JsonLd, motelJsonLd } from "@/lib/schema";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, PortadaPagina, Servicios, TarjetaEnlace } from "@/components/secciones/Comunes";
import { Predio } from "@/components/secciones/Predio";

export const metadata = meta({
  title: "El complejo: gimnasio, cocheras y más · ACA Villa Bordeu",
  description:
    "Departamentos, restaurante, gimnasio, sala de reuniones, lavandería, tienda y estación YPF en un mismo predio sobre la ruta, en Bahía Blanca. Recepción 24 h.",
  ruta: "/el-complejo",
});

const BLOQUES = [
  {
    id: "cocheras",
    titulo: "Cocheras cubiertas",
    texto: "Una por departamento, techada y enfrente de la puerta. La camioneta del trabajo o el auto de la familia quedan a la vista toda la noche.",
    fotos: [foto("predio", "cocheras-noche.jpg", "Galería de cocheras cubiertas de noche")],
  },
  {
    id: "gimnasio",
    titulo: "Gimnasio",
    texto: "Máquinas, bicicletas y pesas frente a los ventanales, con la pared verde y el cartel de neón. Para arrancar el día o soltar el cuerpo después del trabajo.",
    fotos: [
      foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio con pared verde, multigimnasio y bicicleta"),
      foto("gimnasio", "02-gym-ventanales.jpg", "Gimnasio con ventanales y máquinas"),
      foto("gimnasio", "03-cartel-gym.jpg", "Cartel del gimnasio Villa Bordeu"),
    ],
  },
  {
    id: "tienda",
    titulo: "Tienda Villa Bordeu",
    texto: "Chops, tazas y botellas con la marca del complejo. Un recuerdo de la ruta o un regalo para la vuelta.",
    fotos: [
      foto("tienda", "01-vitrina-completa.jpg", "Vitrina de la tienda con productos Villa Bordeu"),
      foto("tienda", "02-chops-y-tazas.jpg", "Chops y tazas con el logo ACA Villa Bordeu"),
      foto("tienda", "03-botellas.jpg", "Botellas térmicas con el logo ACA Villa Bordeu"),
    ],
  },
  {
    id: "cafeteria",
    titulo: "Recepción y cafetería",
    texto: "La recepción atiende las 24 horas. Al lado, la cafetería para el desayuno, un café de paso o la merienda.",
    fotos: [
      foto("cafeteria", "01-recepcion-cafeteria.jpg", "Recepción con mostrador de madera iluminado y cafetería"),
      foto("cafeteria", "03-mostrador.jpg", "Mostrador de la recepción"),
    ],
  },
];

export default function ElComplejo() {
  return (
    <>
      <PortadaPagina
        foto={foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio de Villa Bordeu con pared verde y cartel de neón")}
        etiqueta="El complejo"
        titulo={
          <>
            Todo en un <span className="text-rojo">mismo predio</span>
          </>
        }
        bajada="Departamentos, restaurante, gimnasio, sala de reuniones, tienda y estación de servicio, sobre el cruce de rutas."
        migas={[{ nombre: "El complejo", ruta: "/el-complejo" }]}
      >
        <BotonConsultar origen="complejo-portada">Consultar disponibilidad</BotonConsultar>
      </PortadaPagina>

      <Citable>
        En el predio de ACA Villa Bordeu hay 26 departamentos con cochera, restaurante, cafetería, gimnasio, sala de reuniones, lavandería, juegos para
        chicos, una tienda y la estación de servicio YPF.
      </Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <Predio titulo={false} />
        </div>
      </section>

      {BLOQUES.map((b, i) => (
        <section key={b.id} id={b.id} className="seccion-chica scroll-mt-[var(--header-h)]">
          <div className={`contenedor grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className={`grid gap-3 ${b.fotos.length > 1 ? "grid-cols-2" : ""}`}>
              {b.fotos.map((f, k) => (
                <div key={f.src} className={`tarjeta relative ${k === 0 && b.fotos.length > 1 ? "col-span-2 aspect-[16/10]" : "aspect-[4/3]"}`} data-clip data-delay={String(k * 0.08)}>
                  <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="num font-display text-[15px] font-bold text-rojo" data-reveal>
                0{i + 1}
              </p>
              <h2 className="t-h2 mt-3" data-split>
                {b.titulo}
              </h2>
              <p className="lead mt-5 text-asfalto" data-reveal>
                {b.texto}
              </p>
            </div>
          </div>
        </section>
      ))}

      <section className="seccion">
        <div className="contenedor grid gap-3 md:grid-cols-2">
          <TarjetaEnlace href="/sala-de-reuniones" foto={foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones")} titulo="Sala de reuniones" texto="Para capacitaciones y reuniones de obra" />
          <TarjetaEnlace href="/estacion-de-servicio" foto={foto("predio", "aerea-dia.jpg", "Vista aérea con la estación de servicio")} titulo="Estación de servicio" texto="YPF en el mismo predio" />
        </div>
      </section>

      <Servicios oscuro />
      <Cierre origen="complejo-cierre" />
      <JsonLd data={motelJsonLd()} />
    </>
  );
}
