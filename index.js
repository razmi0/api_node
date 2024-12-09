import express from "express";
import parkingRoutes from "./routes/parking.js";
import reservationRoutes from "./routes/reservation.js";

const app = express();
const PORT = 4791;

app.use(express.json());

// Control middleware
app.get("/", (req, res, next) => {
  res.send("Server running");
});

app.use("/parkings", parkingRoutes); // parking routes
app.use("/reservations", reservationRoutes); // reservation routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} : http://localhost:${PORT}`);
});
