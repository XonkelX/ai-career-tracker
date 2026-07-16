import { InMemoryRateLimiter, type RateLimiter } from "./rate-limit";

export type RegistrationRateLimiter = RateLimiter;

export class InMemoryRegistrationRateLimiter extends InMemoryRateLimiter {}

const globalForRegistrationRateLimit = globalThis as unknown as {
  registrationRateLimiter: RegistrationRateLimiter | undefined;
};

export const registrationRateLimiter =
  globalForRegistrationRateLimit.registrationRateLimiter ??
  new InMemoryRegistrationRateLimiter();

if (process.env.NODE_ENV !== "production") {
  globalForRegistrationRateLimit.registrationRateLimiter =
    registrationRateLimiter;
}
