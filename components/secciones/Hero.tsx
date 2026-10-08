import Image from "next/image";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

// Solo fotos nítidas, recortadas desde los originales (fotos-seleccion/portada).
const CAPAS = [
  foto("portada", "02-departamento.jpg", "Departamento con cama matrimonial y cama individual, paredes grafito y cabecera de madera"),
  foto("portada", "03-recepcion.jpg", "Recepción con mostrador de madera iluminado y el logo ACA Villa Bordeu"),
  foto("portada", "01-gimnasio.jpg", "Gimnasio con pared verde y cartel de neón ACA"),
  foto("portada", "04-sala.jpg", "Sala de reuniones con mesa larga y pantalla"),
];

const vars = (i: number) => ({ ["--i" as string]: i });

/**
 * Portada del inicio, con el formato de Palazzo: fotos que se funden, un H1
 * que se entiende solo, una bajada y dos caminos. El logo vive en el encabezado.
 */
export function Hero() {
  return (
    <section data-hero className="relative flex min-h-[100svh] items-end overflow-hidden bg-grafito text-white">
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
              quality={82}
              placeholder="blur"
              blurDataURL={f.blurDataURL}
              className="object-cover"
            />
          </div>
        ))}
        {/* Velo liviano arriba (se ve la foto) y firme abajo, donde va el texto. */}
        <div className="absolute inset-0 bg-gradient-to-t from-grafito via-grafito/45 to-grafito/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(10_10_11/0.4),transparent_70%)]" />
      </div>

      <div data-hero-contenido className="contenedor relative z-10 flex w-full flex-col items-center pt-[calc(var(--header-h)+28px)] pb-[clamp(40px,9svh,104px)] text-center">
        <h1 className="hero-in w-full max-w-5xl [text-shadow:0_2px_28px_rgb(0_0_0/0.45)]" style={vars(0)}>
          <span className="t-display block">Motel ACA en Bahía Blanca</span>
          <span className="mt-2 block font-display text-[clamp(22px,2.8vw,44px)] leading-tight font-semibold text-white/90 uppercase">
            Sobre el cruce de las rutas <span className="text-rojo">3, 33 y 35</span>
          </span>
        </h1>

        <p className="hero-in mt-5 max-w-[46ch] text-[clamp(16px,1.25vw,19px)] leading-snug text-white/85" style={vars(1)}>
          Departamentos con cochera en la puerta, restaurante, gimnasio y estación de servicio en un mismo predio. Para equipos de trabajo y para los que
          van de viaje.
        </p>

        <div className="hero-in mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6" style={vars(2)}>
          <BotonConsultar origen="portada">Consultar disponibilidad</BotonConsultar>
          <Link href="/empresas" className="enlace inline-flex items-center gap-2 py-2 text-[15px]">
            Alojamiento para empresas <Icono nombre="flecha" className="size-4" grosor={2} />
          </Link>
        </div>

        <a href="#predio" aria-label="Bajar" className="hero-in mt-10 hidden flex-col items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-white/60 uppercase md:flex" style={vars(3)}>
          Conocé el lugar
          <span className="relative block h-10 w-px overflow-hidden bg-white/20">
            <span className="baja-linea absolute inset-0 bg-white" />
          </span>
        </a>
      </div>
    </section>
  );
}
