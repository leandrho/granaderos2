"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaEquipoRepository } from "@/infrastructure/repositories/PrismaEquipoRepository";
import { AdminEquipoSchema } from "@/application/dtos/admin.equipo.dto";

const repositorio = () => new PrismaEquipoRepository();

export interface EstadoEquipo {
  errores?: Record<string, string[] | undefined>;
  error?: string;
}

export async function getEquiposAction() {
  const equipos = await repositorio().obtenerTodos();
  return equipos.map((equipo) => equipo.toJSON());
}

export async function getEquipoByIdAction(id: number) {
  const equipo = await repositorio().obtenerPorId(id);
  return equipo ? equipo.toJSON() : null;
}

async function resolverInput(formData: FormData) {
  const vacioANull = (clave: string) => {
    const valor = String(formData.get(clave) ?? "").trim();
    return valor === "" ? null : valor;
  };

  return AdminEquipoSchema.safeParse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    logo: vacioANull("logo"),
    ciudad: vacioANull("ciudad"),
    estadio: vacioANull("estadio"),
  });
}

export async function crearEquipo(
  estado: EstadoEquipo,
  formData: FormData
): Promise<EstadoEquipo> {
  const resultado = await resolverInput(formData);

  if (!resultado.success) {
    return { errores: resultado.error.flatten().fieldErrors };
  }

  try {
    await repositorio().crear(resultado.data);
  } catch {
    return { error: "No se pudo crear el equipo. Intentá de nuevo." };
  }

  revalidatePath("/calendario");
  revalidatePath("/admin/equipos");
  redirect("/admin/equipos");
}

export async function actualizarEquipo(
  id: number,
  estado: EstadoEquipo,
  formData: FormData
): Promise<EstadoEquipo> {
  const resultado = await resolverInput(formData);

  if (!resultado.success) {
    return { errores: resultado.error.flatten().fieldErrors };
  }

  try {
    await repositorio().actualizar(id, resultado.data);
  } catch {
    return { error: "No se pudo actualizar el equipo. Intentá de nuevo." };
  }

  revalidatePath("/calendario");
  revalidatePath("/admin/equipos");
  redirect("/admin/equipos");
}

export async function eliminarEquipo(id: number): Promise<void> {
  await repositorio().eliminar(id);
  revalidatePath("/calendario");
  revalidatePath("/admin/equipos");
}
