import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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