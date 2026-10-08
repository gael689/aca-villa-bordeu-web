import Image from "next/image";
import Link from "next/link";
import { TIPOS, INCLUYE } from "@/lib/departamentos";
import { Icono } from "@/components/marca/Icono";
import { BotonConsultar } from "@/components/consulta/ConsultaContext";

/** Los tres tipos de departamento, en tarjetas que se apilan al bajar (motor: data-apilada). */
export function DeptosApilados() {
  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="mb-10 grid gap-6 md:mb-16 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              Departamentos
            </p>
            <h2 className="t-h2 mt-4" data-split>
              Veintiséis puertas, <span className="rojo-txt">una cochera</span> en cada una
            </h2>
          </div>
          <div data-reveal>
            <p className="lead text-asfalto">Todos traen lo mismo. Cambia cómo se duerme: solo, de a dos o de a tres.</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {INCLUYE.map((i) => (
                <li key={i} className="chip">
                  <Icono nombre="check" className="size-3.5 text-rojo" grosor={2.6} />
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6">
          {TIPOS.map((t, i) => (
            <article key={t.slug} data-apilada className="sticky" style={{ top: `calc(var(--header-h) + ${16 + i * 18}px)` }}>
              <div data-apilada-cuerpo className="tarjeta grid origin-top bg-white shadow-[0_30px_70px_-40px_rgb(0_0_0/0.45)] md:grid-cols-[1.35fr_1fr]">
                <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[480px]">
                  <Image
                    src={t.fotos[0].src}
                    alt={t.fotos[0].alt}
                    fill
                    sizes="(min-width: 768px) 58vw, 100vw"
                    placeholder="blur"
                    blurDataURL={t.fotos[0].blurDataURL}
                    className="object-cover"
                    style={t.encuadre ? { objectPosition: t.encuadre } : undefined}
                  />
                </div>
                <div className="flex flex-col justify-between gap-8 p-6 md:p-10">
                  <div>
                    <p className="num font-display text-[15px] font-bold text-rojo">0{i + 1} / 03</p>
                    <h3 className="mt-3 font-display text-[clamp(44px,5vw,80px)] leading-[0.9] font-bold uppercase">{t.nombre}</h3>
                    <p className="mt-2 font-semibold">{t.camas}</p>
                    <p className="mt-3 max-w-[34ch] text-asfalto">{t.frase}</p>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    <BotonConsultar modo="viaje" origen={`inicio-${t.slug}`} className="btn">
                      Consultar
                    </BotonConsultar>
                    <Link href={`/departamentos#${t.slug}`} className="btn btn-fantasma sin-burbuja">
                      Ver fotos
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
