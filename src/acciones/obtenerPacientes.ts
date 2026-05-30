"use server";

import { prisma } from "@/lib/prisma";

export async function obtenerPacientes() {
  try {
    const pacientes = await prisma.paciente.findMany({
      orderBy: {
        creado_en: "desc"
      }
    });

    return pacientes.map(p => ({
      id: p.id,
      dni: p.dni,
      nombres: p.nombres,
      apellidos: p.apellidos,
      fecha_nacimiento: p.fecha_nacimiento.toISOString(),
      celular: p.celular,
      historia_clinica_nro: p.historia_clinica_nro
    }));
  } catch (error) {
    console.error("Error al obtener pacientes:", error);
    return [];
  }
}

export async function eliminarPaciente(id: string) {
  try {
    // 1. Eliminar citas
    await prisma.cita.deleteMany({ where: { paciente_id: id } });

    // 2. Eliminar odontogramas
    await prisma.odontogramaRegistro.deleteMany({ where: { paciente_id: id } });

    // 3. Eliminar planes de tratamiento y sus detalles/pagos
    const planes = await prisma.planTratamiento.findMany({ where: { paciente_id: id } });
    for (const plan of planes) {
      await prisma.detalleTratamiento.deleteMany({ where: { plan_id: plan.id } });
      await prisma.pago.deleteMany({ where: { plan_id: plan.id } });
    }
    await prisma.planTratamiento.deleteMany({ where: { paciente_id: id } });

    // 4. Finalmente eliminar el paciente
    await prisma.paciente.delete({
      where: { id }
    });
    return { exito: true };
  } catch (error: any) {
    console.error("Error al eliminar paciente:", error);
    return { exito: false, mensaje: `No se pudo eliminar el paciente. Detalle: ${error.message}` };
  }
}
