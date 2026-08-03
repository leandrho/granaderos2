import { Noticia } from "../entities/Noticia";

export interface NoticiaInput {
  titulo: string;
  slug: string;
  descripcionBreve: string;
  descripcionDetalle: string;
  imagen: string;
  categoria: string;
  publicado: boolean;
  fecha: Date;
}

export interface NoticiaRepository {
  obtenerTodas(soloPublicadas?: boolean): Promise<Noticia[]>;
  obtenerPorId(id: number): Promise<Noticia | null>;
  crear(input: NoticiaInput): Promise<Noticia>;
  actualizar(id: number, input: NoticiaInput): Promise<Noticia>;
  eliminar(id: number): Promise<void>;
}
