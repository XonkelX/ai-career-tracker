import type { LoginInput } from "@/schemas/auth/login";

export const GENERIC_LOGIN_ERROR =
  "Email or password is incorrect. Please try again.";

export interface LoginActionState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Partial<Record<keyof LoginInput, string[]>>;
  values?: { email: string };
  redirectTo?: string;
}

export const INITIAL_LOGIN_STATE: LoginActionState = { status: "idle" };
