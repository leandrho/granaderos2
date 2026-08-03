import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const EQUIPOS = [
  {
    id: 1,
    nombre: "Granaderos de Koslay",
    direccion: "Av. de la Ribera s/n, El Volcán, San Luis",
    logo: "/logo1.png",
    ciudad: "Juana Koslay",
    estadio: "Estadio de Granaderos de Koslay",
  },
  {
    id: 2,
    nombre: "Juventud Unida de San Luis",
    direccion: "Av. Illia 1250, San Luis",
    logo: null,
    ciudad: "San Luis",
    estadio: null,
  },
  {
    id: 3,
    nombre: "Sportivo Pringles",
    direccion: "Calle 25 de Mayo 480, Pringles",
    logo: null,
    ciudad: "Pringles, San Luis",
    estadio: null,
  },
  {
    id: 4,
    nombre: "Club Pringles",
    direccion: "Ruta 7 km 785, Pringles",
    logo: null,
    ciudad: "Pringles, San Luis",
    estadio: null,
  },
  {
    id: 5,
    nombre: "Defensores de La Punta",
    direccion: "Av. de los Cóndores 900, La Punta",
    logo: null,
    ciudad: "La Punta, San Luis",
    estadio: null,
  },
  {
    id: 6,
    nombre: "Atlético Villa Mercedes",
    direccion: "Calle Belgrano 320, Villa Mercedes",
    logo: null,
    ciudad: "Villa Mercedes, San Luis",
    estadio: null,
  },
];

const NOTICIAS = [
  {
    titulo: "Triunfazo de Primera ante Juventud Unida",
    slug: "triunfazo-de-primera-ante-juventud-unida",
    descripcionBreve:
      "El Grana se quedó con los tres puntos en casa con un 2 a 1 agónico. El próximo desafío, de visitante contra Sportivo Pringles.",
    descripcionDetalle:
      "El Grana se quedó con los tres puntos en casa tras un 2 a 1 agónico ante Juventud Unida. En un partido parejo, el equipo supo aprovechar las ocasiones que generó y cerró el encuentro con un triunfo que le permite seguir prendido arriba en la tabla.\n\nEl próximo desafío será de visitante contra Sportivo Pringles, donde el equipo buscará estirar la racha y seguir sumando en el campeonato.",
    imagen: "",
    categoria: "Primera",
    publicado: true,
    fecha: new Date("2026-07-28"),
  },
  {
    titulo: "El fútbol femenino abre la inscripción",
    slug: "el-futbol-femenino-abre-la-inscripcion",
    descripcionBreve:
      "Abrimos las inscripciones para la temporada 2026 del fútbol femenino. Todos los detalles para sumarte al plantel.",
    descripcionDetalle:
      "Abrimos las inscripciones para la temporada 2026 del fútbol femenino. El club busca sumar jugadoras para conformar un plantel competitivo que represente a Granaderos de Koslay en el Campeonato Femenino Provincial.\n\nLas interesadas pueden acercarse a las instalaciones del club o escribirnos por nuestras redes para conocer los horarios de entrenamiento y todos los detalles para sumarse al equipo.",
    imagen: "",
    categoria: "Femenino",
    publicado: true,
    fecha: new Date("2026-07-20"),
  },
  {
    titulo: "La Sub-17 se prepara para el torneo juvenil",
    slug: "la-sub-17-se-prepara-para-el-torneo-juvenil",
    descripcionBreve:
      "Con una pretemporada a pleno, la división juvenil ajusta detalles para el arranque del Torneo Juvenil de la Región.",
    descripcionDetalle:
      "Con una pretemporada a pleno, la Sub-17 ajusta detalles para el arranque del Torneo Juvenil de la Región. Los entrenamientos suman intensidad y el cuerpo técnico trabaja en la puesta a punto del plantel.\n\nEl objetivo es llegar en las mejores condiciones al debut y competir de igual a igual contra los demás clubes de la zona, manteniendo la identidad formativa del club.",
    imagen: "",
    categoria: "Sub-17",
    publicado: true,
    fecha: new Date("2026-07-12"),
  },
];

const EVENTOS = [
  {
    id: 1,
    equipo1Id: 1,
    equipo2Id: 2,
    ubicacion: "Estadio de Granaderos de Koslay, Juana Koslay",
    descripcionBreve: "Liga Sanluiseña de Fútbol · 16:30 hs",
    categoria: "Primera",
    publicado: true,
    fecha: new Date("2026-08-09"),
  },
  {
    id: 2,
    equipo1Id: 1,
    equipo2Id: 3,
    ubicacion: "Condición visitante",
    descripcionBreve: "Liga Sanluiseña de Fútbol · 15:00 hs",
    categoria: "Reserva",
    publicado: true,
    fecha: new Date("2026-08-16"),
  },
  {
    id: 3,
    equipo1Id: 1,
    equipo2Id: 4,
    ubicacion: "Estadio de Granaderos de Koslay, Juana Koslay",
    descripcionBreve: "Torneo Juvenil de la Región · 11:00 hs",
    categoria: "Sub-17",
    publicado: true,
    fecha: new Date("2026-08-23"),
  },
  {
    id: 4,
    equipo1Id: 1,
    equipo2Id: 5,
    ubicacion: "Condición visitante",
    descripcionBreve: "Torneo Juvenil de la Región · 10:00 hs",
    categoria: "Sub-15",
    publicado: true,
    fecha: new Date("2026-08-30"),
  },
  {
    id: 5,
    equipo1Id: 1,
    equipo2Id: 6,
    ubicacion: "Estadio de Granaderos de Koslay, Juana Koslay",
    descripcionBreve: "Campeonato Femenino Provincial · 17:00 hs",
    categoria: "Femenino",
    publicado: true,
    fecha: new Date("2026-09-06"),
  },
];

async function main() {
  for (const equipo of EQUIPOS) {
    await prisma.equipo.upsert({
      where: { id: equipo.id },
      update: equipo,
      create: equipo,
    });
  }

  for (const noticia of NOTICIAS) {
    await prisma.noticia.upsert({
      where: { slug: noticia.slug },
      update: noticia,
      create: noticia,
    });
  }

  for (const evento of EVENTOS) {
    await prisma.eventoCalendario.upsert({
      where: { id: evento.id },
      update: evento,
      create: evento,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
