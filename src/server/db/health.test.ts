import { describe, expect, it, vi } from "vitest";

import { checkDatabaseHealth } from "./health";

describe("checkDatabaseHealth", () => {
  it("reports a successful database query", async () => {
    const query = vi.fn().mockResolvedValue([{ result: 1 }]);
    const now = vi.fn().mockReturnValueOnce(100).mockReturnValueOnce(112);

    await expect(
      checkDatabaseHealth({ $queryRaw: query }, now),
    ).resolves.toEqual({ status: "healthy", latencyMs: 12 });
    expect(query).toHaveBeenCalledOnce();
    expect(query.mock.calls[0]?.[0].join("")).toBe("SELECT 1");
  });

  it("returns a safe unhealthy result when the query fails", async () => {
    const query = vi
      .fn()
      .mockRejectedValue(new Error("secret connection detail"));
    const now = vi.fn().mockReturnValueOnce(200).mockReturnValueOnce(205);

    await expect(
      checkDatabaseHealth({ $queryRaw: query }, now),
    ).resolves.toEqual({ status: "unhealthy", latencyMs: 5 });
  });
});
