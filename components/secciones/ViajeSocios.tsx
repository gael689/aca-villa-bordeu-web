import Image from "next/image";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { Escudo } from "@/components/marca/Escudo";
import { LogoACA } from "@/components/marca/Logo";
import { Icono } from "@/components/marca/Icono";

/** Bloque doble: el viajero de ruta y el socio ACA. */
export function ViajeSocios() {
  const deptos = foto("habitaciones", "02-doble-escritorio.jpg", "Departamento con escritorio y TV");
  return (
    <section className="seccion gris">
      <div className="contenedor grid gap-4 lg:grid-cols-2">
        <Link href="/como-llegar" className="group tarjeta relative flex min-h-[520px] flex-col justify-between bg-grafito p-7 text-white md:p-10" data-reveal>
          <Image src={deptos.src} alt={deptos.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" placeholder="blur" blurDataURL={deptos.blurDataURL} className="object-cover opacity-55 transition-transform duration-[1.4s] ease-[var(--ease-pt)] group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/85" />
          <div className="relative flex gap-2">
            <Escudo numero="3" className="h-14 w-auto text-white" />
            <Escudo numero="22" className="h-14 w-auto text-white" />
          </div>
          <div className="relative">
            <p className="etiqueta !text-ambar">De paso por la ruta</p>
            <p className="t-h2 mt-4 max-w-[13ch]">Parás en la ruta. El auto, en la puerta.</p>
            <p className="mt-4 max-w-[38ch] text-white/75">La primera parada ACA en el camino al sur. Cenás, descansás, cargás combustible y seguís viaje sin entrar a la ciudad.</p>
            <span className="enlace mt-6 text-[15px]">Cómo llegar desde tu ciudad</span>
          </div>
        </Link>

        <Link href="/socios-aca" className="group tarjeta relative flex min-h-[520px] flex-col justify-between bg-rojo p-7 text-white md:p-10" data-reveal data-delay="0.1">
          <LogoACA className="h-12 w-auto self-start text-white" />
          <p aria-hidden="true" className="pointer-events-none absolute -right-6 -bottom-10 font-display text-[min(46vw,340px)] leading-none font-bold text-white/10">
            1904
          </p>
          <div className="relative">
            <p className="etiqueta !text-white">Socios ACA</p>
            <p className="t-h2 mt-4 max-w-[12ch]">Tu carnet también vale acá</p>
            <p className="mt-4 max-w-[38ch] text-white">Villa Bordeu es parte de la Red Hotelera del Automóvil Club Argentino. Contanos que sos socio al consultar.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold">
              Beneficios y la red hacia el sur
              <Icono nombre="flecha" className="size-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" grosor={2} />
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
