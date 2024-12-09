import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const parkingPath = path.join(dirname, "../data/parking.json");
const reservationPath = path.join(dirname, "../data/reservation.json");

// PARKING
// --
export const readParkingJson = async () => {
  try {
    const data = await fs.readFile(parkingPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error reading JSON file");
  }
};

export const writeParkingJson = async (data) => {
  try {
    await fs.writeFile(parkingPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing JSON file");
  }
};

// RESERVATION
// --
export const readReservationJson = async () => {
  try {
    const data = await fs.readFile(reservationPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    throw new Error("Error reading JSON file");
  }
};

export const writeReservationJson = async (data) => {
  try {
    await fs.writeFile(reservationPath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error("Error writing JSON file");
  }
};
