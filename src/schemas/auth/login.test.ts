import { describe, expect, it } from "vitest";

import { loginSchema } from "./login";

describe("loginSchema", () => {
  it("normalizes email addresses", () => {
    expect(
      loginSchema.parse({
        email: "  ADA@Example.COM  ",
        password: "SecurePassword1",
      }),
    ).toEqual({ email: "ada@example.com", password: "SecurePassword1" });
  });

  it("rejects invalid email and empty passwords", () => {
    const result = loginSchema.safeParse({ email: "invalid", password: "" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
      expect(result.error.flatten().fieldErrors.password).toContain(
        "Enter your password.",
      );
    }
  });
});
