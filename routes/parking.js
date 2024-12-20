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
  console.log("GET /parkings");
  try {
    const parkings = await serviceParking.getAllParkings();
    res.json(parkings);
  } catch (error) {
    console.log(error);
    res.status(codes.internal).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  console.log("GET /parkings/:id");
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
  console.log("GET /parkings/:id/reservations");
  try {
    const parking = await serviceParking.getParkingById(req.params.id);
    if (!parking) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    const reservationsIds = parking.reservation;
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
  console.log("POST /parkings");
  try {
    const newParking = await serviceParking.createParking(req.body);
    res.status(codes.created).json(newParking);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.post("/:id/reservations/:optional_reservation_id", async (req, res) => {
  console.log("POST /parkings/:id/reservations/:optional_reservation_id");
  try {
    // Créer une réservation d’une place dans un parking(parking identifié par son id)
    const parking = await serviceParking.getParkingById(req.params.id);
    // Client data can provide an id for the reservation or not
    // If provided, it can be provided inside the body or as a parameter
    // The parameter has priority over the body
    const reservationId = parseInt(req.params.optional_reservation_id, 10) ? req.body.id : null;
    if (!parking) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    const newReservation = await serviceReservation.createReservation(req.body, reservationId ? reservationId : null);
    const updatedParking = await serviceParking.updateParking(req.params.id, {
      reservation: [...parking.reservation, newReservation.id],
    });
    if (updatedParking === null) {
      res.status(codes.internal).json({ success: false, message: "Internal error" });
    }
    res.status(codes.created).json({ success: true, data: { parking: updatedParking, reservation: req.body } });
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  console.log("PUT /parkings/:id");
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
  console.log("DELETE /parkings/:id");
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
  console.log("DELETE /parkings/:parking_id/reservations/:reservation_id");
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
