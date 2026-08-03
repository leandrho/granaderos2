import { EquipoRepository, EquipoInput } from "@/domain/repositories/EquipoRepository";
import { Equipo } from "@/domain/entities/Equipo";
import { prisma } from "../db/prisma";

export class PrismaEquipoRepository implements EquipoRepository {
  async obtenerTodos(): Promise<Equipo[]> {
    const registros = await prisma.equipo.findMany({
      orderBy: { nombre: "asc" },
    });

    return registros.map((r) => this.aEntidad(r));
  }

  async obtenerPorId(id: number): Promise<Equipo | null> {
    const r = await prisma.equipo.findUnique({ where: { id } });
    if (!r) return null;

    return this.aEntidad(r);
  }

  async crear(input: EquipoInput): Promise<Equipo> {
    const r = await prisma.equipo.create({ data: input });
    return this.aEntidad(r);
  }

  async actualizar(id: number, input: EquipoInput): Promise<Equipo> {
    const r = await prisma.equipo.update({ where: { id }, data: input });
    return this.aEntidad(r);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.equipo.delete({ where: { id } });
  }

  private aEntidad(r: {
    id: number;
    nombre: string;
    direccion: string;
    logo: string | null;
    ciudad: string | null;
    estadio: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Equipo {
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
