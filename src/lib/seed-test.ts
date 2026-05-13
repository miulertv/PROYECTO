import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed de prueba...");

  // 1. Crear o buscar Clínica
  const clinica = await prisma.clinica.upsert({
    where: { ruc: "20123456789" },
    update: {},
    create: {
      nombre: "Clínica Dental DentalCare",
      ruc: "20123456789",
      direccion: "Av. Principal 123",
      suscripcion_activa: true,
    },
  });
  console.log("Clínica lista:", clinica.id);

  // 2. Crear o buscar Usuario (Odontólogo)
  const usuario = await prisma.usuario.upsert({
    where: { correo: "dr.perez@dentalcare.com" },
    update: {},
    create: {
      correo: "dr.perez@dentalcare.com",
      clave_hash: "dummy_hash", // En producción usar bcrypt
      rol: "ODONTOLOGO",
      clinica_id: clinica.id,
    },
  });
  console.log("Usuario listo:", usuario.id);

  // 3. Crear Paciente con el DNI solicitado por el usuario
  const paciente = await prisma.paciente.upsert({
    where: { dni: "41592870" },
    update: {},
    create: {
      dni: "41592870",
      nombres: "Juan Carlos",
      apellidos: "Pérez Gómez",
      fecha_nacimiento: new Date("1985-05-15"),
      celular: "987654321",
      genero: "Masculino",
      historia_clinica_nro: "HC-001",
      clinica_id: clinica.id,
    },
  });
  console.log("Paciente listo:", paciente.dni);

  console.log("Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
