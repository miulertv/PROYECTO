"use server";

import { prisma } from "@/lib/prisma";
import {
  esqueBuscarPorDni,
  type EntradaBuscarPorDni,
} from "@/validaciones/odontograma";

// ===== Tipos de respuesta =====

/** Un registro de odontograma en el historial */
export interface RegistroOdontogramaHistorial {
  id: string;
  estadoDentalJson: unknown;
  fechaRegistro: string;
  odontologo: {
    id: string;
    correo: string;
  };
}

/** Un plan de tratamiento en el historial */
export interface PlanTratamientoHistorial {
  id: string;
  estado: string;
  montoTotal: number;
  montoPagado: number;
  fechaCreacion: string;
  detalles: {
    id: string;
    dienteNro: number | null;
    costoAplicado: number;
    estadoPago: boolean;
    procedimiento: {
      nombre: string;
      precioBase: number;
    };
  }[];
}

/** Datos del paciente encontrado */
export interface DatosPaciente {
  id: string;
  dni: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  celular: string | null;
  genero: string | null;
  historiaClinicaNro: string;
}

interface RespuestaExitosa {
  exito: true;
  paciente: DatosPaciente;
  odontogramas: RegistroOdontogramaHistorial[];
  planesTratamiento: PlanTratamientoHistorial[];
  totalRegistros: number;
}

interface RespuestaError {
  exito: false;
  mensaje: string;
  errores?: Record<string, string[]>;
}

export type RespuestaHistorial = RespuestaExitosa | RespuestaError;

/**
 * obtenerHistorialPaciente
 * -------------------------
 * Server Action de Next.js que:
 * 1. Valida el DNI con Zod (8 dígitos).
 * 2. Busca al paciente por su DNI.
 * 3. Recupera todos los odontogramas previos (ordenados por fecha descendente).
 * 4. Recupera todos los planes de tratamiento con sus detalles y procedimientos.
 *
 * @param entrada - { dni: string } con 8 dígitos
 * @returns Historial completo del paciente o error
 */
export async function obtenerHistorialPaciente(
  entrada: EntradaBuscarPorDni
): Promise<RespuestaHistorial> {
  // ─── 1. Validación con Zod ───
  const resultado = esqueBuscarPorDni.safeParse(entrada);

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
      mensaje: "Error de validación en el DNI.",
      errores: erroresFormateados,
    };
  }

  const { dni } = resultado.data;

  try {
    // ─── 2. Buscar paciente por DNI ───
    const paciente = await prisma.paciente.findUnique({
      where: { dni },
      select: {
        id: true,
        dni: true,
        nombres: true,
        apellidos: true,
        fecha_nacimiento: true,
        celular: true,
        genero: true,
        historia_clinica_nro: true,
      },
    });

    if (!paciente) {
      return {
        exito: false,
        mensaje: `No se encontró ningún paciente con DNI: ${dni}. Verifique el número e intente nuevamente.`,
      };
    }

    // ─── 3. Obtener odontogramas previos ───
    const odontogramasRaw = await prisma.odontogramaRegistro.findMany({
      where: { paciente_id: paciente.id },
      orderBy: { fecha_registro: "desc" },
      select: {
        id: true,
        estado_dental_json: true,
        fecha_registro: true,
        odontologo: {
          select: {
            id: true,
            correo: true,
          },
        },
      },
    });

    const odontogramas: RegistroOdontogramaHistorial[] = odontogramasRaw.map(
      (reg) => ({
        id: reg.id,
        estadoDentalJson: reg.estado_dental_json,
        fechaRegistro: reg.fecha_registro.toISOString(),
        odontologo: {
          id: reg.odontologo.id,
          correo: reg.odontologo.correo,
        },
      })
    );

    // ─── 4. Obtener planes de tratamiento con detalles ───
    const planesRaw = await prisma.planTratamiento.findMany({
      where: { paciente_id: paciente.id },
      orderBy: { fecha_creacion: "desc" },
      select: {
        id: true,
        estado: true,
        monto_total: true,
        monto_pagado: true,
        fecha_creacion: true,
        detalles_tratamiento: {
          select: {
            id: true,
            diente_nro: true,
            costo_aplicado: true,
            estado_pago: true,
            procedimiento: {
              select: {
                nombre: true,
                precio_base: true,
              },
            },
          },
        },
      },
    });

    const planesTratamiento: PlanTratamientoHistorial[] = planesRaw.map(
      (plan) => ({
        id: plan.id,
        estado: plan.estado,
        montoTotal: Number(plan.monto_total),
        montoPagado: Number(plan.monto_pagado),
        fechaCreacion: plan.fecha_creacion.toISOString(),
        detalles: plan.detalles_tratamiento.map((detalle) => ({
          id: detalle.id,
          dienteNro: detalle.diente_nro,
          costoAplicado: Number(detalle.costo_aplicado),
          estadoPago: detalle.estado_pago,
          procedimiento: {
            nombre: detalle.procedimiento.nombre,
            precioBase: Number(detalle.procedimiento.precio_base),
          },
        })),
      })
    );

    // ─── 5. Retornar historial completo ───
    return {
      exito: true,
      paciente: {
        id: paciente.id,
        dni: paciente.dni,
        nombres: paciente.nombres,
        apellidos: paciente.apellidos,
        fechaNacimiento: paciente.fecha_nacimiento.toISOString(),
        celular: paciente.celular,
        genero: paciente.genero,
        historiaClinicaNro: paciente.historia_clinica_nro,
      },
      odontogramas,
      planesTratamiento,
      totalRegistros: odontogramas.length,
    };
  } catch (error) {
    console.error("[obtenerHistorialPaciente] Error:", error);

    return {
      exito: false,
      mensaje:
        "Ocurrió un error inesperado al consultar el historial del paciente.",
    };
  }
}
