import type { NextAuthConfig, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

import { DEFAULT_USER_ROLE } from "./roles";

const SEVEN_DAYS_IN_SECONDS = 7 * 24 * 60 * 60;

interface JwtCallbackParameters {
  token: JWT;
  user?: User;
}

interface SessionCallbackParameters {
  session: Session;
  token: JWT;
}

export function addUserToToken({ token, user }: JwtCallbackParameters): JWT {
  if (user) {
    if (!user.id) {
      throw new Error("Authenticated user is missing an identifier.");
    }

    token.userId = user.id;
    token.role = user.role ?? DEFAULT_USER_ROLE;
  }

  return token;
}

export function addTokenToSession({
  session,
  token,
}: SessionCallbackParameters): Session {
  if (!token.userId) {
    throw new Error("Authenticated token is missing a user identifier.");
  }

  session.user.id = token.userId;
  session.user.role =
    token.role === DEFAULT_USER_ROLE ? token.role : DEFAULT_USER_ROLE;

  return session;
}

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: SEVEN_DAYS_IN_SECONDS,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  callbacks: {
    authorized: ({ auth }) => Boolean(auth?.user),
    jwt: addUserToToken,
    session: addTokenToSession,
  },
} satisfies NextAuthConfig;
