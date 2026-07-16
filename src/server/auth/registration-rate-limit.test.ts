import { describe, expect, it } from "vitest";

import { InMemoryRegistrationRateLimiter } from "./registration-rate-limit";

describe("InMemoryRegistrationRateLimiter", () => {
  it("blocks attempts above the configured boundary", async () => {
    const limiter = new InMemoryRegistrationRateLimiter({
      limit: 2,
      windowMs: 1_000,
      now: () => 100,
    });

    await expect(limiter.consume("203.0.113.10")).resolves.toBe(true);
    await expect(limiter.consume("203.0.113.10")).resolves.toBe(true);
    await expect(limiter.consume("203.0.113.10")).resolves.toBe(false);
    await expect(limiter.consume("203.0.113.11")).resolves.toBe(true);
  });

  it("allows attempts after the window expires", async () => {
    let now = 100;
    const limiter = new InMemoryRegistrationRateLimiter({
      limit: 1,
      windowMs: 1_000,
      now: () => now,
    });

    await expect(limiter.consume("203.0.113.10")).resolves.toBe(true);
    await expect(limiter.consume("203.0.113.10")).resolves.toBe(false);

    now = 1_100;
    await expect(limiter.consume("203.0.113.10")).resolves.toBe(true);
  });
});
