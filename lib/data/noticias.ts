export interface Noticia {
  id: string;
  titulo: string;
  fecha: string;
  categoria: string;
  extracto: string;
  imagen: string | null;
}

export const NOTICIAS: Noticia[] = [
  {
    id: "grana-not-001",
    titulo: "Triunfazo de Primera ante Juventud Unida",
    fecha: "2026-07-28",
    categoria: "Primera",
    extracto:
      "El Grana se quedó con los tres puntos en casa con un 2 a 1 agónico. El próximo desafío, de visitante contra Sportivo Pringles.",
    imagen: null,
  },
  {
    id: "grana-not-002",
    titulo: "El fútbol femenino abre la inscripción",
    fecha: "2026-07-20",
    categoria: "Femenino",
    extracto:
      "Abrimos las inscripciones para la temporada 2026 del fútbol femenino. Todos los detalles para sumarte al plantel.",
    imagen: null,
  },
  {
    id: "grana-not-003",
    titulo: "La Sub-17 se prepara para el torneo juvenil",
    fecha: "2026-07-12",
    categoria: "Sub-17",
    extracto:
      "Con una pretemporada a pleno, la división juvenil ajusta detalles para el arranque del Torneo Juvenil de la Región.",
    imagen: null,
  },
];
