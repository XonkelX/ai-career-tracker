import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(254, "Email address is too long.")
    .email("Enter a valid email address."),
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(128, "Password is too long."),
});

export type LoginInput = z.infer<typeof loginSchema>;
