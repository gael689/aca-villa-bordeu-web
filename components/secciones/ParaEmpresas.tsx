"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { foto } from "@/lib/fotos";

const RAZONES = [
  {
    titulo: "Todo el equipo en un mismo predio",
    texto: "26 departamentos single, doble y triple, uno al lado del otro. Nadie queda repartido por la ciudad.",
    f: foto("habitaciones", "02-doble-escritorio.jpg", "Departamento con escritorio, TV y dos camas"),
  },
  {
    titulo: "La camioneta, en la puerta",
    texto: "Cada departamento tiene su cochera cubierta enfrente. Las herramientas quedan bajo techo y a la vista.",
    f: foto("habitaciones", "06-pasillo.jpg", "Pasillo de los departamentos con puertas de madera"),
  },
  {
    titulo: "Comen sin salir",
    texto: "Desayuno, restaurante y cafetería en el mismo edificio. Después de la jornada, la cena está a pasos.",
    f: foto("restaurante", "01-salon-noche.jpg", "Salón del Resto de noche"),
  },
  {
    titulo: "Recepción las 24 horas y lavandería",
    texto: "El que sale de madrugada o vuelve tarde del turno siempre encuentra a alguien. La ropa de trabajo se lava acá.",
    f: foto("cafeteria", "01-recepcion-cafeteria.jpg", "Recepción con mostrador iluminado"),
  },
  {
    titulo: "Una oficina para el que coordina",
    texto: "Una oficina de cortesía con escritorio privado: para cerrar el parte del día, hacer una llamada o recibir a un proveedor sin ocupar el departamento.",
    f: foto("oficina-cortesia", "01-oficina.jpg", "Oficina de cortesía con escritorio de madera y paredes de listones"),
  },
  {
    titulo: "Sala de reuniones y gimnasio",
    texto: "Para la inducción del primer día, la reunión de obra o para soltar el cuerpo al volver.",
    f: foto("sala-reuniones", "01-mesa.jpg", "Sala de reuniones con mesa larga y pantalla"),
  },
];

/**
 * Bloque «Por qué Villa Bordeu» de /empresas (en la v1 vivía en el inicio). Editorial, sin tarjetas: a la izquierda una
 * foto fija que cambia según la razón que se está leyendo a la derecha.
 * En celular, cada razón lleva su foto arriba.
 */
export function ParaEmpresas() {
  const [activa, setActiva] = useState(0);
  const filas = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActiva(Number((e.target as HTMLElement).dataset.i));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    filas.current.forEach((f) => f && io.observe(f));
    return () => io.disconnect();
  }, []);

  return (
    <section className="seccion border-t border-[color:var(--linea)]">
      <div className="contenedor">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="etiqueta" data-reveal>
              Por qué Villa Bordeu
            </p>
            <h2 className="t-h2 mt-4 max-w-[16ch]" data-split>
              Seis razones para alojar <span className="rojo-txt">al equipo acá</span>
            </h2>
          </div>
          <p className="lead text-asfalto lg:justify-self-end" data-reveal>
            A minutos del Polo Petroquímico, el puerto y General Cerri, sin entrar al centro. Lo coordinás todo por WhatsApp o mail.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Foto fija (escritorio) */}
          <div className="relative hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+40px)] aspect-[4/5] max-h-[calc(100svh-var(--header-h)-80px)] w-full overflow-hidden rounded-[var(--radio)] bg-grafito">
              {RAZONES.map((r, i) => (
                <Image
                  key={r.f.src}
                  src={r.f.src}
                  alt={i === activa ? r.f.alt : ""}
                  fill
                  sizes="45vw"
                  placeholder="blur"
                  blurDataURL={r.f.blurDataURL}
                  className={`object-cover transition-[opacity,scale] duration-[1.1s] ease-[var(--ease-pt)] ${i === activa ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"}`}
                />
              ))}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <span className="num font-display text-[15px] font-bold">
                  {String(activa + 1).padStart(2, "0")} / {String(RAZONES.length).padStart(2, "0")}
                </span>
                <span className="flex gap-1.5">
                  {RAZONES.map((r, i) => (
                    <span key={r.titulo} className={`h-1 rounded-full transition-all duration-500 ${i === activa ? "w-8 bg-rojo" : "w-3 bg-white/40"}`} />
                  ))}
                </span>
              </div>
            </div>
          </div>

          {/* Razones */}
          <ol>
            {RAZONES.map((r, i) => (
              <li
                key={r.titulo}
                ref={(el) => {
                  filas.current[i] = el;
                }}
                data-i={i}
                className="border-t border-[color:var(--linea)] py-8 last:border-b lg:flex lg:min-h-[44svh] lg:flex-col lg:justify-center lg:py-10"
              >
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-[var(--radio)] lg:hidden">
                  <Image src={r.f.src} alt={r.f.alt} fill sizes="100vw" placeholder="blur" blurDataURL={r.f.blurDataURL} className="object-cover" />
                </div>
                <p className={`num font-display text-[15px] font-bold transition-colors duration-500 ${i === activa ? "text-rojo" : "text-asfalto"}`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3
                  className={`mt-2 font-display text-[clamp(26px,2.4vw,38px)] leading-[1.02] font-bold uppercase transition-colors duration-500 ${i === activa ? "text-tinta" : "lg:text-tinta/35"}`}
                >
                  {r.titulo}
                </h3>
                <p className={`mt-3 max-w-[42ch] text-[17px] transition-colors duration-500 ${i === activa ? "text-asfalto" : "lg:text-asfalto/50"}`}>{r.texto}</p>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
