import { describe, expect, it, vi } from "vitest";

import { authenticateUser } from "./authenticate-user";

const input = { email: " USER@Example.com ", password: "Password1" };

describe("authenticateUser", () => {
  it("returns a safe normalized user after password verification", async () => {
    const findUserByEmail = vi.fn().mockResolvedValue({
      id: "user_123",
      name: "Taylor",
      email: "user@example.com",
      image: null,
      role: "USER",
      passwordHash: "stored-hash",
    });
    const verifyPassword = vi.fn().mockResolvedValue(true);

    const user = await authenticateUser(input, {
      findUserByEmail,
      verifyPassword,
    });

    expect(findUserByEmail).toHaveBeenCalledWith("user@example.com");
    expect(verifyPassword).toHaveBeenCalledWith("stored-hash", "Password1");
    expect(user).toEqual({
      id: "user_123",
      name: "Taylor",
      email: "user@example.com",
      image: null,
      role: "USER",
    });
    expect(user).not.toHaveProperty("passwordHash");
  });

  it("performs a dummy verification when the account does not exist", async () => {
    const verifyPassword = vi.fn().mockResolvedValue(false);

    await expect(
      authenticateUser(input, {
        findUserByEmail: vi.fn().mockResolvedValue(null),
        verifyPassword,
      }),
    ).resolves.toBeNull();

    expect(verifyPassword).toHaveBeenCalledOnce();
    expect(verifyPassword.mock.calls[0]?.[0]).toMatch(/^\$argon2id\$/);
  });

  it("returns the same null result for bad passwords and infrastructure errors", async () => {
    const record = {
      id: "user_123",
      name: null,
      email: "user@example.com",
      image: null,
      role: "USER" as const,
      passwordHash: "stored-hash",
    };

    await expect(
      authenticateUser(input, {
        findUserByEmail: vi.fn().mockResolvedValue(record),
        verifyPassword: vi.fn().mockResolvedValue(false),
      }),
    ).resolves.toBeNull();
    await expect(
      authenticateUser(input, {
        findUserByEmail: vi.fn().mockRejectedValue(new Error("database down")),
        verifyPassword: vi.fn(),
      }),
    ).resolves.toBeNull();
  });
});
