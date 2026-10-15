import Image from "next/image";
import type { ReactNode } from "react";
import { foto } from "@/lib/fotos";

/**
 * La oficina de cortesía: foto y texto propio de cada página (empresas, socios,
 * cada rubro). Se muestra sin condiciones: las pone el hotel por WhatsApp o mail.
 */
export function OficinaCortesia({ titulo, texto, gris = true }: { titulo: ReactNode; texto: ReactNode; gris?: boolean }) {
  const oficina = foto("oficina-cortesia", "01-oficina.jpg", "Oficina de cortesía de Villa Bordeu, con escritorio de madera, sillón y paredes de listones");
  return (
    <section className={`seccion-chica ${gris ? "gris" : ""}`}>
      <div className="contenedor grid items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="tarjeta relative aspect-[16/10]" data-clip>
          <Image src={oficina.src} alt={oficina.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" blurDataURL={oficina.blurDataURL} className="object-cover" />
        </div>
        <div>
          <p className="etiqueta" data-reveal>
            Oficina de cortesía
          </p>
          <h2 className="t-h2 mt-4 max-w-[14ch]" data-split>
            {titulo}
          </h2>
          <p className="lead mt-5 text-asfalto" data-reveal>
            {texto}
          </p>
        </div>
      </div>
    </section>
  );
}
