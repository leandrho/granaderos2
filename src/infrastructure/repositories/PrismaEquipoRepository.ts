import { EquipoRepository } from "@/domain/repositories/EquipoRepository";
import { Equipo } from "@/domain/entities/Equipo";
import { prisma } from "../db/prisma";

export class PrismaEquipoRepository implements EquipoRepository {
  async obtenerTodos(): Promise<Equipo[]> {
    const registros = await prisma.equipo.findMany({
      orderBy: { nombre: "asc" },
    });

    return registros.map(
      (r) =>
        new Equipo({
          id: r.id,
          nombre: r.nombre,
          direccion: r.direccion,
          logo: r.logo,
          ciudad: r.ciudad,
          estadio: r.estadio,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        })
    );
  }

  async obtenerPorId(id: number): Promise<Equipo | null> {
    const r = await prisma.equipo.findUnique({ where: { id } });
    if (!r) return null;

    return new Equipo({
      id: r.id,
      nombre: r.nombre,
      direccion: r.direccion,
      logo: r.logo,
      ciudad: r.ciudad,
      estadio: r.estadio,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    });
  }
}
