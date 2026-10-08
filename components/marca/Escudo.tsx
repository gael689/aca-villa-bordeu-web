/**
 * Escudo de Ruta Nacional argentina (silueta simplificada) con el número.
 * Es el elemento gráfico propio del sitio: aparece una vez por pantalla.
 * Con `data-dibujar` el motor traza el contorno al entrar.
 */
export function Escudo({
  numero,
  className = "h-12 w-auto",
  tono = "claro",
  dibujar = false,
}: {
  numero: string;
  className?: string;
  tono?: "claro" | "oscuro" | "rojo";
  dibujar?: boolean;
}) {
  const colores = {
    claro: { borde: "currentColor", fondo: "transparent", texto: "currentColor" },
    oscuro: { borde: "#151617", fondo: "#F6F5F2", texto: "#151617" },
    rojo: { borde: "#DF1D2E", fondo: "transparent", texto: "currentColor" },
  }[tono];
  return (
    <svg viewBox="0 0 48 56" className={className} role="img" aria-label={`Ruta Nacional ${numero}`} data-dibujar={dibujar || undefined}>
      <path
        d="M24 2.5c6.200 2.400 12.300 3 19.500 2 .800 7.500.600 15.300-.800 22.600C40.600 38.700 33.700 47.800 24 53.500 14.300 47.800 7.400 38.700 5.300 27.100 3.900 19.800 3.700 12 4.500 4.500 11.700 5.500 17.800 4.900 24 2.500z"
        fill={colores.fondo}
        stroke={colores.borde}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <text x="24" y="14.5" textAnchor="middle" fontSize="6.4" letterSpacing="0.6" fill={colores.texto} fontFamily="var(--font-display)" fontWeight="600">
        RN
      </text>
      <text
        x="24"
        y={numero.length > 1 ? 38 : 39}
        textAnchor="middle"
        fontSize={numero.length > 1 ? 21 : 24}
        fill={colores.texto}
        fontFamily="var(--font-display)"
        fontWeight="700"
      >
        {numero}
      </text>
    </svg>
  );
}
