"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaEventoCalendarioRepository } from "@/infrastructure/repositories/PrismaEventoCalendarioRepository";
import { AdminEventoSchema } from "@/application/dtos/admin.calendario.dto";
import { requiereSesion } from "@/lib/auth/session";
import { vacioANull } from "@/lib/utils/form";

const repositorio = () => new PrismaEventoCalendarioRepository();

export interface EstadoEvento {
  errores?: Record<string, string[] | undefined>;
  error?: string;
}

export async function getEventosAction(soloPublicados = false) {
  if (!(await requiereSesion())) return [];
  const eventos = await repositorio().obtenerTodos(soloPublicados);
  return eventos.map((evento) => evento.toJSON());
}

export async function getEventoByIdAction(id: number) {
  if (!(await requiereSesion())) return null;
  const evento = await repositorio().obtenerPorId(id);
  return evento ? evento.toJSON() : null;
}

async function resolverInput(formData: FormData) {
  return AdminEventoSchema.safeParse({
    equipo1Id: formData.get("equipo1Id"),
    equipo2Id: formData.get("equipo2Id"),
    ubicacion: formData.get("ubicacion"),
    descripcionBreve: vacioANull(formData, "descripcionBreve"),
    descripcionDetalle: vacioANull(formData, "descripcionDetalle"),
    imagen: vacioANull(formData, "imagen"),
    categoria: formData.get("categoria"),
    fecha: formData.get("fecha"),
    publicado: formData.get("publicado"),
  });
}

export async function crearEvento(
  estado: EstadoEvento,
  formData: FormData
): Promise<EstadoEvento> {
  const sesion = await requiereSesion();
  if (!sesion) {
    return { error: "Sesión inválida o expirada." };
  }

  const resultado = await resolverInput(formData);

  if (!resultado.success) {
    return { errores: resultado.error.flatten().fieldErrors };
  }

  try {
    await repositorio().crear(resultado.data);
  } catch {
    return { error: "No se pudo crear el evento. Intentá de nuevo." };
  }

  revalidatePath("/calendario");
  revalidatePath("/admin/calendario");
  redirect("/admin/calendario");
}

export async function actualizarEvento(
  id: number,
  estado: EstadoEvento,
  formData: FormData
): Promise<EstadoEvento> {
  const sesion = await requiereSesion();
  if (!sesion) {
    return { error: "Sesión inválida o expirada." };
  }

  const resultado = await resolverInput(formData);

  if (!resultado.success) {
    return { errores: resultado.error.flatten().fieldErrors };
  }

  try {
    await repositorio().actualizar(id, resultado.data);
  } catch {
    return { error: "No se pudo actualizar el evento. Intentá de nuevo." };
  }

  revalidatePath("/calendario");
  revalidatePath("/admin/calendario");
  redirect("/admin/calendario");
}

export async function eliminarEvento(id: number): Promise<void> {
  if (!(await requiereSesion())) return;
  await repositorio().eliminar(id);
  revalidatePath("/calendario");
  revalidatePath("/admin/calendario");
}
