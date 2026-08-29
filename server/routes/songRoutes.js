import express from "express";
import multer from "multer";
import path from "path";

import {
  getSongs,
  getSong,
  uploadSong,
} from "../controllers/songController.js";

const router = express.Router();

/* =================================
   MULTER STORAGE
================================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "audio") {
      cb(null, "uploads/songs");
    } else if (file.fieldname === "cover") {
      cb(null, "uploads/covers");
    } else {
      cb(new Error("Invalid file field"));
    }
  },

  filename: (req, file, cb) => {
    const uniqueName =
      `${Date.now()}-${file.originalname}`;

    cb(
      null,
      uniqueName
    );
  },
});

const upload = multer({
  storage,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

/* =================================
   GET ALL SONGS
================================= */

router.get(
  "/",
  getSongs
);

/* =================================
   GET SINGLE SONG
================================= */

router.get(
  "/:id",
  getSong
);

/* =================================
   UPLOAD SONG
================================= */

router.post(
  "/",
  upload.fields([
    {
      name: "audio",
      maxCount: 1,
    },
    {
      name: "cover",
      maxCount: 1,
    },
  ]),
  uploadSong
);

export default router;