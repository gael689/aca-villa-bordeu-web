import type { IconoNombre } from "@/components/marca/Icono";

export type ItemMenu = { href: string; texto: string; detalle?: string; icono?: IconoNombre; foto?: string };

export const MENU: { href: string; texto: string; hijos?: ItemMenu[] }[] = [
  { href: "/empresas", texto: "Empresas" },
  { href: "/departamentos", texto: "Departamentos" },
  { href: "/restaurante", texto: "Restaurante" },
  {
    href: "/instalaciones",
    texto: "Instalaciones",
    hijos: [
      { href: "/instalaciones", texto: "Todo el predio", detalle: "Cocheras, gimnasio, tienda", icono: "pin", foto: "gimnasio/01-gym-pared-verde.jpg" },
      { href: "/sala-de-reuniones", texto: "Sala de reuniones", detalle: "Para capacitaciones y reuniones de obra", icono: "reunion", foto: "sala-reuniones/01-mesa.jpg" },
      { href: "/estacion-de-servicio", texto: "Estación de servicio", detalle: "YPF en el mismo predio", icono: "surtidor", foto: "cafeteria/03-mostrador.jpg" },
      { href: "/socios-aca", texto: "Socios ACA", detalle: "Beneficios y la red hacia el sur", icono: "escudo", foto: "restaurante/05-cafe-logo.jpg" },
      { href: "/historia", texto: "Nuestra historia", detalle: "ACA desde 1904", icono: "reloj", foto: "restaurante/04-vitrina-botellas.jpg" },
    ],
  },
  { href: "/como-llegar", texto: "Cómo llegar" },
];
