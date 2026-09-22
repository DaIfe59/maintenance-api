import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.resolve("data");
const filePath = path.join(dataDir, "equipment.json");

async function ensureFile() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    await writeFile(filePath, "[]", "utf8");
  }
}

async function readEquipment() {
  await ensureFile();

  const content = await readFile(filePath, "utf8");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Файл оборудования содержит некорректный JSON.");
  }
}

async function writeEquipment(equipment) {
  await ensureFile();

  await writeFile(
    filePath,
    JSON.stringify(equipment, null, 2),
    "utf8"
  );
}

export async function findAll() {
  return readEquipment();
}

export async function findById(id) {
  const equipment = await readEquipment();

  return equipment.find((item) => item.id === id) || null;
}

export async function findBySerialNumber(serialNumber) {
  const equipment = await readEquipment();

  return (
    equipment.find(
      (item) => item.serialNumber === serialNumber
    ) || null
  );
}

export async function create(item) {
  const equipment = await readEquipment();

  equipment.push(item);

  await writeEquipment(equipment);

  return item;
}

export async function update(id, changes) {
  const equipment = await readEquipment();

  const index = equipment.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  equipment[index] = {
    ...equipment[index],
    ...changes
  };

  await writeEquipment(equipment);

  return equipment[index];
}

export async function remove(id) {
  const equipment = await readEquipment();

  const index = equipment.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = equipment.splice(index, 1);

  await writeEquipment(equipment);

  return removed;
}