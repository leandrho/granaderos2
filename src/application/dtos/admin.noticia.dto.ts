import { z } from "zod";

const publicadoCheckbox = z.preprocess(
  (v) => v === "on" || v === "true" || v === true,
  z.boolean()
);

export const AdminNoticiaSchema = z.object({
  titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  slug: z.string().min(3, "El slug debe tener al menos 3 caracteres"),
  descripcionBreve: z
    .string()
    .min(1, "La descripción breve es requerida")
    .max(250, "Máximo 250 caracteres"),
  descripcionDetalle: z
    .string()
    .min(10, "La descripción detallada debe tener al menos 10 caracteres"),
  imagen: z
    .string()
    .trim()
    .refine((v) => v === "" || v.startsWith("/"), {
      message: "La imagen debe ser una ruta relativa (ej. /news/imagen.jpg)",
    }),
  categoria: z.string().min(1, "La categoría es requerida"),
  fecha: z.coerce.date().refine((v) => !Number.isNaN(v.getTime()), {
    message: "La fecha es requerida",
  }),
  publicado: publicadoCheckbox.default(true),
});

export type AdminNoticiaDTO = z.infer<typeof AdminNoticiaSchema>;
