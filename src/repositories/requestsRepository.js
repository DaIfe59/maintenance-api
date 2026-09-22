import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const dataDir = path.resolve("data");
const filePath = path.join(dataDir, "requests.json");

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

async function readRequests() {
  await ensureFile();

  const content = await readFile(filePath, "utf8");

  try {
    return JSON.parse(content);
  } catch {
    throw new Error("Файл заявок содержит некорректный JSON.");
  }
}

async function writeRequests(requests) {
  await ensureFile();

  await writeFile(
    filePath,
    JSON.stringify(requests, null, 2),
    "utf8"
  );
}

export async function findAll() {
  return readRequests();
}

export async function findById(id) {
  const requests = await readRequests();

  return requests.find((item) => item.id === id) || null;
}

export async function findByEquipmentId(equipmentId) {
  const requests = await readRequests();

  return requests.filter(
    (item) => item.equipmentId === equipmentId
  );
}

export async function create(item) {
  const requests = await readRequests();

  requests.push(item);

  await writeRequests(requests);

  return item;
}

export async function update(id, changes) {
  const requests = await readRequests();

  const index = requests.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  requests[index] = {
    ...requests[index],
    ...changes
  };

  await writeRequests(requests);

  return requests[index];
}

export async function remove(id) {
  const requests = await readRequests();

  const index = requests.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const [removed] = requests.splice(index, 1);

  await writeRequests(requests);

  return removed;
}