"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";

import { loginAction } from "@/app/(auth)/sign-in/actions";
import { INITIAL_LOGIN_STATE } from "@/features/auth/login-state";

const inputStyles =
  "mt-2 min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-base text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-60";

function FieldError({ errors, id }: { errors?: string[]; id: string }) {
  if (!errors?.length) return null;

  return (
    <div className="mt-2 text-sm text-rose-300" id={id}>
      {errors.map((error) => (
        <p key={error}>{error}</p>
      ))}
    </div>
  );
}

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const router = useRouter();
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_LOGIN_STATE,
  );

  useEffect(() => {
    if (state.status === "error") errorSummaryRef.current?.focus();
    if (state.status === "success" && state.redirectTo) {
      router.replace(state.redirectTo);
      router.refresh();
    }
  }, [router, state]);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
      <input name="callbackUrl" type="hidden" value={callbackUrl} />

      {state.status === "error" && state.message ? (
        <div
          className="rounded-lg border border-rose-400/40 bg-rose-400/10 px-4 py-3 text-sm text-rose-100"
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
        >
          {state.message}
        </div>
      ) : null}

      {state.status === "success" && state.message ? (
        <div
          className="rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100"
          role="status"
        >
          {state.message}
        </div>
      ) : null}

      <div>
        <label className="text-sm font-medium text-slate-200" htmlFor="email">
          Email address
        </label>
        <input
          aria-describedby={
            state.fieldErrors?.email ? "email-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.email)}
          autoCapitalize="none"
          autoComplete="email"
          className={inputStyles}
          defaultValue={state.values?.email}
          disabled={isPending || state.status === "success"}
          id="email"
          inputMode="email"
          maxLength={254}
          name="email"
          required
          spellCheck={false}
          type="email"
        />
        <FieldError errors={state.fieldErrors?.email} id="email-error" />
      </div>

      <div>
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="password"
        >
          Password
        </label>
        <input
          aria-describedby={
            state.fieldErrors?.password ? "password-error" : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
          autoComplete="current-password"
          className={inputStyles}
          disabled={isPending || state.status === "success"}
          id="password"
          maxLength={128}
          name="password"
          required
          type="password"
        />
        <FieldError errors={state.fieldErrors?.password} id="password-error" />
      </div>

      <button
        className="min-h-11 w-full rounded-lg bg-cyan-300 px-4 py-2.5 font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending || state.status === "success"}
        type="submit"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Signing you in." : ""}
      </p>
    </form>
  );
}
