import { readParkingJson, writeParkingJson } from "../dao/filesystem.js";
import { buildId } from "../helper.js";

const getAllParkings = async () => await readParkingJson();

const getParkingById = async (id) => {
  const parkings = await getAllParkings();
  return parkings.find((parking) => parking.id === parseInt(id));
};

const createParking = async (parkingData) => {
  const parkings = await getAllParkings();
  const newId = buildId(parkings);
  const newParking = { ...parkingData, id: newId };
  parkings.push(newParking);
  await writeParkingJson(parkings);
  return newParking;
};

const updateParking = async (id, parkingData) => {
  const parkings = await getAllParkings();
  const index = parkings.findIndex((p) => p.id === parseInt(id));
  if (index === -1) return null;

  parkings[index] = { ...parkings[index], ...parkingData };
  await writeParkingJson(parkings);
  return parkings[index];
};

const deleteParking = async (id) => {
  const parkings = await getAllParkings();
  const filteredParkings = parkings.filter((p) => p.id !== parseInt(id));
  if (filteredParkings.length === parkings.length) return false;

  await writeParkingJson(filteredParkings);
  return true;
};

export default {
  getAllParkings,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,
};
