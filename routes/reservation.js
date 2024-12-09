import express from "express";
import service from "../service/reservation.js";

const router = express.Router();

const codes = {
  internal: 500,
  notFound: 404,
  created: 201,
  ok: 200,
};

/**
 * read all reservations
 */
router.get("/", async (req, res) => {
  try {
    const reservations = await service.getAllReservations();
    res.json(reservations);
  } catch (error) {
    console.log(error);
    res.status(codes.internal).json({ error: error.message });
  }
});

/**
 * read reservation by id
 */
router.get("/:id", async (req, res) => {
  try {
    const reservation = await service.getReservationById(req.params.id);
    if (!reservation) {
      return res.status(codes.notFound).json({ error: "Reservation not found" });
    }
    res.json(reservation);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

/**
 * create reservation
 */
router.post("/", async (req, res) => {
  try {
    const newReservation = await service.createReservation(req.body);
    res.status(codes.created).json(newReservation);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

/**
 * update reservation
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedReservation = await service.updateReservation(req.params.id, req.body);
    if (!updatedReservation) {
      return res.status(codes.notFound).json({ error: "Reservation not found" });
    }
    res.json(updatedReservation);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

/**
 * delete reservation
 */
router.delete("/:id", async (req, res) => {
  try {
    const success = await service.deleteReservation(req.params.id);
    if (!success) {
      return res.status(codes.notFound).json({ error: "Reservation not found" });
    }
    res.status(codes.ok).json({ success: true });
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

export default router;
