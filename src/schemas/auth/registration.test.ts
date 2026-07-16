import { describe, expect, it } from "vitest";

import { registrationSchema } from "./registration";

const validRegistration = {
  name: "  Ada Lovelace  ",
  email: "  ADA@Example.COM  ",
  password: "SecurePassword1",
  passwordConfirmation: "SecurePassword1",
};

describe("registrationSchema", () => {
  it("normalizes names and email addresses", () => {
    expect(registrationSchema.parse(validRegistration)).toMatchObject({
      name: "Ada Lovelace",
      email: "ada@example.com",
    });
  });

  it.each([
    ["too short", "Short1A"],
    ["missing uppercase", "securepassword1"],
    ["missing lowercase", "SECUREPASSWORD1"],
    ["missing number", "SecurePassword"],
  ])("rejects passwords that are %s", (_, password) => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      password,
      passwordConfirmation: password,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a mismatched password confirmation", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      passwordConfirmation: "DifferentPassword1",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.passwordConfirmation).toContain(
        "Passwords do not match.",
      );
    }
  });

  it("requires password confirmation independently", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      passwordConfirmation: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.passwordConfirmation).toContain(
        "Confirm your password.",
      );
    }
  });
});
