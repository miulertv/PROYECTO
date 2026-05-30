"use server";

import { prisma } from "@/lib/prisma";

export async function buscarPacientes(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const pacientes = await prisma.paciente.findMany({
      where: {
        OR: [
          { nombres: { contains: query, mode: "insensitive" } },
          { apellidos: { contains: query, mode: "insensitive" } },
          { dni: { contains: query } },
        ],
      },
      select: {
        id: true,
        dni: true,
        nombres: true,
        apellidos: true,
      },
      take: 10,
    });

    return pacientes;
  } catch (error) {
    console.error("Error al buscar pacientes:", error);
    return [];
  }
}
