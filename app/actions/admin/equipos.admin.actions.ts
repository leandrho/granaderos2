"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaEquipoRepository } from "@/infrastructure/repositories/PrismaEquipoRepository";
import { AdminEquipoSchema, AdminEquipoDTO } from "@/application/dtos/admin.equipo.dto";
import {
  FORMATOS_EQUIPO,
  procesarArchivoImagen,
} from "@/lib/utils/imagen";

const repositorio = () => new PrismaEquipoRepository();

export interface EstadoEquipo {
  errores?: Record<string, string[] | undefined>;
  error?: string;
  errorImagen?: string;
}

export async function getEquiposAction() {
  const equipos = await repositorio().obtenerTodos();
  return equipos.map((equipo) => equipo.toJSON());
}

export async function getEquipoByIdAction(id: number) {
  const equipo = await repositorio().obtenerPorId(id);
  return equipo ? equipo.toJSON() : null;
}

type EquipoConLogo = AdminEquipoDTO & {
  logoBin?: Uint8Array<ArrayBuffer> | null;
  logoTipo?: string | null;
};

type ResultadoInput =
  | { ok: true; data: EquipoConLogo }
  | { ok: false; errores?: Record<string, string[] | undefined>; errorImagen?: string };

async function resolverInput(formData: FormData): Promise<ResultadoInput> {
  const vacioANull = (clave: string) => {
    const valor = String(formData.get(clave) ?? "").trim();
    return valor === "" ? null : valor;
  };

  const resultado = AdminEquipoSchema.safeParse({
    nombre: formData.get("nombre"),
    direccion: formData.get("direccion"),
    logo: vacioANull("logo"),
    ciudad: vacioANull("ciudad"),
    estadio: vacioANull("estadio"),
  });

  if (!resultado.success) {
    return { ok: false, errores: resultado.error.flatten().fieldErrors };
  }

  const archivo = formData.get("logoFile");
  const logo = await procesarArchivoImagen(
    archivo instanceof File ? archivo : null,
    FORMATOS_EQUIPO
  );

  if (logo && !logo.ok) {
    return { ok: false, errorImagen: logo.error };
  }

  if (logo?.ok) {
    return {
      ok: true,
      data: { ...resultado.data, logoBin: logo.bytes, logoTipo: logo.tipo },
    };
  }

  if (formData.get("quitarLogo") === "on") {
    return { ok: true, data: { ...resultado.data, logoBin: null, logoTipo: null } };
  }

  return { ok: true, data: resultado.data };
}

export async function crearEquipo(
  estado: EstadoEquipo,
  formData: FormData
): Promise<EstadoEquipo> {
  const resultado = await resolverInput(formData);

  if (!resultado.ok) {
    return {
      errores: resultado.errores,
      errorImagen: resultado.errorImagen,
    };
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

  if (!resultado.ok) {
    return {
      errores: resultado.errores,
      errorImagen: resultado.errorImagen,
    };
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
