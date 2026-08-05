import { z } from "zod";

export const publicadoCheckbox = z.preprocess(
  (v) => v === "on" || v === "true" || v === true,
  z.boolean()
);

export const fechaRequerida = z.coerce.date().refine((v) => !Number.isNaN(v.getTime()), {
  message: "La fecha es requerida",
});
