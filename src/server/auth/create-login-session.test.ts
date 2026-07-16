import { describe, expect, it, vi } from "vitest";

import { createLoginSession } from "./create-login-session";

const credentials = { email: "user@example.com", password: "Password1" };

describe("createLoginSession", () => {
  it("creates a credentials session without requesting an Auth.js redirect", async () => {
    const signIn = vi.fn().mockResolvedValue(undefined);

    await expect(
      createLoginSession(credentials, "/dashboard", signIn),
    ).resolves.toBe(true);
    expect(signIn).toHaveBeenCalledWith("credentials", {
      ...credentials,
      redirect: false,
      redirectTo: "/dashboard",
    });
  });

  it("converts provider and infrastructure errors to a safe result", async () => {
    const signIn = vi.fn().mockRejectedValue(new Error("internal detail"));

    await expect(
      createLoginSession(credentials, "/dashboard", signIn),
    ).resolves.toBe(false);
  });
});
