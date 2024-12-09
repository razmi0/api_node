import express from "express";
import routes from "./routes/parking.js";

const app = express();
const PORT = 4791;

app.use(express.json());

// Control middleware
app.get("/", (req, res, next) => {
  res.send("Hello World");
});

// Routes
app.use("/parkings", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something broke!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
