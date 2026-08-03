import { Noticia } from "@/domain/entities/Noticia";
import { NoticiaRepository } from "@/domain/repositories/NoticiaRepository";

export class ObtenerNoticiasUseCase {
  constructor(private readonly repository: NoticiaRepository) {}

  async execute(soloPublicadas = true): Promise<Noticia[]> {
    return this.repository.obtenerTodas(soloPublicadas);
  }
}
