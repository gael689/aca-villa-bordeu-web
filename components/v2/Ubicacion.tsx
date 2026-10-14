import Link from "next/link";
import { MapPin } from "lucide-react";
import { DISTANCIAS_V2 } from "@/lib/datos";
import { MAPAS, SITIO } from "@/lib/sitio";
import { Distancias } from "@/components/secciones/Distancias";

/** «Bien ubicado para llegar y seguir»: la ubicación vendida como ventaja. */
export function Ubicacion() {
  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="mb-12 grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              Ubicación
            </p>
            <h2 className="t-h2 mt-4 max-w-[14ch]" data-split>
              Bien ubicado para <span className="resalte">llegar y seguir</span>
            </h2>
          </div>
          <div className="lg:justify-self-end" data-reveal>
            <p className="lead max-w-[34ch] text-asfalto">A minutos del puerto, del Polo Petroquímico y de Cerri, sin entrar al centro.</p>
            <a href={MAPAS.google} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-start gap-2.5 text-[15px] hover:text-acento">
              <MapPin className="mt-0.5 size-5 shrink-0 text-acento" aria-hidden="true" />
              <span>
                <span className="block font-semibold">{SITIO.direccion.calle}</span>
                <span className="text-asfalto">{SITIO.direccion.acceso} · {SITIO.direccion.ciudad}</span>
              </span>
            </a>
            <Link href="/como-llegar" className="btn btn-oscuro mt-6">
              <span>Cómo llegar</span>
              <span className="burbuja" aria-hidden="true">
                <MapPin className="size-4" />
              </span>
            </Link>
          </div>
        </div>
        <Distancias lista={DISTANCIAS_V2} encabezado={false} />
        <p className="mt-4 text-[13px] text-asfalto">Distancias desde el predio, por la ruta y sin tránsito.</p>
      </div>
    </section>
  );
}
