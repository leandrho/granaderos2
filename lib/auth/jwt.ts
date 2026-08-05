import { SignJWT, jwtVerify } from "jose";

export const COOKIE_SESION = "admin_token";
export const SEGUNDOS_DE_VALIDEZ = 60 * 60 * 2;

export interface DatosSesion {
  id: number;
  usuario: string;
}

function obtenerSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en el entorno.");
  }
  return new TextEncoder().encode(secret);
}

export async function crearToken({ id, usuario }: DatosSesion): Promise<string> {
  return new SignJWT({ usuario })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SEGUNDOS_DE_VALIDEZ * 1000))
    .sign(obtenerSecret());
}

export async function verificarToken(token: string): Promise<DatosSesion | null> {
  try {
    const { payload } = await jwtVerify(token, obtenerSecret());
    const id = typeof payload.sub === "string" ? Number(payload.sub) : NaN;
    const usuario = typeof payload.usuario === "string" ? payload.usuario : "";
    if (!Number.isInteger(id) || !usuario) return null;
    return { id, usuario };
  } catch {
    return null;
  }
}
