import { z } from "zod";

export const PASSWORD_REQUIREMENTS = [
  "At least 12 characters",
  "At least one uppercase letter",
  "At least one lowercase letter",
  "At least one number",
] as const;

const passwordSchema = z
  .string({ error: "Enter a password." })
  .min(12, PASSWORD_REQUIREMENTS[0])
  .max(128, "Password must be 128 characters or fewer.")
  .regex(/[A-Z]/, PASSWORD_REQUIREMENTS[1])
  .regex(/[a-z]/, PASSWORD_REQUIREMENTS[2])
  .regex(/[0-9]/, PASSWORD_REQUIREMENTS[3]);

export const registrationSchema = z
  .object({
    name: z
      .string({ error: "Enter your name." })
      .trim()
      .min(1, "Enter your name.")
      .max(100, "Name must be 100 characters or fewer."),
    email: z
      .string({ error: "Enter your email address." })
      .trim()
      .toLowerCase()
      .max(254, "Email address is too long.")
      .pipe(z.email("Enter a valid email address.")),
    password: passwordSchema,
    passwordConfirmation: z
      .string({ error: "Confirm your password." })
      .min(1, "Confirm your password.")
      .max(128, "Password confirmation must be 128 characters or fewer."),
  })
  .refine((values) => values.password === values.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });

export type RegistrationInput = z.input<typeof registrationSchema>;
export type ValidatedRegistrationInput = z.output<typeof registrationSchema>;
