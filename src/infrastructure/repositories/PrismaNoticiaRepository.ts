import { NoticiaRepository, NoticiaInput } from "@/domain/repositories/NoticiaRepository";
import { Noticia } from "@/domain/entities/Noticia";
import { Prisma } from "@prisma/client";
import { prisma } from "../db/prisma";
export class PrismaNoticiaRepository implements NoticiaRepository {
  async obtenerTodas(soloPublicadas = true): Promise<Noticia[]> {
    const registros = await prisma.noticia.findMany({
      where: soloPublicadas ? { publicado: true } : undefined,
      orderBy: { fecha: "desc" },
    });

    return registros.map((r) => this.aEntidad(r));
  }

  async obtenerPorId(id: number): Promise<Noticia | null> {
    const r = await prisma.noticia.findUnique({ where: { id } });
    if (!r) return null;

    return this.aEntidad(r);
  }

  async crear(input: NoticiaInput): Promise<Noticia> {
    const { imagenBin, imagenTipo, ...resto } = input;

    const r = await prisma.noticia.create({ data: resto });

    if (imagenBin && imagenTipo) {
      const conImagen = await prisma.noticia.update({
        where: { id: r.id },
        data: {
          imagenBin,
          imagenTipo,
          imagen: `/api/imagenes/noticia/${r.id}`,
        },
      });
      return this.aEntidad(conImagen);
    }

    return this.aEntidad(r);
  }

  async actualizar(id: number, input: NoticiaInput): Promise<Noticia> {
    const { imagenBin, imagenTipo, ...resto } = input;

    let data: Prisma.NoticiaUpdateInput = { ...resto };

    if (imagenBin !== undefined) {
      if (imagenBin === null) {
        data = { ...data, imagenBin: null, imagenTipo: null, imagen: "" };
      } else if (imagenTipo) {
        data = {
          ...data,
          imagenBin,
          imagenTipo,
          imagen: `/api/imagenes/noticia/${id}`,
        };
      }
    }

    const r = await prisma.noticia.update({ where: { id }, data });
    return this.aEntidad(r);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.noticia.delete({ where: { id } });
  }

  private aEntidad(r: {
    id: number;
    titulo: string;
    slug: string;
    descripcionBreve: string;
    descripcionDetalle: string;
    imagen: string;
    categoria: string;
    publicado: boolean;
    fecha: Date;
    createdAt: Date;
    updatedAt: Date;
  }): Noticia {
    return new Noticia({
      id: r.id,
      titulo: r.titulo,
      slug: r.slug,
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
