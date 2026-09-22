import { z } from "zod";

const isoDateTime = z
  .string()
  .datetime({
    offset: true,
    message: "Дата должна быть в формате ISO."
  });

const paginationSchema = {
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1),

  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(10),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("asc")
};

export const equipmentQuerySchema = z.object({
  status: z
    .enum([
      "operational",
      "maintenance",
      "fault",
      "decommissioned"
    ])
    .optional(),

  type: z
    .enum([
      "turbine",
      "inverter",
      "sensor",
      "substation"
    ])
    .optional(),

  installedFrom: isoDateTime.optional(),
  installedTo: isoDateTime.optional(),

  sortBy: z
    .enum([
      "name",
      "type",
      "serialNumber",
      "status",
      "installedAt"
    ])
    .default("name"),

  ...paginationSchema
});

export const requestsQuerySchema = z.object({
  status: z
    .enum([
      "new",
      "in_progress",
      "done",
      "rejected"
    ])
    .optional(),

  priority: z
    .enum([
      "low",
      "medium",
      "high",
      "critical"
    ])
    .optional(),

  equipmentId: z
    .string()
    .uuid("Некорректный UUID оборудования.")
    .optional(),

  createdFrom: isoDateTime.optional(),
  createdTo: isoDateTime.optional(),
  plannedFrom: isoDateTime.optional(),
  plannedTo: isoDateTime.optional(),

  sortBy: z
    .enum([
      "title",
      "priority",
      "status",
      "plannedAt",
      "createdAt",
      "updatedAt"
    ])
    .default("createdAt"),

  ...paginationSchema
});
