import { z } from "zod";

export const esqueCrearPaciente = z.object({
  dni: z
    .string()
    .length(8, { message: "El DNI debe tener exactamente 8 dígitos." })
    .regex(/^\d{8}$/, { message: "El DNI solo debe contener números." }),
  nombres: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres." })
    .max(100),
  apellidos: z
    .string()
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres." })
    .max(100),
  fechaNacimiento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Debe ser una fecha válida.",
  }),
  celular: z
    .string()
    .transform((val) => (val === "" ? null : val))
    .refine((val) => val === null || /^\d{9,15}$/.test(val), {
      message: "El celular debe tener entre 9 y 15 dígitos.",
    })
    .optional()
    .nullable(),
  genero: z.enum(["Masculino", "Femenino", "Otro"]).optional().nullable(),
  historiaClinicaNro: z
    .string()
    .min(1, { message: "El número de historia clínica es requerido." }),
  clinicaId: z.string().uuid({ message: "ID de clínica inválido." }),
});

export type EntradaCrearPaciente = z.infer<typeof esqueCrearPaciente>;
