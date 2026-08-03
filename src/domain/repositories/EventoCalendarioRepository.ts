import { EventoCalendario } from "../entities/EventoCalendario";

export interface EventoCalendarioInput {
  equipo1Id: number;
  equipo2Id: number;
  ubicacion: string;
  descripcionBreve: string | null;
  descripcionDetalle: string | null;
  imagen: string | null;
  categoria: string;
  publicado: boolean;
  fecha: Date;
}

export interface EventoCalendarioRepository {
  obtenerTodos(soloPublicados?: boolean): Promise<EventoCalendario[]>;
  obtenerPorId(id: number): Promise<EventoCalendario | null>;
  crear(input: EventoCalendarioInput): Promise<EventoCalendario>;
  actualizar(
    id: number,
    input: EventoCalendarioInput
  ): Promise<EventoCalendario>;
  eliminar(id: number): Promise<void>;
}
