"use server";

import { PrismaEventoCalendarioRepository } from "@/infrastructure/repositories/PrismaEventoCalendarioRepository";
import { ObtenerCalendarioUseCase } from "@/application/use-cases/ObtenerCalendario";

export async function getCalendarioAction() {
  const repository = new PrismaEventoCalendarioRepository();
  const useCase = new ObtenerCalendarioUseCase(repository);
  const eventos = await useCase.execute();
  return eventos.map((evento) => evento.toJSON());
}
