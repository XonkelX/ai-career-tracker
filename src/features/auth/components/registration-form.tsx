"use client";

import { useActionState, useEffect, useRef } from "react";

import { registerUserAction } from "@/app/(auth)/sign-up/actions";
import { INITIAL_REGISTRATION_STATE } from "@/features/auth/registration-state";
import { PASSWORD_REQUIREMENTS } from "@/schemas/auth/registration";

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

const inputStyles =
  "mt-2 min-h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-base text-slate-100 shadow-sm outline-none transition placeholder:text-slate-500 hover:border-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 disabled:cursor-not-allowed disabled:opacity-60";

export function RegistrationForm() {
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    registerUserAction,
    INITIAL_REGISTRATION_STATE,
  );

  useEffect(() => {
    if (state.status === "error") {
      errorSummaryRef.current?.focus();
    }
  }, [state]);

  return (
    <form action={formAction} className="mt-8 space-y-5" noValidate>
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

      <div>
        <label className="text-sm font-medium text-slate-200" htmlFor="name">
          Name
        </label>
        <input
          aria-describedby={state.fieldErrors?.name ? "name-error" : undefined}
          aria-invalid={Boolean(state.fieldErrors?.name)}
          autoComplete="name"
          className={inputStyles}
          defaultValue={state.values?.name}
          disabled={isPending}
          id="name"
          maxLength={100}
          name="name"
          required
          type="text"
        />
        <FieldError errors={state.fieldErrors?.name} id="name-error" />
      </div>

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
          disabled={isPending}
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
            state.fieldErrors?.password
              ? "password-requirements password-error"
              : "password-requirements"
          }
          aria-invalid={Boolean(state.fieldErrors?.password)}
          autoComplete="new-password"
          className={inputStyles}
          disabled={isPending}
          id="password"
          maxLength={128}
          minLength={12}
          name="password"
          required
          type="password"
        />
        <div className="mt-3 text-sm text-slate-400" id="password-requirements">
          <p className="font-medium text-slate-300">
            Your password must include:
          </p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {PASSWORD_REQUIREMENTS.map((requirement) => (
              <li className="flex gap-2" key={requirement}>
                <span aria-hidden="true" className="text-cyan-300">
                  •
                </span>
                {requirement}
              </li>
            ))}
          </ul>
        </div>
        <FieldError errors={state.fieldErrors?.password} id="password-error" />
      </div>

      <div>
        <label
          className="text-sm font-medium text-slate-200"
          htmlFor="passwordConfirmation"
        >
          Confirm password
        </label>
        <input
          aria-describedby={
            state.fieldErrors?.passwordConfirmation
              ? "password-confirmation-error"
              : undefined
          }
          aria-invalid={Boolean(state.fieldErrors?.passwordConfirmation)}
          autoComplete="new-password"
          className={inputStyles}
          disabled={isPending}
          id="passwordConfirmation"
          maxLength={128}
          name="passwordConfirmation"
          required
          type="password"
        />
        <FieldError
          errors={state.fieldErrors?.passwordConfirmation}
          id="password-confirmation-error"
        />
      </div>

      <button
        className="min-h-11 w-full rounded-lg bg-cyan-300 px-4 py-2.5 font-semibold text-slate-950 shadow-sm transition hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>

      <p aria-live="polite" className="sr-only">
        {isPending ? "Creating your account." : ""}
      </p>
    </form>
  );
}
