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

  /* =========================
     SONG STATE
  ========================= */

  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playing, setPlaying] = useState(false);

  /* =========================
     SEARCH / CATEGORY
  ========================= */

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  /* =========================
     USER DATA
  ========================= */

  const [favorites, setFavorites] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");

  /* =========================
     PLAYER
  ========================= */

  const [queue, setQueue] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);

  /* =========================
     UI
  ========================= */

  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  /* =========================
     STATISTICS
  ========================= */

  const [playCount, setPlayCount] = useState({});
  const [totalListeningTime, setTotalListeningTime] = useState(0);

  /* =========================
     UPLOAD SONG
  ========================= */

  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongCover, setNewSongCover] = useState("");
  const [newSongAudio, setNewSongAudio] = useState("");

  /* =========================
     THEME
  ========================= */

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* =========================
     LOAD SONGS + USER DATA
  ========================= */

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/songs.json");

        if (!response.ok) {
          throw new Error("songs.json could not be loaded");
        }

        const data = await response.json();

        const customSongs =
          JSON.parse(localStorage.getItem("customSongs")) || [];

        const allSongs = [...data, ...customSongs];

        setSongs(allSongs);

        if (allSongs.length > 0) {
          setCurrentSong(allSongs[0]);
        }
      } catch (error) {
        console.error("Error loading songs:", error);
      }

      /* Favorites */

      setFavorites(
        JSON.parse(localStorage.getItem("favorites")) || []
      );

      /* Recently Played */

      setRecentSongs(
        JSON.parse(localStorage.getItem("recentSongs")) || []
      );

      /* Playlists */

      setPlaylists(
        JSON.parse(localStorage.getItem("playlists")) || []
      );

      /* Play Count */

      setPlayCount(
        JSON.parse(localStorage.getItem("playCount")) || {}
      );

      /* Listening Time */

      setTotalListeningTime(
        Number(localStorage.getItem("listeningTime")) || 0
      );
    };

    loadData();
  }, []);

  /* =========================
     SAVE FAVORITES
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  /* =========================
     SAVE RECENT SONGS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "recentSongs",
      JSON.stringify(recentSongs)
    );
  }, [recentSongs]);

  /* =========================
     SAVE PLAYLISTS
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "playlists",
      JSON.stringify(playlists)
    );
  }, [playlists]);

  /* =========================
     SAVE PLAY COUNT
  ========================= */

  useEffect(() => {
    localStorage.setItem(
      "playCount",
      JSON.stringify(playCount)
    );
  }, [playCount]);

  /* =========================
     LISTENING TIME
  ========================= */

  useEffect(() => {
    let timer;

    if (playing) {
      timer = setInterval(() => {
        setTotalListeningTime((previous) => {
          const updated = previous + 1;

          localStorage.setItem(
            "listeningTime",
            updated
          );

          return updated;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [playing]);

  /* =========================
     VOLUME
  ========================= */

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  /* =========================
     PLAY SONG
  ========================= */

  const playSong = async () => {
    if (!audioRef.current || !currentSong) {
      return;
    }

    try {
      await audioRef.current.play();

      setPlaying(true);

      setPlayCount((previous) => ({
        ...previous,
        [currentSong.id]:
          (previous[currentSong.id] || 0) + 1,
      }));
    } catch (error) {
      console.error(
        "Unable to play song:",
        error
      );

      setPlaying(false);
    }
  };

  /* =========================
     PAUSE SONG
  ========================= */

  const pauseSong = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    setPlaying(false);
  };

  /* =========================
     SELECT SONG
  ========================= */

  const selectSong = async (song) => {
    if (!song) {
      return;
    }

    setCurrentSong(song);

    setProgress(0);

    /* Recently Played */

    setRecentSongs((previous) =>
      [
        song,
        ...previous.filter(
          (item) => item.id !== song.id
        ),
      ].slice(0, 10)
    );

    /*
      Wait for React to update the audio source
      before playing the new song.
    */

    setTimeout(async () => {
      if (!audioRef.current) {
        return;
      }

      try {
        audioRef.current.currentTime = 0;

        await audioRef.current.play();

        setPlaying(true);
      } catch (error) {
        console.error(
          "Unable to play selected song:",
          error
        );

        setPlaying(false);
      }
    }, 150);
  };

  /* =========================
     NEXT SONG
  ========================= */

  const nextSong = () => {
    if (!songs.length || !currentSong) {
      return;
    }

    /* Queue */

    if (queue.length > 0) {
      const next = queue[0];

      setQueue((previous) =>
        previous.slice(1)
      );

      selectSong(next);

      return;
    }

    /* Shuffle */

    if (shuffle) {
      let randomSong;

      if (songs.length === 1) {
        randomSong = songs[0];
      } else {
        do {
          randomSong =
            songs[
              Math.floor(
                Math.random() * songs.length
              )
            ];
        } while (
          randomSong.id === currentSong.id
        );
      }

      selectSong(randomSong);

      return;
    }

    /* Normal Next */

    const index = songs.findIndex(
      (song) =>
        song.id === currentSong.id
    );

    const nextIndex =
      index === -1
        ? 0
        : (index + 1) % songs.length;

    selectSong(songs[nextIndex]);
  };

  /* =========================
     PREVIOUS SONG
  ========================= */

  const prevSong = () => {
    if (!songs.length || !currentSong) {
      return;
    }

    const index = songs.findIndex(
      (song) =>
        song.id === currentSong.id
    );

    const previousIndex =
      index === -1
        ? 0
        : (index - 1 + songs.length) %
          songs.length;

    selectSong(songs[previousIndex]);
  };

  /* =========================
     FAVORITES
  ========================= */

  const toggleFavorite = (song) => {
    if (!song) {
      return;
    }

    setFavorites((previous) =>
      previous.some(
        (favorite) =>
          favorite.id === song.id
      )
        ? previous.filter(
            (favorite) =>
              favorite.id !== song.id
          )
        : [...previous, song]
    );
  };

  /* =========================
     QUEUE
  ========================= */

  const addToQueue = (song) => {
    if (!song) {
      return;
    }

    setQueue((previous) =>
      previous.some(
        (item) =>
          item.id === song.id
      )
        ? previous
        : [...previous, song]
    );
  };

  /* =========================
     CREATE PLAYLIST
  ========================= */

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

    setPlaylists((previous) => [
      ...previous,
      newPlaylist,
    ]);

    setPlaylistName("");
  };

  /* =========================
     DELETE PLAYLIST
  ========================= */

  const deletePlaylist = (id) => {
    setPlaylists((previous) =>
      previous.filter(
        (playlist) =>
          playlist.id !== id
      )
    );
  };

  /* =========================
     ADD / UPLOAD SONG
  ========================= */

  const addSong = () => {
    if (
      !newSongTitle.trim() ||
      !newSongArtist.trim()
    ) {
      alert(
        "Please enter song title and artist"
      );

      return;
    }

    if (!newSongAudio.trim()) {
      alert("Please enter an audio URL");
      return;
    }

    const newSong = {
      id: Date.now(),

      title: newSongTitle.trim(),

      artist: newSongArtist.trim(),

      cover:
        newSongCover.trim() ||
        "/covers/default.jpg",

      audio: newSongAudio.trim(),

      category: "Custom",
    };

    const existingCustomSongs =
      JSON.parse(
        localStorage.getItem("customSongs")
      ) || [];

    const updatedCustomSongs = [
      ...existingCustomSongs,
      newSong,
    ];

    localStorage.setItem(
      "customSongs",
      JSON.stringify(
        updatedCustomSongs
      )
    );

    setSongs((previous) => [
      ...previous,
      newSong,
    ]);

    setNewSongTitle("");
    setNewSongArtist("");
    setNewSongCover("");
    setNewSongAudio("");

    alert("Song added successfully 🎵");
  };

  /* =========================
     SEARCH FILTER
  ========================= */

  const filteredSongs = songs.filter(
    (song) => {
      const title =
        song.title?.toLowerCase() || "";

      const artist =
        song.artist?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();

      const matchesSearch =
        title.includes(searchText) ||
        artist.includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        song.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    }
  );

  /* =========================
     TRENDING SONGS
  ========================= */

  const topSongs = [...songs]
    .sort(
      (a, b) =>
        (playCount[b.id] || 0) -
        (playCount[a.id] || 0)
    )
    .slice(0, 5);

  /* =========================
     MOST PLAYED SONG
  ========================= */

  const mostPlayedSong =
    topSongs.length > 0
      ? topSongs[0]
      : null;

  /* =========================
     AUDIO PROGRESS
  ========================= */

  const handleProgress = () => {
    if (!audioRef.current) {
      return;
    }

    const currentTime =
      audioRef.current.currentTime;

    const duration =
      audioRef.current.duration;

    if (
      !duration ||
      Number.isNaN(duration)
    ) {
      setProgress(0);
      return;
    }

    setProgress(
      (currentTime / duration) * 100
    );
  };

  /* =========================
     SEEK SONG
  ========================= */

  const handleSeek = (value) => {
    if (!audioRef.current) {
      return;
    }

    const duration =
      audioRef.current.duration;

    if (
      !duration ||
      Number.isNaN(duration)
    ) {
      return;
    }

    const newTime =
      (Number(value) / 100) * duration;

    audioRef.current.currentTime =
      newTime;

    setProgress(Number(value));
  };

  /* =========================
     LOADING
  ========================= */

  if (!currentSong) {
    return (
      <h1
        style={{
          color: "white",
          padding: "40px",
        }}
      >
        Loading Vibely...
      </h1>
    );
  }

  /* =========================
     UI
  ========================= */

  return (
    <>
      {/* =========================
          BACKGROUND
      ========================= */}

      <div className="moon"></div>

      <div className="stars">
        {[...Array(40)].map(
          (_, index) => (
            <span
              key={index}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          )
        )}
      </div>

      <div className="fireflies">
        {[...Array(15)].map(
          (_, index) => (
            <span key={index} />
          )
        )}
      </div>

      <div className="petals">
        {[...Array(20)].map(
          (_, index) => (
            <span key={index} />
          )
        )}
      </div>

      {/* =========================
          AUDIO PLAYER
      ========================= */}

      <audio
        ref={audioRef}
        src={currentSong.audio}
        onEnded={nextSong}
        onTimeUpdate={handleProgress}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {/* =========================
          MAIN APP
      ========================= */}

      <div className="app">

        {/* SIDEBAR */}

        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={
            setSidebarOpen
          }
          activePage={activePage}
          setActivePage={
            setActivePage
          }
          theme={theme}
          setTheme={setTheme}
        />

        {/* MAIN CONTENT */}

        <div className="main">

          {/* LOGIN */}

          <Login />

          {/* =========================
              HOME
          ========================= */}

          {activePage === "home" && (
            <>
              {/* DASHBOARD */}

              <Dashboard
                totalListeningTime={
                  totalListeningTime
                }
                favorites={favorites}
                playlists={playlists}
                playCount={playCount}
                mostPlayedSong={
                  mostPlayedSong
                }
              />

              {/* HERO */}

              <Hero
                currentSong={
                  currentSong
                }
                playing={playing}
                playSong={playSong}
              />

              {/* SEARCH */}

              <Search
                search={search}
                setSearch={setSearch}
              />

              {/* CATEGORY */}

              <CategoryBar
                selectedCategory={
                  selectedCategory
                }
                setSelectedCategory={
                  setSelectedCategory
                }
              />

              {/* FEATURED */}

              <SongList
                title="⭐ Featured Albums"
                songs={songs.slice(0, 6)}
                selectSong={
                  selectSong
                }
              />

              {/* TRENDING */}

              <SongList
                title="🔥 Trending Now"
                songs={topSongs}
                selectSong={
                  selectSong
                }
              />

              {/* RECENTLY PLAYED */}

              <SongList
                title="🕒 Recently Played"
                songs={recentSongs}
                selectSong={
                  selectSong
                }
              />

              {/* FAVORITES */}

              <SongList
                title="❤️ Favorites"
                songs={favorites}
                selectSong={
                  selectSong
                }
                favorites={
                  favorites
                }
                toggleFavorite={
                  toggleFavorite
                }
              />

              {/* ALL SONGS */}

              <SongList
                title="🎵 All Songs"
                songs={filteredSongs}
                selectSong={
                  selectSong
                }
                favorites={
                  favorites
                }
                toggleFavorite={
                  toggleFavorite
                }
                addToQueue={
                  addToQueue
                }
              />

              {/* PLAYLISTS */}

              <Playlist
                playlists={
                  playlists
                }
                playlistName={
                  playlistName
                }
                setPlaylistName={
                  setPlaylistName
                }
                createPlaylist={
                  createPlaylist
                }
                deletePlaylist={
                  deletePlaylist
                }
              />

              {/* UPLOAD */}

              <UploadSong
                newSongTitle={
                  newSongTitle
                }
                setNewSongTitle={
                  setNewSongTitle
                }
                newSongArtist={
                  newSongArtist
                }
                setNewSongArtist={
                  setNewSongArtist
                }
                newSongCover={
                  newSongCover
                }
                setNewSongCover={
                  setNewSongCover
                }
                newSongAudio={
                  newSongAudio
                }
                setNewSongAudio={
                  setNewSongAudio
                }
                addSong={addSong}
              />

              {/* =========================
                  AI DJ
                  
                  COMPLETELY INDEPENDENT
              ========================= */}

              <AIDJ />
            </>
          )}

          {/* =========================
              SEARCH PAGE
          ========================= */}

          {activePage === "search" && (
            <>
              <Search
                search={search}
                setSearch={setSearch}
              />

              <CategoryBar
                selectedCategory={
                  selectedCategory
                }
                setSelectedCategory={
                  setSelectedCategory
                }
              />

              <SongList
                title="🔍 Search Results"
                songs={filteredSongs}
                selectSong={
                  selectSong
                }
                favorites={
                  favorites
                }
                toggleFavorite={
                  toggleFavorite
                }
                addToQueue={
                  addToQueue
                }
              />
            </>
          )}

          {/* =========================
              FAVORITES PAGE
          ========================= */}

          {activePage === "favorites" && (
            <SongList
              title="❤️ Favorite Songs"
              songs={favorites}
              selectSong={
                selectSong
              }
              favorites={
                favorites
              }
              toggleFavorite={
                toggleFavorite
              }
              addToQueue={
                addToQueue
              }
            />
          )}

          {/* =========================
              LIBRARY PAGE
          ========================= */}

          {activePage === "library" && (
            <SongList
              title="🎵 Library"
              songs={songs}
              selectSong={
                selectSong
              }
              favorites={
                favorites
              }
              toggleFavorite={
                toggleFavorite
              }
              addToQueue={
                addToQueue
              }
            />
          )}

          {/* =========================
              PLAYLISTS PAGE
          ========================= */}

          {activePage === "playlists" && (
            <Playlist
              playlists={
                playlists
              }
              playlistName={
                playlistName
              }
              setPlaylistName={
                setPlaylistName
              }
              createPlaylist={
                createPlaylist
              }
              deletePlaylist={
                deletePlaylist
              }
            />
          )}
        </div>
      </div>

      {/* =========================
          MINI PLAYER
      ========================= */}

      <MiniPlayer
        currentSong={
          currentSong
        }
        playing={playing}
        playSong={playSong}
        pauseSong={pauseSong}
        prevSong={prevSong}
        nextSong={nextSong}
        progress={progress}
        setProgress={
          handleSeek
        }
        audioRef={
          audioRef
        }
        volume={volume}
        setVolume={setVolume}
        favorites={
          favorites
        }
        toggleFavorite={
          toggleFavorite
        }
      />
    </>
  );
}

export default App;