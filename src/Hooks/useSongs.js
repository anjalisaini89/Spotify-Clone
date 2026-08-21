import { useEffect, useMemo, useState } from "react";
import { getSongs } from "../services/api";

export function useSongs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadSongs = async () => {
      try {
        setLoading(true);

        /*
         * For now we keep /songs.json.
         * Once Node.js is connected,
         * getSongs() will call /api/songs.
         */
        const response = await fetch("/songs.json");

        if (!response.ok) {
          throw new Error("Unable to load songs");
        }

        const data = await response.json();

        if (mounted) {
          const customSongs =
            JSON.parse(
              localStorage.getItem("customSongs")
            ) || [];

          setSongs([
            ...data,
            ...customSongs,
          ]);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadSongs();

    return () => {
      mounted = false;
    };
  }, []);

  const addSong = (song) => {
    setSongs((previous) => [
      ...previous,
      song,
    ]);
  };

  const removeSong = (id) => {
    setSongs((previous) =>
      previous.filter(
        (song) => song.id !== id
      )
    );
  };

  return {
    songs,
    setSongs,
    addSong,
    removeSong,
    loading,
    error,
  };
}