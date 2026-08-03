import { Equipo } from "../entities/Equipo";

export interface EquipoRepository {
  obtenerTodos(): Promise<Equipo[]>;
  obtenerPorId(id: number): Promise<Equipo | null>;
}
