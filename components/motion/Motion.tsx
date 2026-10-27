"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

type Motor = typeof import("./motor");

/**
 * Carga el motor de movimiento (GSAP + Lenis) después del primer pintado y
 * vuelve a recorrer la página en cada navegación. Si el usuario pide menos
 * movimiento, no carga nada: el contenido ya es visible (la clase `js` ni
 * siquiera se agrega).
 */
export function Motion() {
  const pathname = usePathname();
  const motor = useRef<Motor | null>(null);
  const primera = useRef(true);

  useEffect(() => {
    const html = document.documentElement;
    if (!html.classList.contains("js")) return;
    let vivo = true;

    const cargar = () =>
      import("./motor").then((m) => {
        // Si el respaldo del <head> ya mostró todo (poca señal), no se anima tarde:
        // los títulos y las fotos volverían a ocultarse para entrar.
        if (!vivo || !html.classList.contains("js")) return;
        motor.current = m;
        m.arrancar();
        void m.escanear();
        html.classList.add("anim-ready");
      });
    // Arranca con la primera interacción (scroll, toque, mouse, teclado) o a los 4 s:
    // la portada se anima con CSS, así que el motor no compite con la carga inicial.
    let hecho = false;
    const eventos = ["scroll", "pointermove", "touchstart", "keydown", "wheel"] as const;
    const una = () => {
      if (hecho) return;
      hecho = true;
      eventos.forEach((e) => window.removeEventListener(e, una));
      window.clearTimeout(t);
      void cargar();
    };
    eventos.forEach((e) => window.addEventListener(e, una, { passive: true, once: true }));
    // Con un ancla (/restaurante#carta) o la página ya bajada, lo que está a la vista
    // no es la portada: sin el motor quedaría oculto hasta los 4 s.
    const t = window.setTimeout(una, location.hash || window.scrollY > 0 ? 0 : 4000);

    return () => {
      vivo = false;
      eventos.forEach((e) => window.removeEventListener(e, una));
      window.clearTimeout(t);
      motor.current?.parar();
      motor.current = null;
    };
  }, []);

  // Navegación entre páginas: volver arriba y recorrer el DOM nuevo.
  useEffect(() => {
    if (primera.current) {
      primera.current = false;
      return;
    }
    if (!motor.current) return;
    motor.current.irArriba();
    void motor.current.escanear();
  }, [pathname]);

  return null;
}
