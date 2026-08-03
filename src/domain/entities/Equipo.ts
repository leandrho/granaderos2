export interface EquipoProps {
  id: number;
  nombre: string;
  direccion: string;
  logo: string | null;
  ciudad: string | null;
  estadio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Equipo {
  constructor(private readonly props: EquipoProps) {}

  get id(): number { return this.props.id; }
  get nombre(): string { return this.props.nombre; }
  get direccion(): string { return this.props.direccion; }
  get logo(): string | null { return this.props.logo; }
  get ciudad(): string | null { return this.props.ciudad; }
  get estadio(): string | null { return this.props.estadio; }

  public toJSON(): EquipoProps {
    return { ...this.props };
  }
}
