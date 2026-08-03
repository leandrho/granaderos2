import { Noticia } from "@/domain/entities/Noticia";
import { NoticiaRepository } from "@/domain/repositories/NoticiaRepository";

export class ObtenerNoticiaPorIdUseCase {
  constructor(private readonly repository: NoticiaRepository) {}

  async execute(id: number): Promise<Noticia | null> {
    return this.repository.obtenerPorId(id);
  }
}
