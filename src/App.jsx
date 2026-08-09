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

  const createPlaylist = () => {
  if (!playlistName.trim()) {
    alert("Please enter a playlist name");
    return;
  }

  const newPlaylist = {
    id: Date.now(),
    name: playlistName.trim(),
    songs: [],
  };

  setPlaylists((prev) => [...prev, newPlaylist]);
  setPlaylistName("");
};

const deletePlaylist = (id) => {
  setPlaylists((prev) =>
    prev.filter((playlist) => playlist.id !== id)
  );
};

const addSong = () => {
  if (!newSongTitle.trim() || !newSongArtist.trim()) {
    alert("Please enter song title and artist");
    return;
  }

  const newSong = {
    id: Date.now(),
    title: newSongTitle.trim(),
    artist: newSongArtist.trim(),
    cover: newSongCover.trim() || "/covers/default.jpg",
    audio: newSongAudio.trim(),
    category: "Custom",
  };

  const existingCustomSongs =
    JSON.parse(localStorage.getItem("customSongs")) || [];

  const updatedCustomSongs = [
    ...existingCustomSongs,
    newSong,
  ];

  localStorage.setItem(
    "customSongs",
    JSON.stringify(updatedCustomSongs)
  );

  setSongs((prev) => [...prev, newSong]);

  setNewSongTitle("");
  setNewSongArtist("");
  setNewSongCover("");
  setNewSongAudio("");
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
    if (!currentSong)
    return <h1 style={{ color: "white", padding: 40 }}>Loading...</h1>;

  return (
    <>
      {/* Background Effects */}
      <div className="moon"></div>

      <div className="stars">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="fireflies">
        {[...Array(15)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <div className="petals">
        {[...Array(20)].map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

      <audio
        ref={audioRef}
        src={currentSong.audio}
        onEnded={nextSong}
        onTimeUpdate={handleProgress}
      />

      <div className="app">

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
          setActivePage={setActivePage}
          theme={theme}
          setTheme={setTheme}
        />

        <div className="main">

          <Login />

          {activePage === "home" && (
            <>
              <Dashboard
                totalListeningTime={totalListeningTime}
                favorites={favorites}
                playlists={playlists}
                playCount={playCount}
                mostPlayedSong={mostPlayedSong}
              />

              <Hero
                currentSong={currentSong}
                playing={playing}
                playSong={playSong}
              />

              <Search
                search={search}
                setSearch={setSearch}
              />

              <CategoryBar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />

              <SongList
                title="⭐ Featured Albums"
                songs={songs.slice(0, 6)}
                selectSong={selectSong}
              />

              <SongList
                title="🔥 Trending Now"
                songs={topSongs}
                selectSong={selectSong}
              />

              <SongList
                title="🕒 Recently Played"
                songs={recentSongs}
                selectSong={selectSong}
              />

              <SongList
                title="❤️ Favorites"
                songs={favorites}
                selectSong={selectSong}
              />

              <SongList
                title="🎵 All Songs"
                songs={filteredSongs}
                selectSong={selectSong}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                addToQueue={addToQueue}
              />

              <Playlist
                playlists={playlists}
                playlistName={playlistName}
                setPlaylistName={setPlaylistName}
                createPlaylist={createPlaylist}
                deletePlaylist={deletePlaylist}
              />

              <UploadSong
                newSongTitle={newSongTitle}
                setNewSongTitle={setNewSongTitle}
                newSongArtist={newSongArtist}
                setNewSongArtist={setNewSongArtist}
                newSongCover={newSongCover}
                setNewSongCover={setNewSongCover}
                newSongAudio={newSongAudio}
                setNewSongAudio={setNewSongAudio}
                addSong={addSong}
              />

              <AIDJ
    recommendedSongs={recommendedSongs}
    favorites={favorites}
    recentSongs={recentSongs}
    playCount={playCount}
    selectSong={selectSong}
/>
            </>
          )}

          {activePage === "search" && (
            <SongList
              title="🔍 Search Results"
              songs={filteredSongs}
              selectSong={selectSong}
            />
          )}

          {activePage === "favorites" && (
            <SongList
              title="❤️ Favorite Songs"
              songs={favorites}
              selectSong={selectSong}
            />
          )}

          {activePage === "library" && (
            <SongList
              title="🎵 Library"
              songs={songs}
              selectSong={selectSong}
            />
          )}

          {activePage === "playlists" && (
            <Playlist
              playlists={playlists}
              playlistName={playlistName}
              setPlaylistName={setPlaylistName}
              createPlaylist={createPlaylist}
              deletePlaylist={deletePlaylist}
            />
          )}

        </div>
      </div>

      <MiniPlayer
        currentSong={currentSong}
        playing={playing}
        playSong={playSong}
        pauseSong={pauseSong}
        prevSong={prevSong}
        nextSong={nextSong}
        progress={progress}
        setProgress={setProgress}
        audioRef={audioRef}
        volume={volume}
        setVolume={setVolume}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
      />
    </>
  );
}

export default App;