import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* ================================
   MIDDLEWARE
================================ */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

/* ================================
   HEALTH CHECK
================================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vibely API is running 🎵",
  });
});

/* ================================
   TEST API
================================ */

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Vibely API",
  });
});

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(
    `🎵 Vibely server running on http://localhost:${PORT}`
  );
});