import { Equipo } from "../entities/Equipo";

export interface EquipoInput {
  nombre: string;
  direccion: string;
  logo: string | null;
  ciudad: string | null;
  estadio: string | null;
}

export interface EquipoRepository {
  obtenerTodos(): Promise<Equipo[]>;
  obtenerPorId(id: number): Promise<Equipo | null>;
  crear(input: EquipoInput): Promise<Equipo>;
  actualizar(id: number, input: EquipoInput): Promise<Equipo>;
  eliminar(id: number): Promise<void>;
}
