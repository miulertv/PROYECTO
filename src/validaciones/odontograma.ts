import { z } from "zod";

// ===== Esquemas de validación Zod (en español) =====

/** Caras válidas de un diente */
const esqueCaraDiente = z.enum([
  "vestibular",
  "palatino",
  "mesial",
  "distal",
  "oclusal",
]);

/** Tipos de hallazgo válidos */
const esqueTipoHallazgo = z.enum([
  "caries",
  "obturacion",
  "ausente",
  "sellante",
]);

/** Estado de las caras de un diente individual */
const esqueEstadoCaras = z.object({
  vestibular: esqueTipoHallazgo.nullable(),
  palatino: esqueTipoHallazgo.nullable(),
  mesial: esqueTipoHallazgo.nullable(),
  distal: esqueTipoHallazgo.nullable(),
  oclusal: esqueTipoHallazgo.nullable(),
});

/** Estado completo de un diente */
const esqueEstadoDiente = z.object({
  numeroDiente: z.number().int().min(11).max(48),
  caras: esqueEstadoCaras,
});

/**
 * Esquema para validar la entrada de guardarOdontograma.
 * - pacienteId: UUID del paciente (se verifica existencia en DB)
 * - odontologoId: UUID del odontólogo que registra
 * - estadoDentalJson: Array de 32 dientes con sus caras
 */
export const esqueGuardarOdontograma = z.object({
  pacienteId: z
    .string()
    .uuid({ message: "El ID del paciente debe ser un UUID válido." }),
  odontologoId: z
    .string()
    .uuid({ message: "El ID del odontólogo debe ser un UUID válido." }),
  estadoDentalJson: z
    .array(esqueEstadoDiente)
    .min(1, { message: "El estado dental debe contener al menos un diente." })
    .max(32, { message: "El estado dental no puede tener más de 32 dientes." }),
});

/**
 * Esquema para validar la búsqueda de historial por DNI.
 * - dni: exactamente 8 dígitos numéricos
 */
export const esqueBuscarPorDni = z.object({
  dni: z
    .string()
    .length(8, { message: "El DNI debe tener exactamente 8 dígitos." })
    .regex(/^\d{8}$/, { message: "El DNI solo debe contener números." }),
});

/**
 * Esquema para validar la entrada de calcularPresupuesto.
 * - clinicaId: UUID de la clínica (para buscar precios de procedimientos)
 * - hallazgos: Lista de hallazgos encontrados en el odontograma
 */
export const esqueCalcularPresupuesto = z.object({
  clinicaId: z
    .string()
    .uuid({ message: "El ID de la clínica debe ser un UUID válido." }),
  hallazgos: z.array(
    z.object({
      numeroDiente: z.number().int().min(11).max(48),
      cara: esqueCaraDiente,
      tipoHallazgo: esqueTipoHallazgo,
    })
  ),
});

// ===== Tipos inferidos de los esquemas =====
export type EntradaGuardarOdontograma = z.infer<typeof esqueGuardarOdontograma>;
export type EntradaBuscarPorDni = z.infer<typeof esqueBuscarPorDni>;
export type EntradaCalcularPresupuesto = z.infer<typeof esqueCalcularPresupuesto>;
