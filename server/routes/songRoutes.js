import express from "express";

import {
  getSongs,
  getSong,
} from "../controllers/songController.js";

const router = express.Router();

/* GET /api/songs */

router.get("/", getSongs);

/* GET /api/songs/:id */

router.get("/:id", getSong);

export default router;