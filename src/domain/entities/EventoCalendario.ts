import { Equipo } from "./Equipo";

export interface EventoCalendarioProps {
  id: number;
  equipo1: Equipo;
  equipo2: Equipo;
  ubicacion: string;
  descripcionBreve?: string | null;
  descripcionDetalle?: string | null;
  imagen?: string | null;
  categoria: string;
  publicado: boolean;
  fecha: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class EventoCalendario {
  constructor(private readonly props: EventoCalendarioProps) {}

  get id(): number { return this.props.id; }
  get equipo1(): Equipo { return this.props.equipo1; }
  get equipo2(): Equipo { return this.props.equipo2; }
  get ubicacion(): string { return this.props.ubicacion; }
  get descripcionBreve(): string | undefined | null { return this.props.descripcionBreve; }
  get descripcionDetalle(): string | undefined | null { return this.props.descripcionDetalle; }
  get imagen(): string | undefined | null { return this.props.imagen; }
  get categoria(): string { return this.props.categoria; }
  get publicado(): boolean { return this.props.publicado; }
  get fecha(): Date { return this.props.fecha; }

  public toJSON(): EventoCalendarioProps {
    return { ...this.props };
  }
}
