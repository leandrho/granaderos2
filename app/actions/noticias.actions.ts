"use server";

import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";
import { ObtenerNoticiasUseCase } from "@/application/use-cases/ObtenerNoticias";

export async function getNoticiasAction() {
  const repository = new PrismaNoticiaRepository();
  const useCase = new ObtenerNoticiasUseCase(repository);
  const noticias = await useCase.execute();
  return noticias.map((noticia) => noticia.toJSON());
}
