import { z } from "zod";

const isoDateTime = z
  .string()
  .datetime({
    offset: true,
    message: "Дата должна быть в формате ISO."
  });

export const createRequestSchema = z.object({
  equipmentId: z
    .string()
    .uuid("Некорректный UUID оборудования."),

  title: z
    .string()
    .min(5, "Минимальная длина — 5 символов.")
    .max(120, "Максимальная длина — 120 символов."),

  description: z
    .string()
    .max(2000, "Максимальная длина — 2000 символов.")
    .optional(),

  priority: z.enum(
    ["low", "medium", "high", "critical"],
    {
      error: "Недопустимое значение приоритета."
    }
  ),

  plannedAt: isoDateTime.optional()
});

export const updateRequestSchema = z.object({
  title: z
    .string()
    .min(5, "Минимальная длина — 5 символов.")
    .max(120, "Максимальная длина — 120 символов.")
    .optional(),

  description: z
    .string()
    .max(2000, "Максимальная длина — 2000 символов.")
    .optional(),

  priority: z
    .enum(
      ["low", "medium", "high", "critical"],
      {
        error: "Недопустимое значение приоритета."
      }
    )
    .optional(),

  plannedAt: isoDateTime.optional()
});

export const statusSchema = z.object({
  status: z.enum(
    ["new", "in_progress", "done", "rejected"],
    {
      error: "Недопустимый статус."
    }
  )
});

export const requestIdSchema = z.object({
  id: z
    .string()
    .uuid("Некорректный UUID заявки.")
});
