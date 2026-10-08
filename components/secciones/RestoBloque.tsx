import Image from "next/image";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { MENSAJE_MESA, linkWhatsApp } from "@/lib/mensaje";
import { Icono } from "@/components/marca/Icono";

/** El Resto en el inicio: foto grande con parallax, «desde 1984» y la carta. */
export function RestoBloque() {
  const salon = foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche, con luces cálidas en el techo");
  const cava = foto("restaurante", "03-cava-vinos.jpg", "Cava de vinos detrás de la barra");
  const cafe = foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA dibujado en la espuma");
  return (
    <section className="seccion overflow-hidden">
      <div className="contenedor">
        <div className="grid gap-4 lg:grid-cols-12">
          <div className="tarjeta relative min-h-[420px] lg:col-span-8 lg:min-h-[560px]" data-clip>
            <div className="absolute inset-x-0 -inset-y-[9%]" data-parallax="7">
              <Image src={salon.src} alt={salon.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" placeholder="blur" blurDataURL={salon.blurDataURL} className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10">
              <p className="font-display text-[clamp(56px,7vw,120px)] leading-[0.8] font-bold">
                <span className="num" data-contador="1984">1984</span>
              </p>
              <p className="mt-2 font-display text-[22px] font-semibold uppercase md:text-[28px]">El año en que abrió el Resto</p>
            </div>
          </div>
          <div className="flex flex-col gap-4 lg:col-span-4">
            <div className="rounded-[var(--radio)] bg-white p-7 shadow-[inset_0_0_0_1px_var(--linea)] md:p-9" data-reveal>
              <p className="etiqueta">Restaurante</p>
              <h2 className="t-h2 mt-4">
                Comé sin salir <span className="rojo-txt">del complejo</span>
              </h2>
              <p className="mt-4 text-asfalto">Parrilla, pastas y platos de siempre. Cocinamos desde 1984.</p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                <Link href="/restaurante" className="btn btn-oscuro">
                  <span>Ver restaurante</span>
                  <span className="burbuja" aria-hidden="true">
                    <Icono nombre="der" className="size-4" grosor={2} />
                  </span>
                </Link>
                <a href={linkWhatsApp(MENSAJE_MESA)} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma sin-burbuja">
                  Reservar mesa
                </a>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-4">
              <div className="tarjeta relative min-h-[200px]" data-clip data-delay="0.1">
                <Image src={cava.src} alt={cava.alt} fill sizes="(min-width: 1024px) 16vw, 50vw" placeholder="blur" blurDataURL={cava.blurDataURL} className="object-cover" />
              </div>
              <div className="tarjeta relative min-h-[200px]" data-clip data-delay="0.2">
                <Image src={cafe.src} alt={cafe.alt} fill sizes="(min-width: 1024px) 16vw, 50vw" placeholder="blur" blurDataURL={cafe.blurDataURL} className="object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
