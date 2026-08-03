"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";
import { AdminNoticiaSchema } from "@/application/dtos/admin.noticia.dto";
import { slugificar } from "@/lib/utils/slug";

const repositorio = () => new PrismaNoticiaRepository();

export interface EstadoNoticia {
  errores?: Record<string, string[] | undefined>;
  error?: string;
}

export async function getNoticiasAction(soloPublicadas = false) {
  const noticias = await repositorio().obtenerTodas(soloPublicadas);
  return noticias.map((noticia) => noticia.toJSON());
}

export async function getNoticiaByIdAction(id: number) {
  const noticia = await repositorio().obtenerPorId(id);
  return noticia ? noticia.toJSON() : null;
}

async function resolverInput(formData: FormData) {
  const titulo = String(formData.get("titulo") ?? "");
  const slugManual = String(formData.get("slug") ?? "").trim();
  const slug = slugManual || slugificar(titulo);

  return AdminNoticiaSchema.safeParse({
    titulo,
    slug,
    descripcionBreve: formData.get("descripcionBreve"),
    descripcionDetalle: formData.get("descripcionDetalle"),
    imagen: formData.get("imagen"),
    categoria: formData.get("categoria"),
    fecha: formData.get("fecha"),
    publicado: formData.get("publicado"),
  });
}

export async function crearNoticia(
  estado: EstadoNoticia,
  formData: FormData
): Promise<EstadoNoticia> {
  const resultado = await resolverInput(formData);

  if (!resultado.success) {
    return { errores: resultado.error.flatten().fieldErrors };
  }

  try {
    await repositorio().crear(resultado.data);
  } catch (e) {
    if (e instanceof Error && e.message.includes("slug")) {
      return {
        error: "Ya existe una noticia con ese slug. Elegí otro.",
        errores: { slug: ["El slug ya está en uso."] },
      };
    }
    return { error: "No se pudo crear la noticia. Intentá de nuevo." };
  }

  revalidatePath("/noticias");
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function actualizarNoticia(
  id: number,
  estado: EstadoNoticia,
  formData: FormData
): Promise<EstadoNoticia> {
  const resultado = await resolverInput(formData);

  if (!resultado.success) {
    return { errores: resultado.error.flatten().fieldErrors };
  }

  try {
    await repositorio().actualizar(id, resultado.data);
  } catch (e) {
    if (e instanceof Error && e.message.includes("slug")) {
      return {
        error: "Ya existe una noticia con ese slug. Elegí otro.",
        errores: { slug: ["El slug ya está en uso."] },
      };
    }
    return { error: "No se pudo actualizar la noticia. Intentá de nuevo." };
  }

  revalidatePath("/noticias");
  revalidatePath(`/noticias/${id}`);
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function eliminarNoticia(id: number): Promise<void> {
  await repositorio().eliminar(id);
  revalidatePath("/noticias");
  revalidatePath("/admin/noticias");
}
