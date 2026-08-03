import { EventoCalendario } from "@/domain/entities/EventoCalendario";
import { EventoCalendarioRepository } from "@/domain/repositories/EventoCalendarioRepository";

export class ObtenerCalendarioUseCase {
  constructor(private readonly repository: EventoCalendarioRepository) {}

  async execute(soloPublicados = true): Promise<EventoCalendario[]> {
    return this.repository.obtenerTodos(soloPublicados);
  }
}
