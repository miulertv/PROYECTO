"use server";

import { prisma } from "@/lib/prisma";
import { esqueCrearPaciente, type EntradaCrearPaciente } from "@/validaciones/paciente";
import { revalidatePath } from "next/cache";

interface RespuestaCrear {
  exito: true;
  mensaje: string;
  paciente: {
    id: string;
    dni: string;
    nombres: string;
    apellidos: string;
  };
}

interface RespuestaError {
  exito: false;
  mensaje: string;
  errores?: Record<string, string[]>;
}

export type RespuestaPaciente = RespuestaCrear | RespuestaError;

/**
 * crearPaciente
 * -------------
 * Server Action para registrar un nuevo paciente.
 */
export async function crearPaciente(
  entrada: EntradaCrearPaciente
): Promise<RespuestaPaciente> {
  // 1. Validar con Zod
  const resultado = esqueCrearPaciente.safeParse(entrada);

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
      mensaje: "Error de validación.",
      errores: erroresFormateados,
    };
  }

  const data = resultado.data;

  try {
    // 2. Verificar si el DNI ya existe
    const existeDni = await prisma.paciente.findUnique({
      where: { dni: data.dni },
    });

    if (existeDni) {
      return {
        exito: false,
        mensaje: `El DNI ${data.dni} ya está registrado.`,
      };
    }

    // 3. Verificar si el Nro de Historia Clínica ya existe
    const existeHC = await prisma.paciente.findUnique({
      where: { historia_clinica_nro: data.historiaClinicaNro },
    });

    if (existeHC) {
      return {
        exito: false,
        mensaje: `El Nro. de Historia Clínica ${data.historiaClinicaNro} ya está en uso.`,
      };
    }

    // 4. Crear paciente
    const nuevoPaciente = await prisma.paciente.create({
      data: {
        dni: data.dni,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fecha_nacimiento: new Date(data.fechaNacimiento),
        celular: data.celular,
        genero: data.genero,
        historia_clinica_nro: data.historiaClinicaNro,
        clinica_id: data.clinicaId,
      },
    });

    revalidatePath("/");

    return {
      exito: true,
      mensaje: "Paciente registrado exitosamente.",
      paciente: {
        id: nuevoPaciente.id,
        dni: nuevoPaciente.dni,
        nombres: nuevoPaciente.nombres,
        apellidos: nuevoPaciente.apellidos,
      },
    };
  } catch (error) {
    console.error("[crearPaciente] Error:", error);
    return {
      exito: false,
      mensaje: "Ocurrió un error inesperado al registrar el paciente.",
    };
  }
}
