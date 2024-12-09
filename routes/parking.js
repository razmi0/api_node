import express from "express";
import serviceParking from "../service/parking.js";
import serviceReservation from "../service/reservation.js";

const router = express.Router();

const codes = {
  internal: 500,
  notFound: 404,
  created: 201,
  ok: 200,
};

router.get("/", async (req, res) => {
  try {
    const parkings = await serviceParking.getAllParkings();
    res.json(parkings);
  } catch (error) {
    console.log(error);
    res.status(codes.internal).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const parking = await serviceParking.getParkingById(req.params.id);
    if (!parking) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    res.json(parking);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.get("/:id/reservations", async (req, res) => {
  try {
    const parking = await serviceParking.getParkingById(req.params.id);
    if (!parking) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    const reservationsIds = parking.reservation;
    console.log(reservationsIds);
    const reservations = await Promise.allSettled(
      reservationsIds.map((id) => serviceReservation.getReservationById(id))
    );
    const json = reservations.map((r) => (r.status === "rejected" ? { error: r.reason.message } : r.value));
    res.json(json);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newParking = await serviceParking.createParking(req.body);
    res.status(codes.created).json(newParking);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedParking = await serviceParking.updateParking(req.params.id, req.body);
    if (!updatedParking) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    res.json(updatedParking);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const success = await serviceParking.deleteParking(req.params.id);
    if (!success) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    res.status(codes.ok).json({ success: true });
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.delete("/:parking_id/reservations/:reservation_id", async (req, res) => {
  try {
    const parkingId = req.params.parking_id;
    const reservationId = req.params.reservation_id;
    const parking = await serviceParking.getParkingById(parkingId);
    const reservation = parking.reservation.find((id) => id == reservationId);
    if (!reservation) {
      return res.status(codes.notFound).json({ message: `No reservation ${reservationId} in parking ${parkingId}` });
    }
    const updatedParking = await serviceParking.updateParking(parkingId, {
      reservation: parking.reservation.filter((id) => id != reservationId),
    });
    if (updatedParking === null) {
      res.status(codes.internal).json({ success: false, message: "Internal error" });
    }
    res.json({ success: true, data: updatedParking });
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

export default router;
