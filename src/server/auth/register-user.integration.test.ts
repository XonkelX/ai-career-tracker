import { Prisma } from "@/generated/prisma/client";
import { describe, expect, it, vi } from "vitest";

import {
  GENERIC_REGISTRATION_ERROR,
  registerUser,
  type RegistrationDependencies,
} from "./register-user";

const validInput = {
  name: "  Ada Lovelace  ",
  email: "  ADA@Example.COM  ",
  password: "SecurePassword1",
  passwordConfirmation: "SecurePassword1",
};

function createDependencies(): RegistrationDependencies {
  return {
    hashPassword: vi.fn().mockResolvedValue("$argon2id$stored-hash"),
    createUser: vi.fn().mockResolvedValue(undefined),
  };
}

describe("registerUser integration", () => {
  it("validates, normalizes, hashes, and persists only safe user fields", async () => {
    const dependencies = createDependencies();

    await expect(registerUser(validInput, dependencies)).resolves.toEqual({
      success: true,
    });
    expect(dependencies.hashPassword).toHaveBeenCalledWith("SecurePassword1");
    expect(dependencies.createUser).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      email: "ada@example.com",
      passwordHash: "$argon2id$stored-hash",
    });
    expect(dependencies.createUser).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: expect.anything() }),
    );
  });

  it("stops before hashing or persistence when server validation fails", async () => {
    const dependencies = createDependencies();

    const result = await registerUser(
      { ...validInput, email: "invalid" },
      dependencies,
    );

    expect(result).toMatchObject({ success: false });
    expect(dependencies.hashPassword).not.toHaveBeenCalled();
    expect(dependencies.createUser).not.toHaveBeenCalled();
  });

  it("uses a generic response for duplicate email addresses", async () => {
    const dependencies = createDependencies();
    dependencies.createUser = vi.fn().mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Unique constraint failed", {
        code: "P2002",
        clientVersion: "7.8.0",
      }),
    );

    await expect(registerUser(validInput, dependencies)).resolves.toEqual({
      success: false,
      message: GENERIC_REGISTRATION_ERROR,
    });
  });
});
