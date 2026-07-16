"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import type { RegistrationActionState } from "@/features/auth/registration-state";
import type { RegistrationInput } from "@/schemas/auth/registration";
import {
  GENERIC_REGISTRATION_ERROR,
  registerUser,
} from "@/server/auth/register-user";
import { registrationRateLimiter } from "@/server/auth/registration-rate-limit";

async function getRateLimitIdentifier(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];

  return (
    requestHeaders.get("x-real-ip")?.trim() ||
    forwardedFor?.trim() ||
    "unidentified-client"
  );
}

export async function registerUserAction(
  _previousState: RegistrationActionState,
  formData: FormData,
): Promise<RegistrationActionState> {
  const values = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  };
  const safeValues = {
    name: typeof values.name === "string" ? values.name.slice(0, 100) : "",
    email: typeof values.email === "string" ? values.email.slice(0, 254) : "",
  };
  const rateLimitIdentifier = await getRateLimitIdentifier();

  if (!(await registrationRateLimiter.consume(rateLimitIdentifier))) {
    return {
      status: "error",
      message: GENERIC_REGISTRATION_ERROR,
      values: safeValues,
    };
  }

  const result = await registerUser(values as RegistrationInput);

  if (!result.success) {
    return {
      status: "error",
      message: result.message,
      fieldErrors: result.fieldErrors,
      values: safeValues,
    };
  }

  redirect("/sign-in?registered=1");
}
