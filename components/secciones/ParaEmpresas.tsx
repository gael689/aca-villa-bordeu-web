import Image from "next/image";
import Link from "next/link";
import { foto } from "@/lib/fotos";
import { Icono, type IconoNombre } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

const RAZONES: { icono: IconoNombre; titulo: string; texto: string }[] = [
  { icono: "pin", titulo: "Sin entrar al centro", texto: "Salen directo a la ruta y llegan rápido al Polo, al puerto o a Cerri." },
  { icono: "auto", titulo: "La camioneta en la puerta", texto: "Cochera cubierta frente a cada departamento." },
  { icono: "cubiertos", titulo: "Comen acá", texto: "Desayuno, restaurante y cafetería, sin moverse del predio." },
  { icono: "telefono", titulo: "Un solo contacto", texto: "Lo coordinás todo por WhatsApp o mail, a cualquier hora." },
];

/** Bloque oscuro del inicio que lleva a /empresas. */
export function ParaEmpresas() {
  const f1 = foto("predio", "cocheras-noche.jpg", "Galería de cocheras cubiertas de noche, con autos frente a cada departamento");
  const f2 = foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga, sillas blancas y pantalla");
  const f3 = foto("gimnasio", "02-gym-ventanales.jpg", "Gimnasio con máquinas frente a los ventanales");
  return (
    <section className="oscuro grano relative overflow-hidden seccion">
      <div className="contenedor relative">
        <p className="etiqueta" data-reveal>
          Para empresas
        </p>
        <p className="mt-6 max-w-[22ch] font-display text-[clamp(38px,5.4vw,96px)] leading-[0.95] font-bold uppercase" data-palabras>
          Tu equipo duerme, come, entrena y sale a trabajar desde un mismo lugar.
        </p>

        {/* Bento */}
        <div className="mt-14 grid gap-3 md:mt-20 md:grid-cols-6 md:grid-rows-[repeat(2,minmax(240px,auto))]">
          <div className="tarjeta relative min-h-[300px] md:col-span-4 md:row-span-2" data-clip>
            <Image src={f1.src} alt={f1.alt} fill sizes="(min-width: 768px) 66vw, 100vw" placeholder="blur" blurDataURL={f1.blurDataURL} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
              <p className="t-h2 max-w-[12ch]">Cochera frente a cada departamento</p>
              <p className="mt-3 max-w-[40ch] text-white/75">Las camionetas de la empresa quedan techadas y a la vista, a pasos de donde duerme cada uno.</p>
            </div>
          </div>
          <div className="tarjeta relative min-h-[240px] md:col-span-2" data-clip data-delay="0.1">
            <Image src={f2.src} alt={f2.alt} fill sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" blurDataURL={f2.blurDataURL} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <Link href="/sala-de-reuniones" className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
              <span className="font-display text-[28px] leading-none font-bold uppercase">Sala de reuniones</span>
              <Icono nombre="flecha" className="size-6" grosor={2} />
            </Link>
          </div>
          <div className="tarjeta relative min-h-[240px] md:col-span-2" data-clip data-delay="0.2">
            <Image src={f3.src} alt={f3.alt} fill sizes="(min-width: 768px) 33vw, 100vw" placeholder="blur" blurDataURL={f3.blurDataURL} className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <p className="absolute inset-x-0 bottom-0 p-5 font-display text-[28px] leading-none font-bold uppercase">
              Gimnasio <span className="neon" data-neon>abierto</span>
            </p>
          </div>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {RAZONES.map((r, i) => (
            <li key={r.titulo} className="rounded-[var(--radio)] bg-white/[0.05] p-4 sm:p-6 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.08)]" data-reveal data-delay={String(i * 0.08)}>
              <Icono nombre={r.icono} className="size-7 text-ambar" grosor={1.6} />
              <p className="mt-4 font-display text-[20px] leading-none font-bold uppercase sm:mt-5 sm:text-[24px]">{r.titulo}</p>
              <p className="mt-2 text-[14px] text-white/65 sm:text-base">{r.texto}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap items-center gap-3" data-reveal>
          <BotonConsultar modo="empresa" origen="inicio-empresas">
            Consultar para mi equipo
          </BotonConsultar>
          <Link href="/empresas" className="btn btn-fantasma">
            <span>Ver todo para empresas</span>
            <span className="burbuja" aria-hidden="true">
              <Icono nombre="der" className="size-4" grosor={2} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
