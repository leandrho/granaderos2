import { z } from "zod";

export const AdminEquipoSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  direccion: z.string().min(1, "La dirección es requerida"),
  logo: z.string().trim().optional().nullable().default(null),
  ciudad: z.string().trim().optional().nullable().default(null),
  estadio: z.string().trim().optional().nullable().default(null),
});

export type AdminEquipoDTO = z.infer<typeof AdminEquipoSchema>;
