import Image from "next/image";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

// Solo fotos nítidas, recortadas desde los originales (fotos-seleccion/portada).
// El salón de noche y la barra quedaron afuera: son de celular con poca luz y en grande se ven blandas.
const CAPAS = [
  foto("portada", "02-habitacion.jpg", "Habitación con cama matrimonial y cama individual, paredes grafito y cabecera de madera"),
  foto("portada", "03-recepcion.jpg", "Recepción con mostrador de madera iluminado y el logo ACA Villa Bordeu"),
  foto("portada", "01-gimnasio.jpg", "Gimnasio con pared verde y cartel de neón ACA"),
  foto("portada", "04-sala.jpg", "Sala de reuniones con mesa larga y pantalla"),
];

const vars = (i: number) => ({ ["--i" as string]: i });

/**
 * Portada del inicio (versión 2): «Una parada estratégica». Fotos que se funden,
 * un H1 que se entiende solo, dos acciones y una línea de datos.
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
          <span className="t-display block">
            Hotelería estratégica <span className="resalte">en Bahía Blanca</span>
          </span>
        </h1>

        <p className="hero-in mt-5 max-w-[44ch] text-[clamp(16px,1.25vw,19px)] leading-snug text-white/85" style={vars(1)}>
          Alojamiento, restaurante y servicios sobre el cruce de las rutas 3, 33 y 35, a minutos del puerto.
        </p>

        <div className="hero-in mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4" style={vars(2)}>
          <BotonConsultar origen="portada">Consultar disponibilidad</BotonConsultar>
          <Link href="/como-llegar" className="btn btn-fantasma">
            <span>Cómo llegar</span>
            <span className="burbuja" aria-hidden="true">
              <Icono nombre="pin" className="size-4" grosor={2} />
            </span>
          </Link>
        </div>

        {/* Una sola línea de datos: lo que hace elegir este lugar */}
        <ul className="hero-in mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-semibold tracking-[0.08em] text-white/75 uppercase md:text-[14px]" style={vars(3)}>
          {["Desde 1984", "Habitaciones", "Cochera", "Restaurante", "Recepción 24 h"].map((d, i) => (
            <li key={d} className="flex items-center gap-5">
              {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-amarillo" />}
              {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
