import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const songsPath = path.join(
  __dirname,
  "../data/songs.json"
);

/* =================================
   GET ALL SONGS
================================= */

export async function getSongs(req, res) {
  try {
    const file = await fs.readFile(
      songsPath,
      "utf-8"
    );

    const songs = JSON.parse(file);

    res.json(songs);
  } catch (error) {
    console.error(
      "Failed to load songs:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load songs",
    });
  }
}

/* =================================
   GET SINGLE SONG
================================= */

export async function getSong(req, res) {
  try {
    const file = await fs.readFile(
      songsPath,
      "utf-8"
    );

    const songs = JSON.parse(file);

    const song = songs.find(
      (item) =>
        String(item.id) ===
        String(req.params.id)
    );

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    res.json(song);
  } catch (error) {
    console.error(
      "Failed to load song:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load song",
    });
  }
}

/* =================================
   UPLOAD SONG
================================= */

export async function uploadSong(req, res) {
  try {
    const {
      title,
      artist,
      category,
    } = req.body;

    /* =============================
       VALIDATION
    ============================= */

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Song title is required",
      });
    }

    if (!artist?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Artist is required",
      });
    }

    if (
      !req.files ||
      !req.files.audio ||
      !req.files.audio[0]
    ) {
      return res.status(400).json({
        success: false,
        message: "Audio file is required",
      });
    }

    /* =============================
       LOAD EXISTING SONGS
    ============================= */

    const file = await fs.readFile(
      songsPath,
      "utf-8"
    );

    const songs = JSON.parse(file);

    /* =============================
       FILES
    ============================= */

    const audioFile =
      req.files.audio[0];

    const coverFile =
      req.files.cover?.[0];

    /* =============================
       CREATE SONG
    ============================= */

    const newSong = {
      id: Date.now(),

      title: title.trim(),

      artist: artist.trim(),

      category:
        category?.trim() || "Custom",

      cover: coverFile
        ? `/uploads/covers/${coverFile.filename}`
        : "/covers/default.jpg",

      audio:
        `/uploads/songs/${audioFile.filename}`,
    };

    /* =============================
       SAVE SONG
    ============================= */

    songs.push(newSong);

    await fs.writeFile(
      songsPath,
      JSON.stringify(
        songs,
        null,
        2
      )
    );

    /* =============================
       RESPONSE
    ============================= */

    res.status(201).json({
      success: true,
      message: "Song uploaded successfully",
      song: newSong,
    });

  } catch (error) {
    console.error(
      "Failed to upload song:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to upload song",
    });
  }
}