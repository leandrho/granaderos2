import { EventoCalendario } from "@/domain/entities/EventoCalendario";
import { EventoCalendarioRepository } from "@/domain/repositories/EventoCalendarioRepository";

export class ObtenerProximosEventosUseCase {
  constructor(private readonly repository: EventoCalendarioRepository) {}

  async execute(limite?: number): Promise<EventoCalendario[]> {
    const eventos = await this.repository.obtenerTodos(true);
    const ahora = new Date();

    const proximos = eventos
      .filter((evento) => evento.fecha.getTime() >= ahora.getTime())
      .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

    return limite ? proximos.slice(0, limite) : proximos;
  }
}
