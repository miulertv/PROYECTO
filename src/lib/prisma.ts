import { PrismaClient } from "@prisma/client";

/**
 * Instancia global de PrismaClient.
 * En desarrollo, Next.js hace hot-reload frecuente y crearía múltiples
 * conexiones a la DB. Este patrón reutiliza la instancia existente.
 */

const globalParaPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalParaPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
