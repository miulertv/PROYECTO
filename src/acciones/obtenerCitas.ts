"use server";

import { prisma } from "@/lib/prisma";

export async function obtenerCitas() {
  try {
    const citas = await prisma.cita.findMany({
      include: {
        paciente: {
          select: {
            nombres: true,
            apellidos: true,
          }
        }
      },
      orderBy: {
        fecha_hora_inicio: "asc"
      }
    });

    return citas.map(c => ({
      id: c.id,
      pacienteNombre: `${c.paciente.nombres} ${c.paciente.apellidos}`,
      pacienteId: c.paciente_id,
      inicio: c.fecha_hora_inicio.toISOString(),
      fin: c.fecha_hora_fin.toISOString(),
      estado: c.estado,
      motivo: c.motivo || "",
      doctor: c.doctor || "",
      nota: c.nota || ""
    }));
  } catch (error) {
    console.error("Error al obtener citas:", error);
    return [];
  }
}
