import { EquipoRepository, EquipoInput } from "@/domain/repositories/EquipoRepository";
import { Equipo } from "@/domain/entities/Equipo";
import { Prisma } from "@/generated/prisma/client";
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
    const { logoBin, logoTipo, ...resto } = input;

    const r = await prisma.equipo.create({ data: resto });

    if (logoBin && logoTipo) {
      const conLogo = await prisma.equipo.update({
        where: { id: r.id },
        data: {
          logoBin,
          logoTipo,
          logo: `/api/imagenes/equipo/${r.id}`,
        },
      });
      return this.aEntidad(conLogo);
    }

    return this.aEntidad(r);
  }

  async actualizar(id: number, input: EquipoInput): Promise<Equipo> {
    const { logoBin, logoTipo, ...resto } = input;

    let data: Prisma.EquipoUpdateInput = { ...resto };

    if (logoBin !== undefined) {
      if (logoBin === null) {
        data = { ...data, logoBin: null, logoTipo: null, logo: null };
      } else if (logoTipo) {
        data = {
          ...data,
          logoBin,
          logoTipo,
          logo: `/api/imagenes/equipo/${id}`,
        };
      }
    }

    const r = await prisma.equipo.update({ where: { id }, data });
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
