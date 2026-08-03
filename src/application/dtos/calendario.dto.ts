import { z } from "zod";

export const CrearEventoSchema = z.object({
  equipo1: z.string().min(1, "Equipo 1 es requerido"),
  equipo2: z.string().min(1, "Equipo 2 es requerido"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  descripcionBreve: z.string().optional(),
  descripcionDetalle: z.string().optional(),
  imagen: z.string().url().optional().or(z.literal("")),
  categoria: z.string().min(1, "La categoría es requerida"),
  fecha: z.coerce.date(),
  publicado: z.boolean().default(true),
});

export type CrearEventoDTO = z.infer<typeof CrearEventoSchema>;
