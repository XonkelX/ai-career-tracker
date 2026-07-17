import { describe, expect, it, vi } from "vitest";

import { createHealthHandler } from "./route";

describe("health route", () => {
  it("returns a cache-disabled success without connection details", async () => {
    const handler = createHealthHandler(
      vi.fn().mockResolvedValue({ status: "healthy", latencyMs: 12 }),
    );
    const response = await handler();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(await response.json()).toEqual({ status: "ok" });
  });

  it("returns a generic unavailable response when PostgreSQL is unreachable", async () => {
    const handler = createHealthHandler(
      vi.fn().mockResolvedValue({ status: "unhealthy", latencyMs: 12 }),
    );
    const response = await handler();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({ status: "unavailable" });
  });
});
