import type { LoginInput } from "@/schemas/auth/login";

interface CredentialsSignInOptions extends LoginInput {
  redirect: false;
  redirectTo: string;
}

type CredentialsSignIn = (
  provider: "credentials",
  options: CredentialsSignInOptions,
) => Promise<unknown>;

export async function createLoginSession(
  credentials: LoginInput,
  redirectTo: string,
  signIn: CredentialsSignIn,
): Promise<boolean> {
  try {
    await signIn("credentials", {
      ...credentials,
      redirect: false,
      redirectTo,
    });
    return true;
  } catch {
    return false;
  }
}
