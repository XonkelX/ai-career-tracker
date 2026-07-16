import { createHash } from "node:crypto";

export interface RateLimiter {
  consume(identifier: string): Promise<boolean>;
}

interface RateLimitEntry {
  attempts: number;
  resetAt: number;
}

interface InMemoryRateLimiterOptions {
  limit?: number;
  windowMs?: number;
  now?: () => number;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();
  private readonly limit: number;
  private readonly windowMs: number;
  private readonly now: () => number;

  constructor({
    limit = 5,
    windowMs = 15 * 60 * 1_000,
    now = Date.now,
  }: InMemoryRateLimiterOptions = {}) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
  }

  async consume(identifier: string): Promise<boolean> {
    const now = this.now();
    const key = createHash("sha256").update(identifier).digest("hex");
    const current = this.entries.get(key);

    if (!current || current.resetAt <= now) {
      this.entries.set(key, { attempts: 1, resetAt: now + this.windowMs });
      this.removeExpiredEntries(now);
      return true;
    }

    if (current.attempts >= this.limit) return false;

    current.attempts += 1;
    return true;
  }

  private removeExpiredEntries(now: number): void {
    for (const [key, entry] of this.entries) {
      if (entry.resetAt <= now) this.entries.delete(key);
    }
  }
}

export function getClientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return (
    headers.get("x-real-ip")?.trim() || forwardedFor || "unidentified-client"
  );
}
