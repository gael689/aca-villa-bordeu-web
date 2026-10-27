import Link from "next/link";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { DELEGACIONES as d } from "@/lib/delegaciones";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";
import { Cierre, Citable, FaqLista, PortadaPagina } from "@/components/secciones/Comunes";
import { Distancias } from "@/components/secciones/Distancias";
import { OficinaCortesia } from "@/components/secciones/OficinaCortesia";

export const metadata = meta({ title: d.title, description: d.description, ruta: `/${d.slug}` });

/** Delegaciones deportivas (20/10/2026): mismo armado que las páginas de rubro, con su propio contenido. */
export default function PaginaDelegaciones() {
  const [c, a] = d.foto.split("/");

  return (
    <>
      <PortadaPagina
        foto={foto(c, a, d.fotoAlt)}
        etiqueta="Delegaciones deportivas"
        titulo={d.h1}
        bajada={d.bajada}
        migas={[{ nombre: d.nombre, ruta: `/${d.slug}` }]}
      >
        <BotonConsultar modo="delegacion" origen="delegaciones">
          Consultar para la delegación
        </BotonConsultar>
      </PortadaPagina>

      <Citable>{d.citable}</Citable>

      <section className="seccion-chica">
        <div className="contenedor">
          <Distancias lista={d.distancias} titulo="Hasta la cancha" bajada="Medido desde el predio, por la ruta y sin tránsito." />
        </div>
      </section>

      <section className="seccion">
        <div className="contenedor">
          <p className="etiqueta" data-reveal>
            Cómo lo resolvemos
          </p>
          <h2 className="t-h2 mt-4 max-w-[16ch]" data-split>
            Lo que necesita la delegación
          </h2>
          <ul className="mt-12 grid gap-x-16 border-t border-[color:var(--linea)] md:grid-cols-2">
            {d.necesidades.map((n, i) => (
              <li key={n.titulo} className="grid grid-cols-[auto_1fr] gap-x-5 border-b border-[color:var(--linea)] py-8" data-reveal data-delay={String((i % 2) * 0.08)}>
                <p className="num font-display text-[15px] font-bold text-acento">0{i + 1}</p>
                <div>
                  <p className="font-display text-[26px] leading-none font-bold uppercase">{n.titulo}</p>
                  <p className="mt-3 text-asfalto">{n.texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <OficinaCortesia
        titulo={
          <>
            Un escritorio para <span className="resalte">el cuerpo técnico</span>
          </>
        }
        texto={d.oficina}
      />

      <FaqLista preguntas={d.preguntas} titulo="Preguntas de las delegaciones" />

      <section className="seccion-chica gris">
        <div className="contenedor flex flex-wrap gap-4 text-[15px]">
          <Link href="/restaurante" className="enlace">
            El restaurante y el pedido del equipo
          </Link>
          <Link href="/habitaciones" className="enlace">
            Las habitaciones
          </Link>
          <Link href="/sala-de-reuniones" className="enlace">
            Sala de reuniones
          </Link>
          <Link href="/como-llegar" className="enlace">
            Cómo llegar
          </Link>
        </div>
      </section>

      <Cierre modo="delegacion" origen="delegaciones-cierre" />
    </>
  );
}
