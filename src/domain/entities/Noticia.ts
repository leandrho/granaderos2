export interface NoticiaProps {
  id: number;
  titulo: string;
  slug: string;
  descripcionBreve: string;
  descripcionDetalle: string;
  imagen: string;
  categoria: string;
  publicado: boolean;
  fecha: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Noticia {
  constructor(private readonly props: NoticiaProps) {}

  get id(): number { return this.props.id; }
  get titulo(): string { return this.props.titulo; }
  get slug(): string { return this.props.slug; }
  get descripcionBreve(): string { return this.props.descripcionBreve; }
  get descripcionDetalle(): string { return this.props.descripcionDetalle; }
  get imagen(): string { return this.props.imagen; }
  get categoria(): string { return this.props.categoria; }
  get publicado(): boolean { return this.props.publicado; }
  get fecha(): Date { return this.props.fecha; }

  public toJSON(): NoticiaProps {
    return { ...this.props };
  }
}
