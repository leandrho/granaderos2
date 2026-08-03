import { z } from "zod";

export const CrearNoticiaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  slug: z.string().min(3),
  descripcionBreve: z.string().max(250, "Máximo 250 caracteres"),
  descripcionDetalle: z.string().min(10),
  imagen: z.string().url("Debe ser una URL válida"),
  categoria: z.string().min(1, "La categoría es requerida"),
  fecha: z.coerce.date(),
  publicado: z.boolean().default(true),
});

export type CrearNoticiaDTO = z.infer<typeof CrearNoticiaSchema>;
