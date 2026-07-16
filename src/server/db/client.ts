import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "@/generated/prisma/client";
import { getDatabaseEnvironment } from "@/server/env/database";

function createPrismaClient(): PrismaClient {
  const { DATABASE_URL } = getDatabaseEnvironment();
  const adapter = new PrismaPg({ connectionString: DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
