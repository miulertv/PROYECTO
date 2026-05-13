"use server";

import { prisma } from "@/lib/prisma";
import {
  esqueGuardarOdontograma,
  type EntradaGuardarOdontograma,
} from "@/validaciones/odontograma";
import { calcularPresupuestoDesdeEstadoDental } from "./calcularPresupuesto";
import { Prisma } from "@prisma/client";

// ===== Tipos de respuesta =====

interface RespuestaExitosa {
  exito: true;
  mensaje: string;
  datos: {
    odontogramaId: string;
    planTratamientoId: string | null;
    montoTotal: number;
    montoConIgv: number;
  };
}

interface RespuestaError {
  exito: false;
  mensaje: string;
  errores?: Record<string, string[]>;
}

export type RespuestaGuardar = RespuestaExitosa | RespuestaError;

/**
 * guardarOdontograma
 * --------------------
 * Server Action de Next.js que:
 * 1. Valida la entrada con Zod (pacienteId, odontologoId, estadoDentalJson).
 * 2. Verifica que el paciente exista en la base de datos.
 * 3. Guarda el registro en la tabla OdontogramaRegistro (estado_dental_json como JSONB).
 * 4. Calcula el presupuesto con IGV (18%) usando los procedimientos de la clínica.
 * 5. Crea o actualiza el PlanTratamiento con los detalles correspondientes.
 *
 * Toda la operación se ejecuta dentro de una transacción para garantizar consistencia.
 */
export async function guardarOdontograma(
  entrada: EntradaGuardarOdontograma
): Promise<RespuestaGuardar> {
  // ─── 1. Validación con Zod ───
  const resultado = esqueGuardarOdontograma.safeParse(entrada);

  if (!resultado.success) {
    const erroresFormateados: Record<string, string[]> = {};
    for (const error of resultado.error.errors) {
      const campo = error.path.join(".");
      if (!erroresFormateados[campo]) {
        erroresFormateados[campo] = [];
      }
      erroresFormateados[campo].push(error.message);
    }

    return {
      exito: false,
      mensaje: "Error de validación. Revisa los campos ingresados.",
      errores: erroresFormateados,
    };
  }

  const { pacienteId, odontologoId, estadoDentalJson } = resultado.data;

  try {
    // ─── 2. Verificar que el paciente exista ───
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { id: pacienteId },
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        clinica_id: true,
      },
    });

    if (!pacienteExistente) {
      return {
        exito: false,
        mensaje: `No se encontró un paciente con el ID: ${pacienteId}. Verifique que el paciente esté registrado.`,
      };
    }

    // ─── 3. Verificar que el odontólogo exista ───
    const odontologoExistente = await prisma.usuario.findUnique({
      where: { id: odontologoId },
      select: { id: true, rol: true },
    });

    if (!odontologoExistente) {
      return {
        exito: false,
        mensaje: `No se encontró un odontólogo con el ID: ${odontologoId}.`,
      };
    }

    // ─── 4. Extraer hallazgos del estado dental ───
    const hallazgosConDatos: Array<{
      numeroDiente: number;
      cara: string;
      tipoHallazgo: string;
    }> = [];

    for (const diente of estadoDentalJson) {
      for (const [cara, hallazgo] of Object.entries(diente.caras)) {
        if (hallazgo !== null) {
          hallazgosConDatos.push({
            numeroDiente: diente.numeroDiente,
            cara,
            tipoHallazgo: hallazgo,
          });
        }
      }
    }

    // ─── 5. Calcular presupuesto con IGV ───
    const presupuesto = await calcularPresupuestoDesdeEstadoDental(
      pacienteExistente.clinica_id,
      estadoDentalJson.map((d) => ({
        numeroDiente: d.numeroDiente,
        caras: d.caras as Record<string, string | null>,
      }))
    );

    // ─── 6. Transacción: guardar todo atómicamente ───
    const resultadoTransaccion = await prisma.$transaction(async (tx) => {
      // 6a. Crear registro de odontograma
      const nuevoOdontograma = await tx.odontogramaRegistro.create({
        data: {
          paciente_id: pacienteId,
          odontologo_id: odontologoId,
          estado_dental_json: estadoDentalJson as unknown as Prisma.InputJsonValue,
        },
      });

      // 6b. Crear plan de tratamiento (si hay hallazgos con costo)
      let planTratamientoId: string | null = null;

      const itemsConCosto = presupuesto.items.filter(
        (item) => item.precioUnitario > 0
      );

      if (itemsConCosto.length > 0) {
        const nuevoPlan = await tx.planTratamiento.create({
          data: {
            paciente_id: pacienteId,
            estado: "PRESUPUESTO",
            monto_total: new Prisma.Decimal(presupuesto.total),
            monto_pagado: new Prisma.Decimal(0),
          },
        });

        planTratamientoId = nuevoPlan.id;

        // 6c. Crear detalles del tratamiento para cada hallazgo con procedimiento
        const detallesParaCrear = itemsConCosto
          .filter((item) => item.procedimientoId !== "")
          .map((item) => ({
            plan_id: nuevoPlan.id,
            procedimiento_id: item.procedimientoId,
            diente_nro: item.numeroDiente,
            costo_aplicado: new Prisma.Decimal(item.precioUnitario),
            estado_pago: false,
          }));

        if (detallesParaCrear.length > 0) {
          await tx.detalleTratamiento.createMany({
            data: detallesParaCrear,
          });
        }
      }

      return {
        odontogramaId: nuevoOdontograma.id,
        planTratamientoId,
      };
    });

    return {
      exito: true,
      mensaje: `Odontograma guardado exitosamente para ${pacienteExistente.nombres} ${pacienteExistente.apellidos}.`,
      datos: {
        odontogramaId: resultadoTransaccion.odontogramaId,
        planTratamientoId: resultadoTransaccion.planTratamientoId,
        montoTotal: presupuesto.subtotal,
        montoConIgv: presupuesto.total,
      },
    };
  } catch (error) {
    console.error("[guardarOdontograma] Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        exito: false,
        mensaje: `Error de base de datos: ${error.message}`,
      };
    }

    return {
      exito: false,
      mensaje: "Ocurrió un error inesperado al guardar el odontograma.",
    };
  }
}
