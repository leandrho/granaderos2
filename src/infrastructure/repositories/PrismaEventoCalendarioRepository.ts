import { EventoCalendarioRepository } from "@/domain/repositories/EventoCalendarioRepository";
import { EventoCalendario } from "@/domain/entities/EventoCalendario";
import { Equipo } from "@/domain/entities/Equipo";
import { prisma } from "../db/prisma";

export class PrismaEventoCalendarioRepository
  implements EventoCalendarioRepository
{
  async obtenerTodos(soloPublicados = true): Promise<EventoCalendario[]> {
    const registros = await prisma.eventoCalendario.findMany({
      where: soloPublicados ? { publicado: true } : undefined,
      orderBy: { fecha: "asc" },
      include: { equipo1: true, equipo2: true },
    });

    return registros.map((r) => this.aEntidad(r));
  }

  async obtenerPorId(id: number): Promise<EventoCalendario | null> {
    const r = await prisma.eventoCalendario.findUnique({
      where: { id },
      include: { equipo1: true, equipo2: true },
    });
    if (!r) return null;

    return this.aEntidad(r);
  }

  async guardar(evento: EventoCalendario): Promise<void> {
    const data = {
      equipo1Id: evento.equipo1.id,
      equipo2Id: evento.equipo2.id,
      ubicacion: evento.ubicacion,
      descripcionBreve: evento.descripcionBreve ?? null,
      descripcionDetalle: evento.descripcionDetalle ?? null,
      imagen: evento.imagen ?? null,
      categoria: evento.categoria,
      publicado: evento.publicado,
      fecha: evento.fecha,
    };

    await prisma.eventoCalendario.upsert({
      where: { id: evento.id },
      update: data,
      create: data,
    });
  }

  private aEntidad(r: {
    id: number;
    equipo1Id: number;
    equipo2Id: number;
    equipo1: {
      id: number;
      nombre: string;
      direccion: string;
      logo: string | null;
      ciudad: string | null;
      estadio: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    equipo2: {
      id: number;
      nombre: string;
      direccion: string;
      logo: string | null;
      ciudad: string | null;
      estadio: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
    ubicacion: string;
    descripcionBreve: string | null;
    descripcionDetalle: string | null;
    imagen: string | null;
    categoria: string;
    publicado: boolean;
    fecha: Date;
    createdAt: Date;
    updatedAt: Date;
  }): EventoCalendario {
    return new EventoCalendario({
      id: r.id,
      equipo1: new Equipo({
        id: r.equipo1.id,
        nombre: r.equipo1.nombre,
        direccion: r.equipo1.direccion,
        logo: r.equipo1.logo,
        ciudad: r.equipo1.ciudad,
        estadio: r.equipo1.estadio,
        createdAt: r.equipo1.createdAt,
        updatedAt: r.equipo1.updatedAt,
      }),
      equipo2: new Equipo({
        id: r.equipo2.id,
        nombre: r.equipo2.nombre,
        direccion: r.equipo2.direccion,
        logo: r.equipo2.logo,
        ciudad: r.equipo2.ciudad,
        estadio: r.equipo2.estadio,
        createdAt: r.equipo2.createdAt,
        updatedAt: r.equipo2.updatedAt,
      }),
      ubicacion: r.ubicacion,
      descripcionBreve: r.descripcionBreve,
      descripcionDetalle: r.descripcionDetalle,
      imagen: r.imagen,
      categoria: r.categoria,
      publicado: r.publicado,
      fecha: r.fecha,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
