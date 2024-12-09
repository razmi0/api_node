import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const dataPath = path.join(dirname, "../data/parking.json");

export const readJson = async () => {
  const data = await fs.readFile(dataPath, "utf8");
  return JSON.parse(data);
};

export const writeJson = async (data) => {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
};
