import { useState, useEffect, useRef } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Hero from "./components/Hero";
import Search from "./components/Search";
import CategoryBar from "./components/CategoryBar";
import SongList from "./components/SongList";
import Playlist from "./components/Playlist";
import UploadSong from "./components/UploadSong";
import AIDJ from "./components/AIDJ";
import MiniPlayer from "./components/MiniPlayer";
import Login from "./components/Login";

function App() {
  const audioRef = useRef(null);

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

  const [volume, setVolume] = useState(1);

  const [progress, setProgress] = useState(0);

  const [theme, setTheme] = useState("dark");

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activePage, setActivePage] = useState("home");

  const [playCount, setPlayCount] = useState({});

  const [totalListeningTime, setTotalListeningTime] = useState(0);

  const [djMessage, setDjMessage] = useState(
    "Welcome to Vibely DJ 🎧"
  );

  const [newSongTitle, setNewSongTitle] = useState("");

  const [newSongArtist, setNewSongArtist] = useState("");

  const [newSongCover, setNewSongCover] = useState("");

  const [newSongAudio, setNewSongAudio] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  useEffect(() => {
    fetch("/songs.json")
      .then((res) => res.json())
      .then((data) => {
        const customSongs =
          JSON.parse(localStorage.getItem("customSongs")) || [];

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
    useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("recentSongs", JSON.stringify(recentSongs));
  }, [recentSongs]);

  useEffect(() => {
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem("playCount", JSON.stringify(playCount));
  }, [playCount]);

  useEffect(() => {
    let timer;

    if (playing) {
      timer = setInterval(() => {
        setTotalListeningTime((prev) => {
          const updated = prev + 1;
          localStorage.setItem("listeningTime", updated);
          return updated;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [playing]);

  const playSong = () => {
    if (!audioRef.current || !currentSong) return;

    audioRef.current.play();
    setPlaying(true);

    setPlayCount((prev) => ({
      ...prev,
      [currentSong.id]: (prev[currentSong.id] || 0) + 1,
    }));
  };

  const pauseSong = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlaying(false);
  };

  const selectSong = (song) => {
    setCurrentSong(song);

    const messages = [
      `🎵 Now spinning ${song.title}!`,
      `🔥 ${song.artist} is trending in your library!`,
      `✨ Based on your taste this is a perfect pick!`,
      `🎧 Vibely AI recommends this track!`,
      `🚀 This song is climbing your charts!`,
    ];

    setDjMessage(
      messages[Math.floor(Math.random() * messages.length)]
    );

    setRecentSongs((prev) =>
      [song, ...prev.filter((s) => s.id !== song.id)].slice(0, 10)
    );

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setPlaying(true);
      }
    }, 100);
  };

  const nextSong = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      selectSong(next);
      return;
    }

    if (shuffle) {
      const random =
        songs[Math.floor(Math.random() * songs.length)];
      selectSong(random);
      return;
    }

    const index = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    selectSong(songs[(index + 1) % songs.length]);
  };

  const prevSong = () => {
    const index = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    selectSong(
      songs[(index - 1 + songs.length) % songs.length]
    );
  };

  const toggleFavorite = (song) => {
    setFavorites((prev) =>
      prev.some((fav) => fav.id === song.id)
        ? prev.filter((fav) => fav.id !== song.id)
        : [...prev, song]
    );
  };

  const addToQueue = (song) => {
    setQueue((prev) =>
      prev.some((s) => s.id === song.id)
        ? prev
        : [...prev, song]
    );
  };

  const filteredSongs = songs.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(search.toLowerCase()) ||
      song.artist.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      song.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const topSongs = [...songs]
    .sort(
      (a, b) =>
        (playCount[b.id] || 0) -
        (playCount[a.id] || 0)
    )
    .slice(0, 5);

  const recommendedSongs = songs.filter(
    (song) =>
      favorites.some(
        (fav) => fav.artist === song.artist
      ) &&
      !favorites.some(
        (fav) => fav.id === song.id
      )
  );

  const mostPlayedSong =
    topSongs.length > 0 ? topSongs[0] : null;

  const handleProgress = () => {
    if (!audioRef.current) return;

    setProgress(
      (audioRef.current.currentTime /
        audioRef.current.duration) *
        100
    );
  };
  