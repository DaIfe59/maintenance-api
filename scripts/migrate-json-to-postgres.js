import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

import sequelize from "../src/config/database.js";
import {
  Site,
  Equipment,
  EquipmentPassport,
  MaintenanceRequest,
  RequestStatusHistory
} from "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, "../data");

async function readJson(fileName, fallback = []) {
  try {
    const filePath = path.join(dataDir, fileName);
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    return fallback;
  }
}

async function run() {
  const equipmentData = await readJson("equipment.json");
  const requestsData = await readJson("requests.json");

  const transaction = await sequelize.transaction();

  try {
    const equipmentMap = new Map();

    for (const item of equipmentData) {
      const latitude =
        item.location?.lat ??
        item.location?.latitude ??
        0;

      const longitude =
        item.location?.lon ??
        item.location?.longitude ??
        0;

      let site = await Site.findOne({
        where: {
          latitude,
          longitude
        },
        transaction
      });

      if (!site) {
        site = await Site.create(
          {
            id: randomUUID(),
            name: `Площадка ${latitude}, ${longitude}`,
            code: `MIGRATED-${latitude}-${longitude}`
              .replace(/[^A-Za-z0-9_.-]/g, "_"),
            region: "Не указан",
            latitude,
            longitude
          },
          { transaction }
        );
      }

      let equipment = await Equipment.findOne({
        where: {
          serialNumber: item.serialNumber
        },
        transaction
      });

      if (!equipment) {
        equipment = await Equipment.create(
          {
            id: item.id || randomUUID(),
            siteId: site.id,
            name: item.name,
            type: item.type,
            serialNumber: item.serialNumber,
            status: item.status || "operational",
            installedAt: item.installedAt || null
          },
          { transaction }
        );
      }

      equipmentMap.set(item.id, equipment);

      if (item.passport) {
        const existingPassport = await EquipmentPassport.findOne({
          where: {
            equipmentId: equipment.id
          },
          transaction
        });

        if (!existingPassport) {
          await EquipmentPassport.create(
            {
              id: randomUUID(),
              equipmentId: equipment.id,
              manufacturer:
                item.passport.manufacturer || "Не указан",
              model:
                item.passport.model || "Не указана",
              nominalPower:
                item.passport.nominalPower || 0,
              lastVerificationAt:
                item.passport.lastVerificationAt || null
            },
            { transaction }
          );
        }
      }
    }

    for (const item of requestsData) {
      const equipment = equipmentMap.get(item.equipmentId);

      if (!equipment) {
        continue;
      }

      let request = await MaintenanceRequest.findByPk(
        item.id,
        { transaction }
      );

      if (!request) {
        request = await MaintenanceRequest.create(
          {
            id: item.id || randomUUID(),
            equipmentId: equipment.id,
            title: item.title,
            description: item.description || "",
            priority: item.priority || "medium",
            status: item.status || "new",
            plannedAt: item.plannedAt || null,
            author: item.author || "migration"
          },
          { transaction }
        );
      }

      if (request.status !== "new") {
        const existingHistory = await RequestStatusHistory.findOne({
          where: {
            requestId: request.id,
            newStatus: request.status
          },
          transaction
        });

        if (!existingHistory) {
          await RequestStatusHistory.create(
            {
              id: randomUUID(),
              requestId: request.id,
              previousStatus: "new",
              newStatus: request.status,
              author: "migration",
              comment: "Перенос из Case 2",
              changedAt: request.createdAt
            },
            { transaction }
          );
        }
      }
    }

    await transaction.commit();

    console.log("JSON data migrated to PostgreSQL");
    console.log(`Equipment processed: ${equipmentData.length}`);
    console.log(`Requests processed: ${requestsData.length}`);
  } catch (error) {
    await transaction.rollback();

    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

run();