import { z } from "zod";

const equipmentType = z.enum([
  "turbine",
  "inverter",
  "sensor",
  "substation"
]);

const equipmentStatus = z.enum([
  "operational",
  "maintenance",
  "fault",
  "decommissioned"
]);

const isoDate = z
  .string()
  .datetime({
    offset: true,
    message: "Дата должна быть в формате ISO."
  })
  .refine(
    (value) => new Date(value) <= new Date(),
    "Дата не может быть в будущем."
  );

const locationSchema = z.object({
  lat: z
    .number()
    .min(-90, "Широта должна быть от -90 до 90.")
    .max(90, "Широта должна быть от -90 до 90."),

  lon: z
    .number()
    .min(-180, "Долгота должна быть от -180 до 180.")
    .max(180, "Долгота должна быть от -180 до 180.")
});

export const createEquipmentSchema = z.object({
  name: z
    .string()
    .min(3, "Минимальная длина — 3 символа.")
    .max(100, "Максимальная длина — 100 символов."),

  type: equipmentType,

  serialNumber: z.string(),

  location: locationSchema,

  status: equipmentStatus.default("operational"),

  installedAt: isoDate
});

export const updateEquipmentSchema =
  createEquipmentSchema.partial();

export const equipmentIdSchema = z.object({
  id: z
    .string()
    .uuid("Некорректный UUID оборудования.")
});
