import { describe, expect, it } from "vitest";

import { getClientIdentifier, InMemoryRateLimiter } from "./rate-limit";

describe("authentication rate-limit abstraction", () => {
  it("blocks attempts over the configured limit and resets after the window", async () => {
    let now = 0;
    const limiter = new InMemoryRateLimiter({
      limit: 2,
      windowMs: 100,
      now: () => now,
    });

    await expect(limiter.consume("client")).resolves.toBe(true);
    await expect(limiter.consume("client")).resolves.toBe(true);
    await expect(limiter.consume("client")).resolves.toBe(false);
    now = 101;
    await expect(limiter.consume("client")).resolves.toBe(true);
  });

  it("uses the trusted request boundary values in priority order", () => {
    expect(
      getClientIdentifier(
        new Headers({
          "x-real-ip": "192.0.2.1",
          "x-forwarded-for": "198.51.100.1, 198.51.100.2",
        }),
      ),
    ).toBe("192.0.2.1");
    expect(
      getClientIdentifier(
        new Headers({ "x-forwarded-for": "198.51.100.1, 198.51.100.2" }),
      ),
    ).toBe("198.51.100.1");
  });
});
