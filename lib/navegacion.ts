import type { IconoNombre } from "@/components/marca/Icono";

export type ItemMenu = { href: string; texto: string; detalle?: string; icono?: IconoNombre; foto?: string };

/** Un desplegable del menú: sus enlaces y la foto con el lema que acompaña al panel en escritorio. */
export type EntradaMenu = {
  href: string;
  texto: string;
  hijos?: ItemMenu[];
  /** Título de la lista dentro del panel (por ejemplo «Por rubro»). */
  rotulo?: string;
  panel?: { foto: string; alt: string; lema: [string, string] };
};

// Los rubros son las páginas /empresas/<slug> de lib/rubros.ts. Van escritos acá y no importados
// porque el encabezado es un componente de cliente: importar RUBROS mandaría al navegador todo el
// contenido de las cuatro páginas. Si se agrega o renombra un rubro, sumarlo también acá.
export const MENU: EntradaMenu[] = [
  { href: "/socios-aca", texto: "Socios" },
  {
    href: "/empresas",
    texto: "Empresas",
    rotulo: "Por rubro",
    hijos: [
      { href: "/empresas/petroquimica-y-puerto", texto: "Petroquímica y puerto", detalle: "A 12 km de Ingeniero White", icono: "casco" },
      { href: "/empresas/energia", texto: "Energía", detalle: "Gas, ductos y parques eólicos", icono: "sol" },
      { href: "/empresas/obra-vial-y-transporte", texto: "Obra vial y transporte", detalle: "Sobre el cruce de las rutas 3 y 33", icono: "camion" },
      { href: "/empresas/agro", texto: "Agro", detalle: "Al lado del predio de la Rural", icono: "hoja" },
      { href: "/delegaciones-deportivas", texto: "Delegaciones deportivas", detalle: "Clubes y equipos de viaje", icono: "trofeo" },
      { href: "/empresas", texto: "Todo para empresas", detalle: "Cochera, Resto, lavandería y oficina", icono: "reunion" },
    ],
    panel: { foto: "predio/cocheras-noche.jpg", alt: "Cocheras de Villa Bordeu de noche", lema: ["Tu equipo,", "en un mismo predio"] },
  },
  { href: "/habitaciones", texto: "Habitaciones" },
  { href: "/restaurante", texto: "Restaurante" },
  {
    href: "/instalaciones",
    texto: "Instalaciones",
    hijos: [
      { href: "/instalaciones", texto: "Todo el predio", detalle: "Cocheras, gimnasio, tienda", icono: "pin", foto: "gimnasio/01-gym-pared-verde.jpg" },
      { href: "/sala-de-reuniones", texto: "Sala de reuniones", detalle: "Para capacitaciones y reuniones de obra", icono: "reunion", foto: "sala-reuniones/01-mesa.jpg" },
      { href: "/estacion-de-servicio", texto: "Estación de servicio", detalle: "YPF en el mismo predio", icono: "surtidor", foto: "cafeteria/03-mostrador.jpg" },
      { href: "/historia", texto: "Nuestra historia", detalle: "ACA desde 1904", icono: "reloj", foto: "restaurante/04-vitrina-botellas.jpg" },
    ],
    panel: { foto: "gimnasio/01-gym-pared-verde.jpg", alt: "Gimnasio de Villa Bordeu", lema: ["Todo en", "un mismo predio"] },
  },
  { href: "/como-llegar", texto: "Cómo llegar" },
];
