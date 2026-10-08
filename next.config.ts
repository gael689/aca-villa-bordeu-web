import type { NextConfig } from "next";

// Redirecciones del sitio viejo (PHP 2014) y de las URLs históricas (ASP/HTML 2002–2013)
// que siguen enlazadas desde directorios. Lista completa en ../relevamiento/sitio-actual.md §1.5.
const viejas: [string, string][] = [
  ["/index.php", "/"],
  ["/habitaciones.php", "/departamentos"],
  ["/servicios.php", "/el-complejo"],
  ["/resto.php", "/restaurante"],
  ["/reservas.php", "/consulta"],
  ["/ubicacion.php", "/como-llegar"],
  ["/como.php", "/como-llegar"],
  ["/Default.:ext(asp|htm|html)", "/"],
  ["/default.:ext(asp|htm|html)", "/"],
  ["/index.:ext(asp|htm|html)", "/"],
  ["/main.:ext(asp|htm|html)", "/"],
  ["/null.:ext(asp|htm|html)", "/"],
  ["/aca2.:ext(asp|htm|html)", "/"],
  ["/aca3.:ext(asp|htm|html)", "/"],
  ["/aca4.:ext(asp|htm|html)", "/"],
  ["/resena.:ext(asp|htm|html)", "/"],
  ["/images/home.:ext(asp|htm|html)", "/"],
  ["/fotos.:ext(asp|htm|html)", "/"],
  ["/Fotos.:ext(asp|htm|html)", "/"],
  ["/gracias.:ext(asp|htm|html)", "/"],
  ["/arrozlegumbreshuevo.:ext(asp|htm|html)", "/restaurante"],
  ["/barra.:ext(asp|htm|html)", "/restaurante"],
  ["/bebidas.:ext(asp|htm|html)", "/restaurante"],
  ["/especialidades.:ext(asp|htm|html)", "/restaurante"],
  ["/helados.:ext(asp|htm|html)", "/restaurante"],
  ["/heladosypostres.:ext(asp|htm|html)", "/restaurante"],
  ["/parrillaensaladaspastas.:ext(asp|htm|html)", "/restaurante"],
  ["/pescados.:ext(asp|htm|html)", "/restaurante"],
  ["/platosfriossopas.:ext(asp|htm|html)", "/restaurante"],
  ["/restaurant.:ext(asp|htm|html)", "/restaurante"],
  ["/sugerenciasdeldia.:ext(asp|htm|html)", "/restaurante"],
  ["/vinos.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantArroz.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantBebidas.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantEspecial.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantHelados.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantParrilla.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantPescado.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantPlatos.:ext(asp|htm|html)", "/restaurante"],
  ["/RestaurantVinos.:ext(asp|htm|html)", "/restaurante"],
  ["/paginas_por/parri-i.:ext(asp|htm|html)", "/restaurante"],
  ["/paginas_por/pesc-i.:ext(asp|htm|html)", "/restaurante"],
  ["/Comodidades.:ext(asp|htm|html)", "/departamentos"],
  ["/comodidades.:ext(asp|htm|html)", "/departamentos"],
  ["/Motel.:ext(asp|htm|html)", "/departamentos"],
  ["/motel.:ext(asp|htm|html)", "/departamentos"],
  ["/GiftShop.:ext(asp|htm|html)", "/el-complejo"],
  ["/reservas.:ext(asp|htm|html)", "/consulta"],
  ["/reservasmain.:ext(asp|htm|html)", "/consulta"],
  ["/pedido.:ext(asp|htm|html)", "/consulta"],
  ["/Precios.:ext(asp|htm|html)", "/consulta"],
  ["/precios.:ext(asp|htm|html)", "/consulta"],
  ["/contactenos.:ext(asp|htm|html)", "/consulta"],
  ["/ubicacion.:ext(asp|htm|html)", "/como-llegar"],
  ["/images/:n(\\d+).htm", "/"],
];

const nextConfig: NextConfig = {
  images: {
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
  async redirects() {
    return viejas.map(([source, destination]) => ({ source, destination, permanent: true }));
  },
};

export default nextConfig;
