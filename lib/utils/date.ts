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

export function partirFecha(fecha: string): FechaPartes | null {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  if (!anio || !mes || !dia) return null;
  return { anio, mes, dia };
}

export function mesCorto(fecha: string): string {
  const partes = partirFecha(fecha);
  return partes ? MESES_CORTO[partes.mes - 1] : "";
}

export function formatearFechaCorta(fecha: string): string {
  const partes = partirFecha(fecha);
  return partes ? `${partes.dia} ${MESES_CORTO[partes.mes - 1]}` : fecha;
}

export function formatearFechaLarga(fecha: string): string {
  const partes = partirFecha(fecha);
  if (!partes) return fecha;

  return new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(partes.anio, partes.mes - 1, partes.dia));
}
