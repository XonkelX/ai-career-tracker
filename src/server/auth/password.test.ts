import { verify } from "argon2";
import { describe, expect, it } from "vitest";

import { hashPassword, verifyPassword } from "./password";

describe("hashPassword", () => {
  it("creates a verifiable Argon2id hash without retaining plaintext", async () => {
    const password = "SecurePassword1";
    const passwordHash = await hashPassword(password);

    expect(passwordHash).toMatch(/^\$argon2id\$/);
    expect(passwordHash).not.toContain(password);
    await expect(verify(passwordHash, password)).resolves.toBe(true);
  });

  it("verifies matching passwords and rejects non-matching passwords", async () => {
    const passwordHash = await hashPassword("SecurePassword1");

    await expect(verifyPassword(passwordHash, "SecurePassword1")).resolves.toBe(
      true,
    );
    await expect(
      verifyPassword(passwordHash, "DifferentPassword1"),
    ).resolves.toBe(false);
  });
});
