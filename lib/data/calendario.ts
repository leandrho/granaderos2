export type Categoria =
  | "Primera"
  | "Reserva"
  | "Sub-15"
  | "Sub-17"
  | "Femenino";

export interface Partido {
  id: string;
  fecha: string;
  hora: string;
  categoria: Categoria;
  rival: string;
  local: boolean;
  competencia: string;
}

export const PROXIMOS_PARTIDOS: Partido[] = [
  {
    id: "grana-001",
    fecha: "2026-08-09",
    hora: "16:30",
    categoria: "Primera",
    rival: "Juventud Unida de San Luis",
    local: true,
    competencia: "Liga Sanluiseña de Fútbol",
  },
  {
    id: "grana-002",
    fecha: "2026-08-16",
    hora: "15:00",
    categoria: "Reserva",
    rival: "Sportivo Pringles",
    local: false,
    competencia: "Liga Sanluiseña de Fútbol",
  },
  {
    id: "grana-003",
    fecha: "2026-08-23",
    hora: "11:00",
    categoria: "Sub-17",
    rival: "Club Pringles",
    local: true,
    competencia: "Torneo Juvenil de la Región",
  },
  {
    id: "grana-004",
    fecha: "2026-08-30",
    hora: "10:00",
    categoria: "Sub-15",
    rival: "Defensores de La Punta",
    local: false,
    competencia: "Torneo Juvenil de la Región",
  },
  {
    id: "grana-005",
    fecha: "2026-09-06",
    hora: "17:00",
    categoria: "Femenino",
    rival: "Atlético Villa Mercedes",
    local: true,
    competencia: "Campeonato Femenino Provincial",
  },
];
