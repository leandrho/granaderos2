"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@/generated/prisma/client";
import { PrismaNoticiaRepository } from "@/infrastructure/repositories/PrismaNoticiaRepository";
import { AdminNoticiaSchema, AdminNoticiaDTO } from "@/application/dtos/admin.noticia.dto";
import { slugificar } from "@/lib/utils/slug";
import {
  FORMATOS_NOTICIA,
  procesarArchivoImagen,
} from "@/lib/utils/imagen";
import { requiereSesion } from "@/lib/auth/session";

const repositorio = () => new PrismaNoticiaRepository();

const ERROR_SLUG_DUPLICADO: EstadoNoticia = {
  error: "Ya existe una noticia con ese slug. Elegí otro.",
  errores: { slug: ["El slug ya está en uso."] },
};

function esSlugDuplicado(e: unknown): boolean {
  return (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2002" &&
    Array.isArray(e.meta?.target) &&
    e.meta.target.includes("slug")
  );
}

export interface EstadoNoticia {
  errores?: Record<string, string[] | undefined>;
  error?: string;
  errorImagen?: string;
}

export async function getNoticiasAction(soloPublicadas = false) {
  if (!(await requiereSesion())) return [];
  const noticias = await repositorio().obtenerTodas(soloPublicadas);
  return noticias.map((noticia) => noticia.toJSON());
}

export async function getNoticiaByIdAction(id: number) {
  if (!(await requiereSesion())) return null;
  const noticia = await repositorio().obtenerPorId(id);
  return noticia ? noticia.toJSON() : null;
}

type NoticiaConImagen = AdminNoticiaDTO & {
  imagenBin?: Uint8Array<ArrayBuffer> | null;
  imagenTipo?: string | null;
};

type ResultadoInput =
  | { ok: true; data: NoticiaConImagen }
  | { ok: false; errores?: Record<string, string[] | undefined>; errorImagen?: string };

async function resolverInput(formData: FormData): Promise<ResultadoInput> {
  const titulo = String(formData.get("titulo") ?? "");
  const slugManual = String(formData.get("slug") ?? "").trim();
  const slug = slugManual || slugificar(titulo);

  const resultado = AdminNoticiaSchema.safeParse({
    titulo,
    slug,
    descripcionBreve: formData.get("descripcionBreve"),
    descripcionDetalle: formData.get("descripcionDetalle"),
    imagen: String(formData.get("imagen") ?? ""),
    categoria: formData.get("categoria"),
    fecha: formData.get("fecha"),
    publicado: formData.get("publicado"),
  });

  if (!resultado.success) {
    return { ok: false, errores: resultado.error.flatten().fieldErrors };
  }

  const archivo = formData.get("imagenFile");
  const imagen = await procesarArchivoImagen(
    archivo instanceof File ? archivo : null,
    FORMATOS_NOTICIA
  );

  if (imagen && !imagen.ok) {
    return { ok: false, errorImagen: imagen.error };
  }

  const data = resultado.data;

  if (imagen?.ok) {
    return {
      ok: true,
      data: { ...data, imagenBin: imagen.bytes, imagenTipo: imagen.tipo },
    };
  }

  if (formData.get("quitarImagen") === "on") {
    return { ok: true, data: { ...data, imagenBin: null, imagenTipo: null } };
  }

  return { ok: true, data };
}

export async function crearNoticia(
  estado: EstadoNoticia,
  formData: FormData
): Promise<EstadoNoticia> {
  const sesion = await requiereSesion();
  if (!sesion) {
    return { error: "Sesión inválida o expirada." };
  }

  const resultado = await resolverInput(formData);

  if (!resultado.ok) {
    return {
      errores: resultado.errores,
      errorImagen: resultado.errorImagen,
    };
  }

  try {
    await repositorio().crear(resultado.data);
  } catch (e) {
    if (esSlugDuplicado(e)) {
      return ERROR_SLUG_DUPLICADO;
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
  const sesion = await requiereSesion();
  if (!sesion) {
    return { error: "Sesión inválida o expirada." };
  }

  const resultado = await resolverInput(formData);

  if (!resultado.ok) {
    return {
      errores: resultado.errores,
      errorImagen: resultado.errorImagen,
    };
  }

  try {
    await repositorio().actualizar(id, resultado.data);
  } catch (e) {
    if (esSlugDuplicado(e)) {
      return ERROR_SLUG_DUPLICADO;
    }
    return { error: "No se pudo actualizar la noticia. Intentá de nuevo." };
  }

  revalidatePath("/noticias");
  revalidatePath(`/noticias/${id}`);
  revalidatePath("/admin/noticias");
  redirect("/admin/noticias");
}

export async function eliminarNoticia(id: number): Promise<void> {
  if (!(await requiereSesion())) return;
  await repositorio().eliminar(id);
  revalidatePath("/noticias");
  revalidatePath("/admin/noticias");
}
