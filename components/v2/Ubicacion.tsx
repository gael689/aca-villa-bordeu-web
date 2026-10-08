import Link from "next/link";
import { MapPin } from "lucide-react";
import { DISTANCIAS_V2 } from "@/lib/datos";
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
              Bien ubicado para <span className="rojo-txt">llegar y seguir</span>
            </h2>
          </div>
          <div className="lg:justify-self-end" data-reveal>
            <p className="lead max-w-[30ch] text-asfalto">Estás cerca de todo, sin necesidad de entrar al centro.</p>
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
