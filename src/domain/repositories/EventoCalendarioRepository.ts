import { EventoCalendario } from "../entities/EventoCalendario";

export interface EventoCalendarioRepository {
  obtenerTodos(soloPublicados?: boolean): Promise<EventoCalendario[]>;
  obtenerPorId(id: number): Promise<EventoCalendario | null>;
  guardar(evento: EventoCalendario): Promise<void>;
}
