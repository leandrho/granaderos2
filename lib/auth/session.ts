import { cookies } from "next/headers";
import { COOKIE_SESION, verificarToken } from "@/lib/auth/jwt";
import type { DatosSesion } from "@/lib/auth/jwt";

export async function leerCookieSesion(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(COOKIE_SESION)?.value;
}

export async function eliminarCookieSesion(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_SESION);
}

export async function requiereSesion(): Promise<DatosSesion | null> {
  const token = await leerCookieSesion();
  if (!token) return null;
  return verificarToken(token);
}
