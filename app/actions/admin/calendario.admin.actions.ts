"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaEventoCalendarioRepository } from "@/infrastructure/repositories/PrismaEventoCalendarioRepository";
import { AdminEventoSchema } from "@/application/dtos/admin.calendario.dto";

const repositorio = () => new PrismaEventoCalendarioRepository();

export interface EstadoEvento {
  errores?: Record<string, string[] | undefined>;
  error?: string;
}

export async function getEventosAction(soloPublicados = false) {
  const eventos = await repositorio().obtenerTodos(soloPublicados);
  return eventos.map((evento) => evento.toJSON());
}

export async function getEventoByIdAction(id: number) {
  const evento = await repositorio().obtenerPorId(id);
  return evento ? evento.toJSON() : null;
}

async function resolverInput(formData: FormData) {
  const vacioANull = (clave: string) => {
    const valor = String(formData.get(clave) ?? "").trim();
    return valor === "" ? null : valor;
  };

  return AdminEventoSchema.safeParse({
    equipo1Id: formData.get("equipo1Id"),
    equipo2Id: formData.get("equipo2Id"),
    ubicacion: formData.get("ubicacion"),
    descripcionBreve: vacioANull("descripcionBreve"),
    descripcionDetalle: vacioANull("descripcionDetalle"),
    imagen: vacioANull("imagen"),
    categoria: formData.get("categoria"),
    fecha: formData.get("fecha"),
    publicado: formData.get("publicado"),
  });
}

export async function crearEvento(
  estado: EstadoEvento,
  formData: FormData
): Promise<EstadoEvento> {
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
  await repositorio().eliminar(id);
  revalidatePath("/calendario");
  revalidatePath("/admin/calendario");
}
