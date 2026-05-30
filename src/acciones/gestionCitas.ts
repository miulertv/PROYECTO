"use server";

import { prisma } from "@/lib/prisma";

export async function actualizarEstadoCita(id: string, nuevoEstado: string) {
  try {
    const cita = await prisma.cita.update({
      where: { id },
      data: { estado: nuevoEstado.toUpperCase() },
    });

    return { exito: true, cita };
  } catch (error) {
    console.error("Error al actualizar estado de cita:", error);
    return { exito: false, mensaje: "No se pudo actualizar el estado." };
  }
}

export async function guardarCita(datos: {
  pacienteId: string;
  fecha: string;
  hora: string;
  motivo: string;
  doctor: string;
  nota: string;
  clinicaId: string;
  odontologoId: string;
}) {
  try {
    console.log("Intentando guardar cita con datos:", datos);
    
    // Crear fecha manejándola como local para evitar desfases de zona horaria
    const [anio, mes, dia] = datos.fecha.split('-').map(Number);
    const [horas, minutos] = datos.hora.split(':').map(Number);
    
    const inicio = new Date(anio, mes - 1, dia, horas, minutos);
    const fin = new Date(inicio.getTime() + 30 * 60000); // +30 minutos

    const cita = await prisma.cita.create({
      data: {
        paciente_id: datos.pacienteId,
        clinica_id: datos.clinicaId,
        odontologo_id: datos.odontologoId,
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin,
        motivo: datos.motivo,
        doctor: datos.doctor,
        nota: datos.nota,
        estado: "CONFIRMADO"
      },
    });

    return { exito: true, cita };
  } catch (error: any) {
    console.error("ERROR DETALLADO AL GUARDAR CITA:", error);
    return { 
      exito: false, 
      mensaje: `No se pudo guardar la cita. Error: ${error.message || "Desconocido"}` 
    };
  }
}

export async function moverCita(id: string, nuevaFecha: string, nuevaHora: string) {
  try {
    const [anio, mes, dia] = nuevaFecha.split('-').map(Number);
    const [horas, minutos] = nuevaHora.split(':').map(Number);
    
    const inicio = new Date(anio, mes - 1, dia, horas, minutos);
    const fin = new Date(inicio.getTime() + 30 * 60000);

    const cita = await prisma.cita.update({
      where: { id },
      data: {
        fecha_hora_inicio: inicio,
        fecha_hora_fin: fin,
      },
    });

    return { exito: true, cita };
  } catch (error: any) {
    console.error("Error al mover cita:", error);
    return { exito: false, mensaje: "No se pudo mover la cita." };
  }
}
