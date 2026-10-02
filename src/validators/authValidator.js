import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Некорректный email.")
    .max(255, "Email слишком длинный."),

  password: z
    .string()
    .min(8, "Пароль должен содержать минимум 8 символов.")
    .max(128, "Пароль слишком длинный.")
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Некорректный email.")
    .max(255, "Email слишком длинный."),

  password: z
    .string()
    .min(1, "Пароль обязателен.")
    .max(128, "Пароль слишком длинный.")
});