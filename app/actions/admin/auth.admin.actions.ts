"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { prisma } from "@/infrastructure/db/prisma";
import { COOKIE_SESION, SEGUNDOS_DE_VALIDEZ, crearToken } from "@/lib/auth/jwt";
import { requiereSesion } from "@/lib/auth/session";
import {
  limpiarBloqueo,
  minutosRestantesDeBloqueo,
  obtenerIpCliente,
  registrarFallo,
} from "@/lib/auth/rate-limit";

export interface EstadoLogin {
  error?: string;
}

export async function loginAction(
  _estado: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const usuario = String(formData.get("usuario") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const ip = await obtenerIpCliente();

  const minutos = await minutosRestantesDeBloqueo(ip);
  if (minutos !== null) {
    return {
      error: `Demasiados intentos. Intentá de nuevo en ${minutos} min.`,
    };
  }

  const registro = await prisma.usuario.findUnique({ where: { usuario } });

  if (!registro || !(await compare(password, registro.hash))) {
    await registrarFallo(ip, usuario);
    return { error: "Credenciales inválidas." };
  }

  await limpiarBloqueo(ip);

  const token = await crearToken({
    id: registro.id,
    usuario: registro.usuario,
  });

  const store = await cookies();
  store.set(COOKIE_SESION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SEGUNDOS_DE_VALIDEZ,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function logoutAction(): Promise<void> {
  if (!(await requiereSesion())) return;
  const store = await cookies();
  store.delete(COOKIE_SESION);
  redirect("/admin");
}
