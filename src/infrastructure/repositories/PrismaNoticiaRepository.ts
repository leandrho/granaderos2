import { NoticiaRepository } from "@/domain/repositories/NoticiaRepository";
import { Noticia } from "@/domain/entities/Noticia";
import { prisma } from "../db/prisma";

export class PrismaNoticiaRepository implements NoticiaRepository {
  async obtenerTodas(soloPublicadas = true): Promise<Noticia[]> {
    const registros = await prisma.noticia.findMany({
      where: soloPublicadas ? { publicado: true } : undefined,
      orderBy: { fecha: "desc" },
    });
    console.log("NOticias: ", registros)
    return registros.map(
      (r) =>
        new Noticia({
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
        })
    );
  }

  async obtenerPorId(id: number): Promise<Noticia | null> {
    const r = await prisma.noticia.findUnique({ where: { id } });
    if (!r) return null;

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

  async guardar(noticia: Noticia): Promise<void> {
    const data = noticia.toJSON();
    await prisma.noticia.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
}
