interface DatabaseHealthClient {
  $queryRaw<T>(query: TemplateStringsArray): Promise<T>;
}

export type DatabaseHealth =
  | { status: "healthy"; latencyMs: number }
  | { status: "unhealthy"; latencyMs: number };

async function getDefaultDatabaseClient(): Promise<DatabaseHealthClient> {
  const { prisma } = await import("./client");

  return prisma;
}

/**
 * Runs a minimal read-only query without exposing connection details or raw
 * database errors to callers. A client can be injected for isolated tests.
 */
export async function checkDatabaseHealth(
  database?: DatabaseHealthClient,
  now: () => number = Date.now,
): Promise<DatabaseHealth> {
  const startedAt = now();

  try {
    const client = database ?? (await getDefaultDatabaseClient());
    await client.$queryRaw`SELECT 1`;

    return { status: "healthy", latencyMs: Math.max(0, now() - startedAt) };
  } catch {
    return { status: "unhealthy", latencyMs: Math.max(0, now() - startedAt) };
  }
}
