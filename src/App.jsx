import {
  FaHome,
  FaSearch,
  FaHeart,
  FaMusic,
  FaList,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import "./App.css";
import { useEffect, useRef, useState } from "react";

import Login from "./components/Login";
import MiniPlayer from "./components/MiniPlayer";

function App() {
  const audioRef = useRef(null);

  // ----------------------------
  // States
  // ----------------------------

  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  const [playing, setPlaying] = useState(false);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [favorites, setFavorites] = useState([]);

  const [recentSongs, setRecentSongs] = useState([]);

  const [playlists, setPlaylists] = useState([]);

  const [playlistName, setPlaylistName] = useState("");

  const [queue, setQueue] = useState([]);

  const [shuffle, setShuffle] = useState(false);

  const [progress, setProgress] = useState(0);

  const [volume, setVolume] = useState(1);

  const [theme, setTheme] = useState("dark");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activePage, setActivePage] = useState("home");

  const [playCount, setPlayCount] = useState({});

  const [totalListeningTime, setTotalListeningTime] = useState(0);

  const [djMessage, setDjMessage] =
    useState("🎧 Welcome to Vibely AI DJ");

  const [newSongTitle, setNewSongTitle] = useState("");

  const [newSongArtist, setNewSongArtist] = useState("");

  const [newSongCover, setNewSongCover] = useState("");

  const [newSongAudio, setNewSongAudio] = useState("");

  // ----------------------------
  // Theme
  // ----------------------------

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  // ----------------------------
  // Load Songs
  // ----------------------------

  useEffect(() => {
    fetch("/songs.json")
      .then((r) => r.json())
      .then((data) => {
        const customSongs =
          JSON.parse(
            localStorage.getItem("customSongs")
          ) || [];

        const allSongs = [...data, ...customSongs];

        setSongs(allSongs);

        setCurrentSong(allSongs[0]);
      });

    setFavorites(
      JSON.parse(localStorage.getItem("favorites")) || []
    );

    setRecentSongs(
      JSON.parse(localStorage.getItem("recentSongs")) || []
    );

    setPlaylists(
      JSON.parse(localStorage.getItem("playlists")) || []
    );

    setPlayCount(
      JSON.parse(localStorage.getItem("playCount")) || {}
    );

    setTotalListeningTime(
      Number(localStorage.getItem("listeningTime")) || 0
    );
  }, []);

  // ----------------------------
  // Save LocalStorage
  // ----------------------------

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      "recentSongs",
      JSON.stringify(recentSongs)
    );
  }, [recentSongs]);

  useEffect(() => {
    localStorage.setItem(
      "playlists",
      JSON.stringify(playlists)
    );
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem(
      "playCount",
      JSON.stringify(playCount)
    );
  }, [playCount]);

  // ----------------------------
  // Listening Time
  // ----------------------------

  useEffect(() => {
    let timer;

    if (playing) {
      timer = setInterval(() => {
        setTotalListeningTime((prev) => {
          const updated = prev + 1;

          localStorage.setItem(
            "listeningTime",
            updated
          );

          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [playing]);

  // ----------------------------
  // Music Controls
  // ----------------------------

  const playSong = () => {
    if (!audioRef.current) return;

    audioRef.current.play();

    setPlaying(true);

    setPlayCount((prev) => ({
      ...prev,
      [currentSong.id]:
        (prev[currentSong.id] || 0) + 1,
    }));
  };

  const pauseSong = () => {
    audioRef.current.pause();

    setPlaying(false);
  };

  const selectSong = (song) => {
    setCurrentSong(song);

    setRecentSongs((prev) =>
      [song, ...prev.filter((s) => s.id !== song.id)]
        .slice(0, 10)
    );

    const messages = [
      `🎵 Now playing ${song.title}`,
      `🔥 ${song.artist} is on fire`,
      `✨ Vibely recommends this track`,
      `🎧 Great choice!`,
      `🚀 Enjoy the vibes`,
    ];

    setDjMessage(
      messages[
        Math.floor(Math.random() * messages.length)
      ]
    );

    setTimeout(() => {
      audioRef.current.play();
      setPlaying(true);
    }, 100);
  };
  