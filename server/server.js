import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import songRoutes from "./routes/songRoutes.js";

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
   ROOT
================================ */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Vibely API is running 🎵",
  });
});

/* ================================
   API
================================ */

app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Vibely API",
  });
});

/* ================================
   SONG ROUTES
================================ */

app.use(
  "/api/songs",
  songRoutes
);

/* ================================
   404
================================ */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================================
   ERROR HANDLER
================================ */

app.use(
  (error, req, res, next) => {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);

/* ================================
   START SERVER
================================ */

app.listen(PORT, () => {
  console.log(
    `🎵 Vibely server running on http://localhost:${PORT}`
  );
});