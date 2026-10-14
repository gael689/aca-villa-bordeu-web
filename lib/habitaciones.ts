import { foto, type Foto } from "./fotos";

// Las 26 habitaciones son similares y traen lo mismo; cambian las camas.
// Sin tarifas: se consultan.

export type TipoHabitacion = {
  slug: "single" | "doble" | "triple";
  nombre: string;
  camas: string;
  frase: string;
  personas: number;
  fotos: Foto[];
  /** encuadre de la foto de portada (object-position). No hay foto de un single: se muestra el lado del escritorio. */
  encuadre?: string;
};

const f = (archivo: string, alt: string) => foto("habitaciones", archivo, alt);

export const TIPOS: TipoHabitacion[] = [
  {
    slug: "single",
    nombre: "Single",
    camas: "Una cama",
    frase: "Para el que viaja solo o el jefe de equipo que necesita su espacio.",
    personas: 1,
    encuadre: "12% 60%",
    fotos: [
      f("02-doble-escritorio.jpg", "Habitación con escritorio, TV y cama, con cabecera de madera"),
      f("05-bano.jpg", "Baño privado con mampara de vidrio"),
      f("06-pasillo.jpg", "Pasillo de las habitaciones con puertas de madera"),
      f("04-habitacion-y-bano.jpg", "Habitación con el baño privado a la vista"),
      f("03-doble-vista-larga.jpg", "Habitación con escritorio y TV"),
    ],
  },
  {
    slug: "doble",
    nombre: "Doble",
    camas: "Dos camas o una matrimonial",
    frase: "Para compartir con un compañero de trabajo o viajar en pareja.",
    personas: 2,
    fotos: [
      f("03-doble-vista-larga.jpg", "Habitación doble con dos camas, escritorio y TV"),
      f("04-habitacion-y-bano.jpg", "Habitación con el baño privado a la vista"),
      f("05-bano.jpg", "Baño privado con mampara de vidrio"),
      f("02-doble-escritorio.jpg", "Escritorio con TV dentro de la habitación"),
      f("06-pasillo.jpg", "Pasillo de las habitaciones con puertas de madera"),
    ],
  },
  {
    slug: "triple",
    nombre: "Triple",
    camas: "Tres camas",
    frase: "Para equipos que comparten o familias que paran en la ruta.",
    personas: 3,
    fotos: [
      f("01-triple-dos-camas.jpg", "Habitación triple con cama matrimonial y cama individual, paredes grafito y madera"),
      f("02-doble-escritorio.jpg", "Escritorio con TV dentro de la habitación"),
      f("05-bano.jpg", "Baño privado con mampara de vidrio"),
      f("04-habitacion-y-bano.jpg", "Habitación con el baño privado a la vista"),
      f("06-pasillo.jpg", "Pasillo de las habitaciones con puertas de madera"),
    ],
  },
];

export const INCLUYE = [
  "Baño privado",
  "TV",
  "Escritorio",
  "Calefacción",
  "Aire acondicionado",
  "Wi-Fi",
  "Cochera cubierta en la puerta",
  "Ropa de cama y toallas",
];
