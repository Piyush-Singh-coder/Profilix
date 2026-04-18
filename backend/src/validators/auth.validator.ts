import { z } from "zod";

const usernameRegex = /^[a-zA-Z][a-zA-Z0-9-]{2,29}$/;

const RESERVED_USERNAMES = [
  "admin", "api", "settings", "login", "register", "logout",
  "u", "og", "qr", "profile", "dashboard", "verify", "devdeck",
];

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters")
    .trim(),
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  username: z
    .string()
    .regex(
      usernameRegex,
      "Username must be 3–30 characters, start with a letter, and contain only letters, numbers, or hyphens"
    )
    .toLowerCase()
    .refine((val) => !RESERVED_USERNAMES.includes(val), {
      message: "This username is reserved. Please choose another.",
    }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be at most 72 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export const oauthSchema = z.object({
  idToken: z.string().min(1, "Firebase ID token is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OAuthInput = z.infer<typeof oauthSchema>;
