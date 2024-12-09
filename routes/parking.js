import express from "express";
import service from "../service/parking.js";

const router = express.Router();

const codes = {
  internal: 500,
  notFound: 404,
  created: 201,
  ok: 200,
};

router.get("/", async (req, res) => {
  try {
    const parkings = await service.getAllParkings();
    res.json(parkings);
  } catch (error) {
    console.log(error);
    res.status(codes.internal).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const parking = await service.getParkingById(req.params.id);
    if (!parking) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    res.json(parking);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newParking = await service.createParking(req.body);
    res.status(codes.created).json(newParking);
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedParking = await service.updateParking(req.params.id, req.body);
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
    const success = await service.deleteParking(req.params.id);
    if (!success) {
      return res.status(codes.notFound).json({ error: "Parking not found" });
    }
    res.status(codes.ok).json({ success: true });
  } catch (error) {
    res.status(codes.internal).json({ error: error.message });
  }
});

export default router;
