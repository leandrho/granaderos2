import { headers } from "next/headers";
import { prisma } from "@/infrastructure/db/prisma";

export const MAX_PRIMER_ESCALON = 5;
export const MAX_SEGUNDO_ESCALON = 10;
export const ESPERA_PARCIAL_MS = 5 * 60 * 1000;
export const ESPERA_LARGA_MS = 24 * 60 * 60 * 1000;

export async function obtenerIpCliente(): Promise<string> {
  const store = await headers();
  const xff = store.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "desconocida";
  return store.get("x-real-ip") ?? "desconocida";
}

export async function minutosRestantesDeBloqueo(ip: string): Promise<number | null> {
  const estado = await prisma.bloqueoLogin.findUnique({ where: { ip } });
  if (!estado || !estado.bloqueadoHasta) return null;

  const bloqueadoHasta = estado.bloqueadoHasta.getTime();
  const ahora = Date.now();

  if (bloqueadoHasta > ahora) {
    return Math.max(1, Math.ceil((bloqueadoHasta - ahora) / 60000));
  }

  if (estado.conteoFallas >= MAX_SEGUNDO_ESCALON) {
    await prisma.bloqueoLogin.delete({ where: { ip } });
  } else {
    await prisma.bloqueoLogin.update({
      where: { ip },
      data: { bloqueadoHasta: null },
    });
  }
  return null;
}

export async function registrarFallo(ip: string, usuario: string): Promise<void> {
  const ahora = new Date();
  const estado = await prisma.bloqueoLogin.upsert({
    where: { ip },
    update: { conteoFallas: { increment: 1 } },
    create: { ip, conteoFallas: 1 },
  });

  await prisma.intentoLogin.create({ data: { ip, usuario } });

  const fallas = estado.conteoFallas;
  if (fallas === MAX_PRIMER_ESCALON) {
    await prisma.bloqueoLogin.update({
      where: { ip },
      data: { bloqueadoHasta: new Date(ahora.getTime() + ESPERA_PARCIAL_MS) },
    });
  } else if (fallas === MAX_SEGUNDO_ESCALON) {
    await prisma.bloqueoLogin.update({
      where: { ip },
      data: { bloqueadoHasta: new Date(ahora.getTime() + ESPERA_LARGA_MS) },
    });
  }
}

export async function limpiarBloqueo(ip: string): Promise<void> {
  await prisma.bloqueoLogin.deleteMany({ where: { ip } });
}
