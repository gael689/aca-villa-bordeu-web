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
        if (!vivo) return;
        motor.current = m;
        m.arrancar();
        void m.escanear();
        html.classList.add("anim-ready");
      });
    // Después del primer pintado: no compite con el LCP.
    const usaIdle = "requestIdleCallback" in window;
    const id: number = usaIdle ? window.requestIdleCallback(cargar, { timeout: 700 }) : window.setTimeout(cargar, 150);

    return () => {
      vivo = false;
      if (usaIdle) window.cancelIdleCallback(id);
      else window.clearTimeout(id);
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
