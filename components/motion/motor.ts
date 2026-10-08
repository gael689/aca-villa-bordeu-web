import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { lenisRef } from "./scroll";

// Motor de movimiento. Se importa DESPUÉS del primer pintado (import dinámico en
// <Motion/>), así GSAP no cuenta en el JS inicial. Las páginas son componentes
// de servidor: declaran qué se anima con atributos `data-*` y este módulo los
// recorre en cada navegación. Solo anima transform, opacity y clip-path.

gsap.registerPlugin(ScrollTrigger, SplitText);

let ctx: gsap.Context | null = null;
let tick: ((t: number) => void) | null = null;

const num = (v: string | undefined, d = 0) => (v === undefined || v === "" ? d : parseFloat(v));
const todos = <T extends HTMLElement = HTMLElement>(s: string) => gsap.utils.toArray<T>(s);

export function arrancar(): boolean {
  const lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, anchors: true });
  lenisRef.current = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  if (document.documentElement.classList.contains("scroll-bloqueado")) lenis.stop();

  const refrescar = () => ScrollTrigger.refresh();
  window.addEventListener("load", refrescar);
  document.fonts?.ready.then(refrescar);
  return true;
}

export function parar() {
  corrida++;
  ctx?.revert();
  ctx = null;
  if (tick) gsap.ticker.remove(tick);
  lenisRef.current?.destroy();
  lenisRef.current = null;
}

export function irArriba() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

// Cede el hilo al navegador entre tandas: el recorrido inicial se hace en
// pedazos cortos y no genera una tarea larga que frene la interacción.
const ceder = () => new Promise<void>((r) => setTimeout(r, 0));
let corrida = 0;

async function porLotes<T>(lista: T[], fn: (x: T) => void, lote: number, vigente: () => boolean) {
  for (let i = 0; i < lista.length; i += lote) {
    if (!vigente()) return;
    lista.slice(i, i + lote).forEach(fn);
    if (i + lote < lista.length) await ceder();
  }
}

