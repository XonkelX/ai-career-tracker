import type { NextAuthConfig, Session } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

import { DEFAULT_USER_ROLE } from "./roles";

const THIRTY_DAYS_IN_SECONDS = 30 * 24 * 60 * 60;
const ONE_DAY_IN_SECONDS = 24 * 60 * 60;

interface SessionCallbackParameters {
  session: Session;
  user: AdapterUser;
}

export function addUserToSession({
  session,
  user,
}: SessionCallbackParameters): Session {
  session.user.id = user.id;
  session.user.role = user.role ?? DEFAULT_USER_ROLE;

  return session;
}

export const authConfig = {
  pages: {
    signIn: "/sign-in",
  },
  providers: [],
  session: {
    strategy: "database",
    maxAge: THIRTY_DAYS_IN_SECONDS,
    updateAge: ONE_DAY_IN_SECONDS,
  },
  callbacks: {
    authorized: ({ auth }) => Boolean(auth?.user),
    session: addUserToSession,
  },
} satisfies NextAuthConfig;
