import type { RegistrationInput } from "@/schemas/auth/registration";

export interface RegistrationActionState {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Partial<Record<keyof RegistrationInput, string[]>>;
  values?: { name: string; email: string };
}

export const INITIAL_REGISTRATION_STATE: RegistrationActionState = {
  status: "idle",
};
