import { z } from "zod";

export const ContactoSchema = z.object({
  nombre: z.string().trim().min(2, "Ingresá tu nombre"),
  email: z.string().trim().email("Ingresá un email válido"),
  telefono: z
    .string()
    .trim()
    .regex(/^[+0-9 ()-]{6,20}$/, "Ingresá un teléfono válido")
    .optional()
    .or(z.literal("")),
  mensaje: z
    .string()
    .trim()
    .min(10, "Contanos un poco más (mínimo 10 caracteres)"),
});

export type ContactoInput = z.infer<typeof ContactoSchema>;
