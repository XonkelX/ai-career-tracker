import { InMemoryRateLimiter, type RateLimiter } from "./rate-limit";

const globalForLoginRateLimit = globalThis as unknown as {
  loginRateLimiter: RateLimiter | undefined;
};

export const loginRateLimiter =
  globalForLoginRateLimit.loginRateLimiter ??
  new InMemoryRateLimiter({ limit: 10, windowMs: 15 * 60 * 1_000 });

if (process.env.NODE_ENV !== "production") {
  globalForLoginRateLimit.loginRateLimiter = loginRateLimiter;
}
