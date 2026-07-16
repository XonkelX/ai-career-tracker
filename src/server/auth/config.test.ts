import type { AdapterUser } from "next-auth/adapters";
import type { Session } from "next-auth";
import { describe, expect, it } from "vitest";

import { addUserToSession, authConfig } from "./config";

describe("authentication configuration", () => {
  it("uses persistent database sessions without authentication providers", () => {
    expect(authConfig.providers).toEqual([]);
    expect(authConfig.session).toEqual({
      strategy: "database",
      maxAge: 2_592_000,
      updateAge: 86_400,
    });
  });

  it("adds the user id and placeholder role to a session", () => {
    const user: AdapterUser = {
      id: "user_123",
      name: "Taylor",
      email: "taylor@example.com",
      emailVerified: null,
      image: null,
      role: "USER",
    };

    expect(
      addUserToSession({
        session: {
          expires: "2099-01-01T00:00:00.000Z",
          user: {
            name: user.name,
            email: user.email,
            image: user.image,
          } as Session["user"],
        },
        user,
      }),
    ).toMatchObject({
      user: { id: "user_123", role: "USER" },
    });
  });

  it("authorizes only requests with an authenticated session", async () => {
    const authorized = authConfig.callbacks.authorized;

    expect(await authorized({ auth: null, request: {} as never })).toBe(false);
    expect(
      await authorized({
        auth: {
          expires: "2099-01-01T00:00:00.000Z",
          user: {
            id: "user_123",
            role: "USER",
            name: "Taylor",
            email: "taylor@example.com",
            image: null,
          },
        },
        request: {} as never,
      }),
    ).toBe(true);
  });
});
