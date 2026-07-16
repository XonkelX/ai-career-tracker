import Credentials from "next-auth/providers/credentials";

import { authenticateUser } from "./authenticate-user";
import { loginRateLimiter } from "./login-rate-limit";
import { getClientIdentifier } from "./rate-limit";

export const credentialsProvider = Credentials({
  credentials: {
    email: { label: "Email address", type: "email" },
    password: { label: "Password", type: "password" },
  },
  authorize: async (credentials, request) => {
    if (
      !(await loginRateLimiter.consume(getClientIdentifier(request.headers)))
    ) {
      return null;
    }

    return authenticateUser({
      email: credentials.email,
      password: credentials.password,
    });
  },
});
