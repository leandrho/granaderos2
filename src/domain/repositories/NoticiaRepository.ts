import { Noticia } from "../entities/Noticia";

export interface NoticiaRepository {
  obtenerTodas(soloPublicadas?: boolean): Promise<Noticia[]>;
  obtenerPorId(id: number): Promise<Noticia | null>;
  guardar(noticia: Noticia): Promise<void>;
}
