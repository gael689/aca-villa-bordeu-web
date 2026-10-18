import type { NextConfig } from "next";
import { redirecciones } from "./lib/redirecciones.json";

// Dos salidas del mismo código:
// - Vercel (por defecto): servidor de Next, optimizador de imágenes y /api/consulta con Resend.
// - Hosting del cliente (SALIDA=estatica, ver scripts/exportar.mjs): HTML estático para Apache,
//   fotos pre-generadas en WebP, el mail sale por api/consulta.php y las redirecciones van al .htaccess.
const estatica = process.env.SALIDA === "estatica";

const nextConfig: NextConfig = {
  ...(estatica && { output: "export" }),
  images: estatica
    ? {
        loader: "custom",
        loaderFile: "./lib/imagen-loader.ts",
        // Los mismos anchos que genera scripts/exportar.mjs.
        deviceSizes: [640, 828, 1080, 1280, 1920],
        imageSizes: [256, 384],
      }
    : {
        // Next 16 exige declarar las calidades que se usan.
        qualities: [70, 75, 82],
        formats: ["image/avif", "image/webp"],
      },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(!estatica && {
    async redirects() {
      return (redirecciones as [string, string][]).map(([source, destination]) => ({ source, destination, permanent: true }));
    },
  }),
};

export default nextConfig;
