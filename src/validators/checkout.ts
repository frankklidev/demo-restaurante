import { z } from "zod";

const phoneRegex = /^[0-9+\s()-]{7,}$/;

export const checkoutSchema = z
  .object({
    firstName: z.string().trim().min(1, "Nombre requerido"),
    lastName: z.string().trim().min(1, "Apellido requerido"),
    phone: z
      .string()
      .trim()
      .min(1, "Teléfono requerido")
      .regex(phoneRegex, "Teléfono inválido"),
    method: z.enum(["recoger", "domicilio"]),
    address: z.string().trim().optional().default(""),
    municipioId: z.string().trim().optional().default(""),
  })
  .superRefine((data, ctx) => {
    if (data.method === "domicilio") {
      if (!data.municipioId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["municipioId"],
          message: "Selecciona un municipio",
        });
      }
      if (!data.address || data.address.trim().length < 5) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Escribe una dirección válida",
        });
      }
    }
  });

export type CheckoutForm = z.infer<typeof checkoutSchema>;