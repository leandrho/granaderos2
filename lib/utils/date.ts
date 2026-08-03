const MESES_CORTO = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
] as const;

export interface FechaPartes {
  anio: number;
  mes: number;
  dia: number;
}

function aPartes(fecha: string | Date): FechaPartes | null {
  if (fecha instanceof Date) {
    if (Number.isNaN(fecha.getTime())) return null;
    return {
      anio: fecha.getUTCFullYear(),
      mes: fecha.getUTCMonth() + 1,
      dia: fecha.getUTCDate(),
    };
  }

  const [anio, mes, dia] = fecha.split("-").map(Number);
  if (!anio || !mes || !dia) return null;
  return { anio, mes, dia };
}

export function partirFecha(fecha: string | Date): FechaPartes | null {
  return aPartes(fecha);
}

export function aISO(fecha: string | Date): string {
  const partes = aPartes(fecha);
  if (!partes) return String(fecha);
  return `${partes.anio}-${String(partes.mes).padStart(2, "0")}-${String(
    partes.dia
  ).padStart(2, "0")}`;
}

export function mesCorto(fecha: string | Date): string {
  const partes = aPartes(fecha);
  return partes ? MESES_CORTO[partes.mes - 1] : "";
}

export function formatearFechaCorta(fecha: string | Date): string {
  const partes = aPartes(fecha);
  return partes ? `${partes.dia} ${MESES_CORTO[partes.mes - 1]}` : String(fecha);
}

export function formatearFechaLarga(fecha: string | Date): string {
  const partes = aPartes(fecha);
  if (!partes) return String(fecha);

  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(partes.anio, partes.mes - 1, partes.dia));
}
