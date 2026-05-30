"use server";

import { prisma } from "@/lib/prisma";
import { esqueCrearPaciente, type EntradaCrearPaciente } from "@/validaciones/paciente";
import { revalidatePath } from "next/cache";

export async function actualizarPaciente(
  id: string,
  entrada: EntradaCrearPaciente
) {
  const resultado = esqueCrearPaciente.safeParse(entrada);

  if (!resultado.success) {
    return { exito: false, mensaje: "Error de validación." };
  }

  const data = resultado.data;

  try {
    await prisma.paciente.update({
      where: { id },
      data: {
        dni: data.dni,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fecha_nacimiento: new Date(data.fechaNacimiento),
        celular: data.celular,
        genero: data.genero,
        historia_clinica_nro: data.historiaClinicaNro,
      },
    });

    revalidatePath("/pacientes");

    return { exito: true, mensaje: "Paciente actualizado correctamente." };
  } catch (error) {
    console.error("Error al actualizar paciente:", error);
    return { exito: false, mensaje: "No se pudo actualizar el paciente." };
  }
}
