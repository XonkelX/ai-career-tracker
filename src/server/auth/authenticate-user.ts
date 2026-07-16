import type { UserRole } from "@/generated/prisma/client";
import { loginSchema } from "@/schemas/auth/login";

import { verifyPassword } from "./password";

const DUMMY_PASSWORD_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$JznT1aTlkL2VunhNKgls0g$Y69eyWKptI+1R0ABJ/yCWAYgM+qyUlEMXn4FzZxrKmE";

interface LoginUserRecord {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
  passwordHash: string | null;
}

export interface AuthenticatedUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: UserRole;
}

export interface AuthenticationDependencies {
  findUserByEmail(email: string): Promise<LoginUserRecord | null>;
  verifyPassword(passwordHash: string, password: string): Promise<boolean>;
}

async function findUserByEmail(email: string): Promise<LoginUserRecord | null> {
  const { prisma } = await import("@/server/db/client");

  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      passwordHash: true,
    },
  });
}

const defaultDependencies: AuthenticationDependencies = {
  findUserByEmail,
  verifyPassword,
};

export async function authenticateUser(
  input: unknown,
  dependencies: AuthenticationDependencies = defaultDependencies,
): Promise<AuthenticatedUser | null> {
  const validation = loginSchema.safeParse(input);
  if (!validation.success) return null;

  try {
    const { email, password } = validation.data;
    const user = await dependencies.findUserByEmail(email);
    const passwordMatches = await dependencies.verifyPassword(
      user?.passwordHash ?? DUMMY_PASSWORD_HASH,
      password,
    );

    if (!user?.passwordHash || !passwordMatches) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      role: user.role,
    };
  } catch {
    return null;
  }
}
