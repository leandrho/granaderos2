import { Equipo } from "@/domain/entities/Equipo";
import { EquipoRepository } from "@/domain/repositories/EquipoRepository";

export class ObtenerEquiposUseCase {
  constructor(private readonly repository: EquipoRepository) {}

  async execute(): Promise<Equipo[]> {
    return this.repository.obtenerTodos();
  }
}
