import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const dataPath = path.join(dirname, "../data/parking.json");

export const readJson = async () => {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error reading JSON file");
  }
};

export const writeJson = async (data) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing JSON file");
  }
};
