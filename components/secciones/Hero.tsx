import Image from "next/image";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";
import { BarraHero } from "./BarraHero";
import { CartelVivo } from "./CartelVivo";

const CAPAS = [
  foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche, con luces cálidas en el techo"),
  foto("habitaciones", "01-triple-dos-camas.jpg", "Departamento con paredes grafito y cabecera de madera"),
  foto("restaurante", "02-barra-led.jpg", "Barra del bar iluminada en azul"),
  foto("gimnasio", "01-gym-pared-verde.jpg", "Gimnasio con pared verde y cartel de neón"),
];

/** Portada del inicio: a sangre, con las dos puertas y la barra de consulta. */
export function Hero() {
  return (
    <section data-hero className="relative h-[100svh] min-h-[640px] bg-grafito text-white md:min-h-[720px]">
      <div data-hero-ventana className="absolute inset-0 overflow-hidden">
        {CAPAS.map((f, i) => (
          <div key={f.src} className="hero-capa" aria-hidden={i > 0}>
            <Image
              src={f.src}
              alt={i === 0 ? f.alt : ""}
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              loading={i === 0 ? undefined : "lazy"}
              sizes="100vw"
              quality={75}
              placeholder="blur"
              blurDataURL={f.blurDataURL}
              className="object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_11/0.55)_0%,rgb(10_10_11/0.15)_35%,rgb(10_10_11/0.35)_62%,rgb(10_10_11/0.9)_100%)]" />
      </div>

      <div data-hero-contenido className="contenedor relative flex h-full flex-col justify-end pt-[calc(var(--header-h)+16px)] pb-5 md:pb-8">
        <div className="hero-in mb-5 flex flex-wrap items-center gap-2" style={{ ["--i" as string]: 0 }}>
          <span className="chip !bg-white/12 !text-white backdrop-blur-md [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.18)]">
            <Icono nombre="escudo" className="size-4 text-rojo" grosor={2} /> Motel del Automóvil Club Argentino
          </span>
          <CartelVivo />
        </div>

        <h1 className="t-display max-w-[11ch]">
          <span className="hero-in block" style={{ ["--i" as string]: 1 }}>
            Tu base en
          </span>
          <span className="hero-in block text-rojo" style={{ ["--i" as string]: 2 }}>
            Bahía Blanca
          </span>
        </h1>

        <div className="mt-5 grid gap-6 sm:mt-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="hero-in lead hidden max-w-[34em] text-white/85 sm:block" style={{ ["--i" as string]: 3 }}>
            Sobre el cruce de las rutas 3, 33 y 35. Departamentos con cochera en la puerta, restaurante, gimnasio y estación de servicio en un mismo
            predio.
          </p>

          {/* Las dos puertas */}
          <div className="hero-in grid grid-cols-2 gap-2 sm:gap-3" style={{ ["--i" as string]: 4 }}>
            <Link
              href="/empresas"
              className="group relative flex min-h-[86px] flex-col justify-between overflow-hidden rounded-[20px] bg-rojo p-4 transition-transform duration-500 ease-[var(--ease-pt)] hover:-translate-y-1 sm:min-w-[230px] sm:p-5"
            >
              <span className="flex items-center justify-between">
                <Icono nombre="casco" className="size-6" grosor={1.7} />
                <Icono nombre="flecha" className="size-5 transition-transform duration-500 ease-[var(--ease-pt)] group-hover:translate-x-1 group-hover:-translate-y-1" grosor={2} />
              </span>
              <span className="mt-3 block font-display text-[22px] leading-none font-bold uppercase sm:text-[26px]">Vengo por trabajo</span>
            </Link>
            <Link
              href="/departamentos"
              className="group relative flex min-h-[86px] flex-col justify-between overflow-hidden rounded-[20px] bg-white/12 p-4 backdrop-blur-md transition-[transform,background] duration-500 ease-[var(--ease-pt)] [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.2)] hover:-translate-y-1 hover:bg-white/20 sm:min-w-[230px] sm:p-5"
            >
              <span className="flex items-center justify-between">
                <Icono nombre="ruta" className="size-6" grosor={1.7} />
                <Icono nombre="flecha" className="size-5 transition-transform duration-500 ease-[var(--ease-pt)] group-hover:translate-x-1 group-hover:-translate-y-1" grosor={2} />
              </span>
              <span className="mt-3 block font-display text-[22px] leading-none font-bold uppercase sm:text-[26px]">Estoy de viaje</span>
            </Link>
          </div>
        </div>

        <div className="hero-in mt-5 md:mt-7" style={{ ["--i" as string]: 5 }}>
          <BarraHero />
        </div>
      </div>
    </section>
  );
}
