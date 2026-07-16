import { Prisma } from "@/generated/prisma/client";
import {
  registrationSchema,
  type RegistrationInput,
} from "@/schemas/auth/registration";

import { hashPassword } from "./password";

export const GENERIC_REGISTRATION_ERROR =
  "We could not create your account. Check your details or try again later.";

type RegistrationFieldErrors = Partial<
  Record<keyof RegistrationInput, string[]>
>;

export type RegistrationResult =
  | { success: true }
  | {
      success: false;
      message: string;
      fieldErrors?: RegistrationFieldErrors;
    };

interface NewUserRecord {
  name: string;
  email: string;
  passwordHash: string;
}

export interface RegistrationDependencies {
  createUser(user: NewUserRecord): Promise<void>;
  hashPassword(password: string): Promise<string>;
}

async function createUser(user: NewUserRecord): Promise<void> {
  const { prisma } = await import("@/server/db/client");

  await prisma.user.create({
    data: user,
    select: { id: true },
  });
}

const defaultDependencies: RegistrationDependencies = {
  createUser,
  hashPassword,
};

function isDuplicateEmailError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function registerUser(
  input: RegistrationInput,
  dependencies: RegistrationDependencies = defaultDependencies,
): Promise<RegistrationResult> {
  const validation = registrationSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      message: "Correct the highlighted fields and try again.",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validation.data;

  try {
    const passwordHash = await dependencies.hashPassword(password);

    await dependencies.createUser({ name, email, passwordHash });
    return { success: true };
  } catch (error) {
    // Duplicate email addresses and infrastructure failures intentionally share
    // the same client response to avoid disclosing account state.
    if (isDuplicateEmailError(error)) {
      return { success: false, message: GENERIC_REGISTRATION_ERROR };
    }

    return { success: false, message: GENERIC_REGISTRATION_ERROR };
  }
}
