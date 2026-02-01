/**
 * Prisma Client Singleton
 * Evita múltiples instancias de PrismaClient en Next.js
 * Best practice para development y production
 */

import { PrismaClient } from "@prisma/client";

type GlobalWithPrisma = Global & {
  prisma: PrismaClient | undefined;
};

const globalForPrisma = globalThis as unknown as GlobalWithPrisma;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production")
  globalForPrisma.prisma = prisma;

export default prisma;
