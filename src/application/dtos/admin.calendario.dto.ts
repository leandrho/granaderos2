import { z } from "zod";

const publicadoCheckbox = z.preprocess(
  (v) => v === "on" || v === "true" || v === true,
  z.boolean()
);

export const AdminEventoSchema = z.object({
  equipo1Id: z.coerce
    .number()
    .int()
    .positive("Seleccioná el equipo local")
    .refine((v) => v > 0, { message: "Seleccioná el equipo local" }),
  equipo2Id: z.coerce
    .number()
    .int()
    .positive("Seleccioná el equipo visitante")
    .refine((v) => v > 0, { message: "Seleccioná el equipo visitante" }),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  descripcionBreve: z.string().optional().nullable().default(null),
  descripcionDetalle: z.string().optional().nullable().default(null),
  imagen: z
    .string()
    .trim()
    .optional()
    .nullable()
    .default(null)
    .refine((v) => v === null || v === "" || v.startsWith("/"), {
      message: "La imagen debe ser una ruta relativa (ej. /news/imagen.jpg)",
    }),
  categoria: z.string().min(1, "La categoría es requerida"),
  fecha: z.coerce.date().refine((v) => !Number.isNaN(v.getTime()), {
    message: "La fecha es requerida",
  }),
  publicado: publicadoCheckbox.default(true),
});

export type AdminEventoDTO = z.infer<typeof AdminEventoSchema>;
