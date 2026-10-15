import Image from "next/image";
import { foto } from "@/lib/fotos";
import { meta } from "@/lib/meta";
import { CARTA } from "@/lib/carta";
import { MENSAJE_MESA, linkWhatsApp } from "@/lib/mensaje";
import { JsonLd, restoJsonLd } from "@/lib/schema";
import { Icono } from "@/components/marca/Icono";
import { Cierre, Citable, PortadaPagina } from "@/components/secciones/Comunes";
import { BotonAbrirPedido, PedidoProvider } from "@/components/pedido/Pedido";

export const metadata = meta({
  title: "Restaurante sobre la ruta en Bahía Blanca · Resto ACA",
  description:
    "El Resto de ACA Villa Bordeu cocina desde 1984: parrilla, pastas y platos de siempre, con barra y cafetería. Sobre las rutas 3 y 33. Prepará tu pedido o reservá por WhatsApp.",
  ruta: "/restaurante",
});

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const FOTOS_CARTA = [
  foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche"),
  foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de botellas iluminada"),
  foto("cafeteria", "02-cafeteria-mesas.jpg", "Cafetería con mesas negras"),
  foto("restaurante", "02-barra-led.jpg", "Barra con luz azul"),
  foto("cafeteria", "03-mostrador.jpg", "Mostrador de madera iluminado"),
  foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA en la espuma"),
  foto("restaurante", "02-barra-led.jpg", "Barra con banquetas altas"),
  foto("restaurante", "03-cava-vinos.jpg", "Cava de vinos"),
];

export default function Restaurante() {
  const galeria = [
    foto("restaurante", "02-barra-led.jpg", "Barra con luz azul y banquetas altas"),
    foto("restaurante", "03-cava-vinos.jpg", "Cava de vinos y estantes iluminados"),
    foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de madera con botellas iluminadas"),
    foto("cafeteria", "02-cafeteria-mesas.jpg", "Cafetería con mesas negras y mostrador de madera"),
    foto("restaurante", "05-cafe-logo.jpg", "Café con el logo ACA en la espuma"),
  ];
  return (
    <PedidoProvider>
      <PortadaPagina
        foto={foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche, con luces cálidas en el techo y mesas de madera")}
        etiqueta="Resto · desde 1984"
        titulo={
          <>
            Cocinamos <span className="resalte">desde 1984</span>
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
        <BotonAbrirPedido className="btn btn-fantasma">Prepará tu pedido</BotonAbrirPedido>
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

      {/* La carta: cada sección es un capítulo con su foto fija al costado */}
      <section id="carta" className="oscuro grano relative">
        <div className="contenedor relative pt-[clamp(72px,8vw,140px)]">
          <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="etiqueta" data-reveal>
                La carta
              </p>
              <h2 className="t-h2 mt-4" data-split>
                Platos de siempre, <span className="resalte">hechos acá</span>
              </h2>
              {/* Prepará tu pedido: pedido del cliente (oct/2026), pensado para las empresas que vienen con su equipo. */}
              <div className="mt-8 max-w-[52ch] rounded-[var(--radio)] p-6 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.18)]" data-reveal>
                <p className="font-display text-[26px] leading-none font-bold text-amarillo uppercase">Prepará tu pedido</p>
                <p className="mt-2 text-[15px] text-white/60">Ideal para empresas y grupos: te guiamos paso a paso.</p>
                <ol className="mt-4 space-y-2.5 text-[15px] text-white/80">
                  {[
                    <>Decinos <strong className="text-white">cuántos son</strong>.</>,
                    <>Elegí paso a paso: <strong className="text-white">entrada, plato principal, bebida y postre</strong>.</>,
                    <>Poné el día y la hora, y envialo por WhatsApp o mail.</>,
                  ].map((paso, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="num grid size-6 shrink-0 place-items-center rounded-full bg-amarillo font-display text-[13px] font-bold text-tinta">{i + 1}</span>
                      <span>{paso}</span>
                    </li>
                  ))}
                </ol>
                <BotonAbrirPedido className="btn mt-6">Armar el pedido paso a paso</BotonAbrirPedido>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:justify-self-end" data-reveal>
              {CARTA.map((s, k) => (
                <a
                  key={s.nombre}
                  href={`#${slug(s.nombre)}`}
                  className="rounded-full px-4 py-2 text-[14px] font-semibold text-white/75 [box-shadow:inset_0_0_0_1px_rgb(255_255_255/0.18)] transition-colors hover:bg-white hover:text-tinta"
                >
                  <span className="num mr-1.5 text-amarillo">{String(k + 1).padStart(2, "0")}</span>
                  {s.nombre}
                </a>
              ))}
            </div>
          </div>
        </div>

        {CARTA.map((s, k) => {
          const f = FOTOS_CARTA[k % FOTOS_CARTA.length];
          return (
            <section key={s.nombre} id={slug(s.nombre)} className="scroll-mt-[var(--header-h)] border-t border-white/10 first-of-type:mt-16">
              <div className="contenedor grid gap-8 py-[clamp(48px,6vw,96px)] lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
                <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:self-start">
                  <p className="num font-display text-[clamp(64px,8vw,128px)] leading-[0.8] font-bold text-white/10">{String(k + 1).padStart(2, "0")}</p>
                  <h3 className="-mt-4 font-display text-[clamp(34px,3.6vw,60px)] leading-[0.95] font-bold text-amarillo uppercase md:-mt-7" data-reveal>
                    {s.nombre}
                  </h3>
                  <div className="relative mt-6 aspect-[16/10] overflow-hidden rounded-[var(--radio)] lg:aspect-[4/3]" data-clip>
                    <Image src={f.src} alt={f.alt} fill sizes="(min-width: 1024px) 38vw, 100vw" placeholder="blur" blurDataURL={f.blurDataURL} className="object-cover" />
                  </div>
                </div>
                <ol className="gap-x-10 sm:columns-2">
                  {s.platos.map((p, n) => (
                    <li key={p.nombre} className="group break-inside-avoid border-b border-white/10 py-4">
                      <p className="flex items-baseline gap-3">
                        <span className="num shrink-0 font-display text-[13px] font-bold text-amarillo">{String(n + 1).padStart(2, "0")}</span>
                        <span className="font-display text-[22px] leading-[1.05] font-semibold uppercase transition-colors group-hover:text-amarillo">{p.nombre}</span>
                      </p>
                      {p.detalle && <p className="mt-1 pl-8 text-[15px] text-white/55">{p.detalle}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          );
        })}

        <div className="contenedor flex flex-wrap items-center justify-between gap-6 border-t border-white/10 py-12">
          <p className="max-w-[48ch] text-[15px] text-white/55">La carta puede cambiar. Para saber qué hay hoy o reservar para un grupo, escribinos por WhatsApp.</p>
          <div className="flex flex-wrap gap-2.5">
            <BotonAbrirPedido>Armar el pedido</BotonAbrirPedido>
            <a href={linkWhatsApp(MENSAJE_MESA)} target="_blank" rel="noopener noreferrer" className="btn btn-wpp sin-burbuja">
              <Icono nombre="whatsapp" className="size-5" /> Reservar mesa
            </a>
          </div>
        </div>
      </section>

      <Cierre titulo="¿Mesa para cuántos?" origen="resto-cierre" imagen={foto("restaurante", "04-vitrina-botellas.jpg", "Vitrina de botellas")} />
      <JsonLd data={restoJsonLd()} />
    </PedidoProvider>
  );
}
