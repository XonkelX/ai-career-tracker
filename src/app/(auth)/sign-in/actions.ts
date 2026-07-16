"use server";

import { signIn } from "@/auth";
import {
  GENERIC_LOGIN_ERROR,
  type LoginActionState,
} from "@/features/auth/login-state";
import { loginSchema } from "@/schemas/auth/login";
import { getSafeCallbackUrl } from "@/server/auth/callback-url";
import { createLoginSession } from "@/server/auth/create-login-session";

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const emailValue = formData.get("email");
  const values = {
    email: typeof emailValue === "string" ? emailValue.slice(0, 254) : "",
  };
  const validation = loginSchema.safeParse({
    email: emailValue,
    password: formData.get("password"),
  });

  if (!validation.success) {
    return {
      status: "error",
      message: "Correct the highlighted fields and try again.",
      fieldErrors: validation.error.flatten().fieldErrors,
      values,
    };
  }

  const redirectTo = getSafeCallbackUrl(formData.get("callbackUrl"));

  const sessionCreated = await createLoginSession(
    validation.data,
    redirectTo,
    signIn,
  );
  if (!sessionCreated) {
    return { status: "error", message: GENERIC_LOGIN_ERROR, values };
  }

  return {
    status: "success",
    message: "You are signed in. Redirecting to your dashboard.",
    redirectTo,
  };
}
