import Image from "next/image";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { CARTA } from "@/lib/carta";
import { MENSAJE_MESA, linkWhatsApp } from "@/lib/mensaje";
import { JsonLd, restoJsonLd } from "@/lib/schema";
import { Icono } from "@/components/marca/Icono";
import { Cierre, Citable, PortadaPagina } from "@/components/secciones/Comunes";

export const metadata = meta({
  title: "Restaurante sobre la ruta en Bahía Blanca · Resto ACA",
  description:
    "El Resto de ACA Villa Bordeu cocina desde 1984: parrilla, pastas y platos de siempre, con cava de vinos y barra. Sobre las rutas 3 y 33. Reservá por WhatsApp.",
  ruta: "/restaurante",
});

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function Restaurante() {
  const galeria = [
    foto("restaurante", "02-barra-led.jpg", "Barra con luz azul y banquetas altas"),
    foto("restaurante", "03-cava-vinos.jpg", "Cava de vinos y estantes iluminados"),
    foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de madera con botellas iluminadas"),
    foto("cafeteria", "02-cafeteria-mesas.jpg", "Cafetería con mesas negras y mostrador de madera"),
    foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA en la espuma"),
  ];
  return (
    <>
      <PortadaPagina
        foto={foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche, con luces cálidas en el techo y mesas de madera")}
        etiqueta="Resto · desde 1984"
        titulo={
          <>
            Cocinamos <span className="text-rojo">desde 1984</span>
          </>
        }
        bajada="El restaurante de Villa Bordeu, sobre la ruta. Para los que se alojan, para los equipos y para los que pasan."
        migas={[{ nombre: "Restaurante", ruta: "/restaurante" }]}
      >
        <a href={linkWhatsApp(MENSAJE_MESA)} target="_blank" rel="noopener noreferrer" className="btn">
          <span>Reservar mesa</span>
          <span className="burbuja" aria-hidden="true">
            <Icono nombre="whatsapp" className="size-4" />
          </span>
        </a>
        <a href="#carta" className="btn btn-claro">
          <span>Ver la carta</span>
          <span className="burbuja" aria-hidden="true">
            <Icono nombre="abajo" className="size-4" grosor={2} />
          </span>
        </a>
      </PortadaPagina>

      <Citable>
        El Resto de ACA Villa Bordeu cocina desde 1984 sobre el acceso de las rutas 3 y 33, en Bahía Blanca: parrilla, pastas y especialidades, con cava de
        vinos, barra y cafetería.
      </Citable>

      {/* Galería horizontal */}
      <section className="pb-[clamp(56px,6vw,100px)]">
        <div className="sin-barra flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)]">
          {galeria.map((f, i) => (
            <div key={f.src} className={`tarjeta relative h-[56svh] max-h-[560px] shrink-0 snap-center ${i % 2 ? "w-[62vw] sm:w-[34vw]" : "w-[80vw] sm:w-[46vw]"}`} data-clip data-delay={String(i * 0.06)}>
              <Image src={f.src} alt={f.alt} fill sizes="(min-width: 640px) 46vw, 80vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      {/* La carta */}
      <section id="carta" className="oscuro grano relative seccion">
        <div className="contenedor relative">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="etiqueta" data-reveal>
                La carta
              </p>
              <h2 className="t-h2 mt-4" data-split>
                Platos de siempre
              </h2>
            </div>
            <a href={linkWhatsApp(MENSAJE_MESA)} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja" data-reveal>
              <Icono nombre="whatsapp" className="size-5" /> Reservar mesa
            </a>
          </div>

          <nav aria-label="Secciones de la carta" className="sticky top-[calc(var(--header-h)+8px)] z-10 -mx-[var(--gutter)] mt-10 px-[var(--gutter)]">
            <ul className="sin-barra vidrio-oscuro flex gap-1.5 overflow-x-auto rounded-full p-1.5 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.1)]">
              {CARTA.map((s) => (
                <li key={s.nombre} className="shrink-0">
                  <a href={`#${slug(s.nombre)}`} className="block rounded-full px-4 py-2.5 text-[14px] font-semibold whitespace-nowrap text-white/80 transition-colors hover:bg-white hover:text-tinta">
                    {s.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-12 grid gap-x-16 gap-y-14 md:grid-cols-2">
            {CARTA.map((s) => (
              <section key={s.nombre} id={slug(s.nombre)} className="scroll-mt-[calc(var(--header-h)+90px)]">
                <h3 className="border-b border-white/15 pb-3 font-display text-[30px] leading-none font-bold text-ambar uppercase" data-reveal>
                  {s.nombre}
                </h3>
                <ul className="mt-2">
                  {s.platos.map((p) => (
                    <li key={p.nombre} className="border-b border-white/8 py-3.5">
                      <p className="text-[17px] font-semibold">{p.nombre}</p>
                      {p.detalle && <p className="text-[15px] text-white/55">{p.detalle}</p>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mt-12 text-[14px] text-white/45">La carta puede cambiar según la temporada. Para saber qué hay hoy, escribinos por WhatsApp.</p>
        </div>
      </section>

      <Cierre titulo="¿Mesa para cuántos?" origen="resto-cierre" imagen={foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de botellas")} />
      <JsonLd data={restoJsonLd()} />
    </>
  );
}
