import type Lenis from "lenis";

// Lenis se carga después del primer pintado; este módulo es liviano y lo
// pueden importar el panel de consulta, el menú y el visor para bloquear el
// scroll de la página sin traer GSAP.
export const lenisRef: { current: Lenis | null } = { current: null };

export function bloquearScroll(bloquear: boolean) {
  const l = lenisRef.current;
  if (l) {
    if (bloquear) l.stop();
    else l.start();
  }
  document.documentElement.classList.toggle("scroll-bloqueado", bloquear);
}
