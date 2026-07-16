import type { Session, User } from "next-auth";
import { describe, expect, it } from "vitest";

import { addTokenToSession, addUserToToken, authConfig } from "./config";

describe("authentication configuration", () => {
  it("uses a finite JWT session without a database adapter", () => {
    expect(authConfig.providers).toEqual([]);
    expect(authConfig.session).toEqual({
      strategy: "jwt",
      maxAge: 604_800,
    });
    expect(authConfig.useSecureCookies).toBe(
      process.env.NODE_ENV === "production",
    );
  });

  it("copies the user identifier and role into the JWT", () => {
    const user: User = {
      id: "user_123",
      name: "Taylor",
      email: "taylor@example.com",
      image: null,
      role: "USER",
    };

    expect(addUserToToken({ token: {}, user })).toMatchObject({
      userId: "user_123",
      role: "USER",
    });
  });

  it("exposes the JWT user identifier and role through the session", () => {
    const session = {
      expires: "2099-01-01T00:00:00.000Z",
      user: {
        name: "Taylor",
        email: "taylor@example.com",
        image: null,
      } as Session["user"],
    };

    expect(
      addTokenToSession({
        session,
        token: { userId: "user_123", role: "USER" },
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
