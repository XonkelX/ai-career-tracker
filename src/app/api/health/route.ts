import { checkDatabaseHealth } from "@/server/db/health";

type HealthCheck = typeof checkDatabaseHealth;

export function createHealthHandler(check: HealthCheck = checkDatabaseHealth) {
  return async function GET() {
    const health = await check();
    const available = health.status === "healthy";

    return Response.json(
      { status: available ? "ok" : "unavailable" },
      {
        headers: { "Cache-Control": "no-store" },
        status: available ? 200 : 503,
      },
    );
  };
}

export const GET = createHealthHandler();
