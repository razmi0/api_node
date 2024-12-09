import { readReservationJson, writeReservationJson } from "../dao/filesystem.js";
import { buildId } from "../helper.js";

const getAllReservations = async () => await readReservationJson();

const getReservationById = async (id) => {
  const reservations = await getAllReservations();
  return reservations.find((reservation) => reservation.id === parseInt(id));
};

const createReservation = async (reservationData) => {
  const reservations = await getAllReservations();
  const newId = buildId(reservations);
  const newReservation = { ...reservationData, id: newId };
  reservations.push(newReservation);
  await writeReservationJson(reservations);
  return newReservation;
};

const updateReservation = async (id, reservationData) => {
  const reservations = await getAllReservations();
  const index = reservations.findIndex((p) => p.id === parseInt(id));
  if (index === -1) return null;

  reservations[index] = { ...reservations[index], ...reservationData };
  await writeReservationJson(reservations);
  return reservations[index];
};

const deleteReservation = async (id) => {
  const reservations = await getAllReservations();
  const filteredReservations = reservations.filter((p) => p.id !== parseInt(id));
  if (filteredReservations.length === reservations.length) return false;

  await writeReservationJson(filteredReservations);
  return true;
};

export default {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation,
};