export async function escanear() {
  ctx?.revert();
  const id = ++corrida;
  const vigente = () => id === corrida;
  const c = gsap.context(() => {});
  ctx = c;
  // Todo lo que se crea dentro de c.add() queda en el contexto y se limpia con revert().
  const dentro = (fn: () => void) => c.add(fn);

  // Texto de revelado: aparece subiendo.
  await porLotes(
    todos("[data-reveal]"),
    (el) =>
      dentro(() => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
          delay: num(el.dataset.delay),
          // No usar clearProps: la regla `.js [data-reveal]` volvería a aplicarse.
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      }),
    14,
    vigente,
  );

  // Línea: se dibuja de izquierda a derecha.
  await porLotes(
    todos("[data-linea]"),
    (el) =>
      dentro(() => {
        gsap.to(el, {
          scaleX: 1,
          duration: 1.6,
          ease: "expo.inOut",
          delay: num(el.dataset.delay),
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      }),
    14,
    vigente,
  );

  // Fotos: una cortina que se abre, con la foto de adentro asentándose.
  await porLotes(
    todos("[data-clip]"),
    (el) =>
      dentro(() => {
        const img = el.querySelector("img");
        const tl = gsap.timeline({
          delay: num(el.dataset.delay),
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
          // Valores finales explícitos (clearProps dejaría que el CSS inicial vuelva a ocultar la foto).
          onComplete: () => {
            el.style.clipPath = "none";
            if (img) img.style.transform = "none";
          },
        });
        tl.to(el, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" }, 0);
        if (img) tl.to(img, { scale: 1, duration: 1.9, ease: "expo.out" }, 0);
      }),
    8,
    vigente,
  );

  // Números que suben desde cero.
  await porLotes(
    todos("[data-contador]"),
    (el) =>
      dentro(() => {
        const fin = num(el.dataset.contador);
        const dec = num(el.dataset.dec);
        const fmt = (n: number) => n.toFixed(dec).replace(".", ",");
        const o = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(o, {
          v: fin,
          duration: 1.7,
          ease: "power3.out",
          onUpdate: () => (el.textContent = fmt(o.v)),
          onComplete: () => (el.textContent = fmt(fin)),
          scrollTrigger: { trigger: el, start: "top 94%", once: true },
        });
      }),
    6,
    vigente,
  );

  // Íconos que se dibujan: cada trazo recorre su largo.
  await porLotes(
    todos("[data-dibujar]"),
    (el) =>
      dentro(() => {
        const trazos = Array.from(el.querySelectorAll<SVGPathElement>("path"));
        trazos.forEach((p) => p.style.setProperty("--l", String(Math.ceil(p.getTotalLength()) + 1)));
        gsap.to(trazos, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      }),
    10,
    vigente,
  );

  if (!vigente()) return;

  dentro(() => {
    // Portada: al bajar, la foto se encoge hacia una tarjeta con esquinas
    // redondeadas (como una ventanilla) y el texto sube y se desvanece.
    todos("[data-hero]").forEach((hero) => {
      const ventana = hero.querySelector<HTMLElement>("[data-hero-ventana]");
      const contenido = hero.querySelector<HTMLElement>("[data-hero-contenido]");
      const st = { trigger: hero, start: "top top", end: "bottom top", scrub: true };
      if (ventana)
        gsap.fromTo(
          ventana,
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
          { clipPath: "inset(6% 4% 0% 4% round 36px)", ease: "none", scrollTrigger: st },
        );
      if (contenido) gsap.to(contenido, { yPercent: -16, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "65% top" } });
    });

    // Tarjetas apiladas: la de atrás se achica y se oscurece cuando llega la siguiente.
    const apiladas = todos("[data-apilada]");
    apiladas.forEach((art, i) => {
      const siguiente = apiladas[i + 1];
      if (!siguiente) return;
      const cuerpo = art.querySelector<HTMLElement>("[data-apilada-cuerpo]");
      const st = { trigger: siguiente, start: "top bottom", end: "top top", scrub: true };
      // Solo transform sobre una capa propia (se compone en la GPU): sin animar opacidad de un velo encima de la foto.
      if (cuerpo) gsap.to(cuerpo, { scale: 0.94, ease: "none", force3D: true, scrollTrigger: st });
    });
  });

  // Puntos del plano: se encienden uno por uno, como las luces de la galería.
  await porLotes(
    todos("[data-pin-grupo]"),
    (grupo) =>
      dentro(() => {
        gsap.to(grupo.querySelectorAll("[data-pin-punto]"), {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(2.4)",
          stagger: 0.11,
          scrollTrigger: { trigger: grupo, start: "top 75%", once: true },
        });
      }),
    4,
    vigente,
  );

  // Neón: titila una vez cuando entra en pantalla.
  await porLotes(
    todos("[data-neon]"),
    (el) =>
      dentro(() => {
        ScrollTrigger.create({ trigger: el, start: "top 88%", once: true, onEnter: () => el.classList.add("encendido") });
      }),
    10,
    vigente,
  );

  // Velocidad de scroll: la cinta de rutas se inclina apenas según cuánto se baja.
  dentro(() => {
    const cintas = todos("[data-sesgo]");
    if (!cintas.length) return;
    const set = cintas.map((c) => gsap.quickTo(c, "skewX", { duration: 0.5, ease: "power3" }));
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-6, 6, self.getVelocity() / -320);
        set.forEach((f) => f(v));
      },
    });
  });

  dentro(() => {
    const mm = gsap.matchMedia();

    // Parallax suave de las fotos grandes (solo pantallas amplias).
    mm.add("(min-width: 768px)", () => {
      todos("[data-parallax]").forEach((el) => {
        const v = num(el.dataset.parallax, 8);
        gsap.fromTo(
          el,
          { yPercent: -v },
          {
            yPercent: v,
            ease: "none",
            scrollTrigger: { trigger: el.parentElement!, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    // Botones magnéticos (solo con mouse).
    mm.add("(hover: hover) and (pointer: fine)", () => {
      const limpiar: (() => void)[] = [];
      todos("[data-magnetic]").forEach((el) => {
        const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
        const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });
        const mover = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          x(Math.max(-6, Math.min(6, (e.clientX - (r.left + r.width / 2)) * 0.16)));
          y(Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) * 0.22)));
        };
        const soltar = () => {
          x(0);
          y(0);
        };
        el.addEventListener("mousemove", mover);
        el.addEventListener("mouseleave", soltar);
        limpiar.push(() => {
          el.removeEventListener("mousemove", mover);
          el.removeEventListener("mouseleave", soltar);
        });
      });
      return () => limpiar.forEach((f) => f());
    });

    // «Un día de tu equipo»: en escritorio se fija y avanza en horizontal.
    // En celular es un carrusel nativo con snap (no secuestramos el scroll).
    mm.add("(min-width: 1024px)", () => {
      todos("[data-dia]").forEach((raiz) => {
        const pista = raiz.querySelector<HTMLElement>("[data-dia-pista]");
        const horaEl = raiz.querySelector<HTMLElement>("[data-dia-hora]");
        const barra = raiz.querySelector<HTMLElement>("[data-dia-barra]");
        const escenas = todos("[data-dia-escena]");
        if (!pista || !horaEl || escenas.length < 2) return;

        const distancia = () => Math.max(0, pista.scrollWidth - window.innerWidth);
        let actual = -1;

        const mostrar = (i: number, animar: boolean) => {
          if (i === actual) return;
          actual = i;
          escenas.forEach((e, k) => e.setAttribute("data-activa", String(k === i)));
          const h = escenas[i].dataset.hora ?? "";
          if (!animar) {
            horaEl.textContent = h;
            return;
          }
          gsap
            .timeline()
            .to(horaEl, { yPercent: -50, opacity: 0, duration: 0.22, ease: "power2.in", overwrite: true })
            .add(() => {
              horaEl.textContent = h;
            })
            .fromTo(horaEl, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, ease: "expo.out" });
        };
        mostrar(0, false);

        gsap.to(pista, {
          x: () => -distancia(),
          ease: "none",
          scrollTrigger: {
            trigger: raiz,
            start: "top top",
            end: () => "+=" + distancia(),
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              mostrar(Math.min(escenas.length - 1, Math.round(self.progress * (escenas.length - 1))), true);
              if (barra) barra.style.transform = `scaleX(${self.progress})`;
            },
          },
        });
      });
    });
  });

  await ceder();
  if (!vigente()) return;

  // Títulos: cada línea sube detrás de una máscara (el trabajo más pesado va último).
  await document.fonts?.ready;
  if (!vigente()) return;
  await porLotes(
    todos("[data-split]"),
    (el) =>
      dentro(() => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-linea",
          autoSplit: true,
          onSplit: (self) => {
            el.style.visibility = "visible";
            return gsap.from(self.lines, {
              yPercent: 115,
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.09,
              delay: num(el.dataset.delay),
              scrollTrigger: { trigger: el, start: "top 92%", once: true },
            });
          },
        });
      }),
    3,
    vigente,
  );

  // Frase que se ilumina palabra por palabra con el scroll.
  await porLotes(
    todos("[data-palabras]"),
    (el) =>
      dentro(() => {
        const st = SplitText.create(el, { type: "words", wordsClass: "palabra" });
        gsap.fromTo(
          st.words,
          { opacity: 0.14 },
          { opacity: 1, ease: "none", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: true } },
        );
      }),
    2,
    vigente,
  );

  if (vigente()) ScrollTrigger.refresh();
}
