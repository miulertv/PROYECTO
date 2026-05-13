"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// ===== Tipos para el resultado del cálculo =====

/** Un hallazgo individual para calcular */
interface HallazgoParaCalculo {
  numeroDiente: number;
  cara: string;
  tipoHallazgo: string;
}

/** Detalle de un ítem en el presupuesto */
export interface ItemPresupuesto {
  numeroDiente: number;
  cara: string;
  tipoHallazgo: string;
  procedimientoNombre: string;
  procedimientoId: string;
  precioUnitario: number;
}

/** Resultado completo del cálculo de presupuesto */
export interface ResultadoPresupuesto {
  items: ItemPresupuesto[];
  subtotal: number;
  igv: number;
  total: number;
  porcentajeIgv: number;
}

// ===== Mapeo hallazgo → nombre de procedimiento en la DB =====
const MAPEO_HALLAZGO_PROCEDIMIENTO: Record<string, string[]> = {
  caries: ["Restauración", "Resina", "Restauración / Resina"],
  obturacion: ["Obturación", "Obturación existente"],
  ausente: ["Prótesis", "Implante", "Prótesis / Implante"],
  sellante: ["Sellante", "Aplicación de sellante"],
};

/**
 * calcularPresupuesto
 * --------------------
 * Recibe una lista de hallazgos del odontograma y el ID de la clínica.
 * Busca los procedimientos correspondientes en la base de datos para
 * obtener precios reales. Calcula subtotal, IGV (18%) y total.
 *
 * @param clinicaId - UUID de la clínica
 * @param hallazgos - Array de hallazgos {numeroDiente, cara, tipoHallazgo}
 * @returns ResultadoPresupuesto con desglose e IGV
 */
export async function calcularPresupuesto(
  clinicaId: string,
  hallazgos: HallazgoParaCalculo[]
): Promise<ResultadoPresupuesto> {
  const PORCENTAJE_IGV = 0.18;

  // Obtener todos los procedimientos de la clínica
  const procedimientosClinica = await prisma.procedimiento.findMany({
    where: { clinica_id: clinicaId },
    select: {
      id: true,
      nombre: true,
      precio_base: true,
    },
  });

  const items: ItemPresupuesto[] = [];

  for (const hallazgo of hallazgos) {
    // Ignorar "obturacion" (ya existente, no tiene costo nuevo)
    if (hallazgo.tipoHallazgo === "obturacion") {
      items.push({
        numeroDiente: hallazgo.numeroDiente,
        cara: hallazgo.cara,
        tipoHallazgo: hallazgo.tipoHallazgo,
        procedimientoNombre: "Obturación existente (sin costo)",
        procedimientoId: "",
        precioUnitario: 0,
      });
      continue;
    }

    // Buscar procedimiento que coincida con el tipo de hallazgo
    const nombresPosibles =
      MAPEO_HALLAZGO_PROCEDIMIENTO[hallazgo.tipoHallazgo] ?? [];

    const procedimientoEncontrado = procedimientosClinica.find((proc) =>
      nombresPosibles.some((nombre) =>
        proc.nombre.toLowerCase().includes(nombre.toLowerCase())
      )
    );

    if (procedimientoEncontrado) {
      items.push({
        numeroDiente: hallazgo.numeroDiente,
        cara: hallazgo.cara,
        tipoHallazgo: hallazgo.tipoHallazgo,
        procedimientoNombre: procedimientoEncontrado.nombre,
        procedimientoId: procedimientoEncontrado.id,
        precioUnitario: Number(procedimientoEncontrado.precio_base),
      });
    } else {
      // Precio por defecto si no se encuentra en la DB
      const preciosPorDefecto: Record<string, number> = {
        caries: 80,
        ausente: 350,
        sellante: 45,
      };
      items.push({
        numeroDiente: hallazgo.numeroDiente,
        cara: hallazgo.cara,
        tipoHallazgo: hallazgo.tipoHallazgo,
        procedimientoNombre: `${hallazgo.tipoHallazgo} (precio referencial)`,
        procedimientoId: "",
        precioUnitario: preciosPorDefecto[hallazgo.tipoHallazgo] ?? 0,
      });
    }
  }

  // Calcular totales
  const subtotal = items.reduce((acc, item) => acc + item.precioUnitario, 0);
  const igv = Number((subtotal * PORCENTAJE_IGV).toFixed(2));
  const total = Number((subtotal + igv).toFixed(2));

  return {
    items,
    subtotal,
    igv,
    total,
    porcentajeIgv: PORCENTAJE_IGV * 100,
  };
}

/**
 * calcularPresupuestoDesdeEstadoDental
 * ------------------------------------
 * Versión de conveniencia que extrae automáticamente los hallazgos
 * del estado dental completo del odontograma y calcula el presupuesto.
 */
export async function calcularPresupuestoDesdeEstadoDental(
  clinicaId: string,
  estadoDentalJson: Array<{
    numeroDiente: number;
    caras: Record<string, string | null>;
  }>
): Promise<ResultadoPresupuesto> {
  const hallazgos: HallazgoParaCalculo[] = [];

  for (const diente of estadoDentalJson) {
    for (const [cara, hallazgo] of Object.entries(diente.caras)) {
      if (hallazgo !== null) {
        hallazgos.push({
          numeroDiente: diente.numeroDiente,
          cara,
          tipoHallazgo: hallazgo,
        });
      }
    }
  }

  return calcularPresupuesto(clinicaId, hallazgos);
}
