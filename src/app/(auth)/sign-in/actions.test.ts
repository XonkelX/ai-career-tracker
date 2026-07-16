import { beforeEach, describe, expect, it, vi } from "vitest";

const { signIn } = vi.hoisted(() => ({ signIn: vi.fn() }));

vi.mock("@/auth", () => ({ signIn }));

import { INITIAL_LOGIN_STATE } from "@/features/auth/login-state";

import { loginAction } from "./actions";

function formData(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

describe("loginAction", () => {
  beforeEach(() => signIn.mockReset());

  it("validates input before invoking Auth.js", async () => {
    const result = await loginAction(
      INITIAL_LOGIN_STATE,
      formData({ email: "not-an-email", password: "" }),
    );

    expect(result.status).toBe("error");
    expect(result.fieldErrors?.email).toBeDefined();
    expect(result.fieldErrors?.password).toBeDefined();
    expect(signIn).not.toHaveBeenCalled();
  });

  it("normalizes credentials and accepts a safe internal callback", async () => {
    signIn.mockResolvedValue(undefined);

    const result = await loginAction(
      INITIAL_LOGIN_STATE,
      formData({
        email: " USER@Example.com ",
        password: "Password1",
        callbackUrl: "/applications",
      }),
    );

    expect(signIn).toHaveBeenCalledWith("credentials", {
      email: "user@example.com",
      password: "Password1",
      redirect: false,
      redirectTo: "/applications",
    });
    expect(result).toMatchObject({
      status: "success",
      redirectTo: "/applications",
    });
  });

  it("rejects external callbacks", async () => {
    signIn.mockResolvedValue(undefined);

    const result = await loginAction(
      INITIAL_LOGIN_STATE,
      formData({
        email: "user@example.com",
        password: "Password1",
        callbackUrl: "https://attacker.example",
      }),
    );

    expect(signIn).toHaveBeenCalledWith(
      "credentials",
      expect.objectContaining({ redirectTo: "/dashboard" }),
    );
    expect(result).toMatchObject({
      status: "success",
      redirectTo: "/dashboard",
    });
  });
});
