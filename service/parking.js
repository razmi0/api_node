import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { readJson, writeJson } from "../dao/filesystem.js";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const dataPath = path.join(dirname, "../data/parking.json");

const getAllParkings = async () => {
  const data = await fs.readFile(dataPath, "utf8");
  return JSON.parse(data);
};

const getParkingById = async (id) => {
  const parkings = await getAllParkings();
  return parkings.find((parking) => parking.id === parseInt(id));
};

const createParking = async (parkingData) => {
  const parkings = await getAllParkings();
  const newId = Math.max(...parkings.map((p) => p.id), 0) + 1;
  const newParking = { ...parkingData, id: newId };
  parkings.push(newParking);
  await fs.writeFile(dataPath, JSON.stringify(parkings, null, 2));
  return newParking;
};

const updateParking = async (id, parkingData) => {
  const parkings = await getAllParkings();
  const index = parkings.findIndex((p) => p.id === parseInt(id));
  if (index === -1) return null;

  parkings[index] = { ...parkings[index], ...parkingData };
  await fs.writeFile(dataPath, JSON.stringify(parkings, null, 2));
  return parkings[index];
};

const deleteParking = async (id) => {
  const parkings = await getAllParkings();
  const filteredParkings = parkings.filter((p) => p.id !== parseInt(id));
  if (filteredParkings.length === parkings.length) return false;

  await fs.writeFile(dataPath, JSON.stringify(filteredParkings, null, 2));
  return true;
};

export default {
  getAllParkings,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,
};
