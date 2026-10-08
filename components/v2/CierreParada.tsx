import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { foto } from "@/lib/fotos";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

/** CTA final de la versión 2. */
export function CierreParada() {
  const f = foto("restaurante", "02-barra-led.jpg", "Barra iluminada de noche");
  return (
    <section className="relative overflow-hidden bg-grafito text-white">
      <div className="absolute inset-x-0 -inset-y-[12%]" data-parallax="10">
        <Image src={f.src} alt="" fill sizes="100vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover opacity-55" />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(10_10_11/0.35),rgb(10_10_11/0.85))]" />
      <div className="contenedor relative py-[clamp(100px,14vw,200px)] text-center">
        <h2 className="t-display mx-auto max-w-[14ch]" data-split>
          ¿Hacemos una <span className="text-rojo">parada</span>?
        </h2>
        <p className="lead mx-auto mt-5 text-white/80" data-reveal>
          Consultá disponibilidad y encontrá tu próxima parada en Bahía Blanca.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3" data-reveal>
          <BotonConsultar origen="v2-cierre">Consultar disponibilidad</BotonConsultar>
          <Link href="/como-llegar" className="btn btn-claro">
            <span>Cómo llegar</span>
            <span className="burbuja" aria-hidden="true">
              <MapPin className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
