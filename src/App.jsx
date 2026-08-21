import { useCallback, useEffect, useMemo, useState } from "react";
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

import { useAudioPlayer } from "./Hooks/useAudioPlayer";
import { getSongs } from "./Services/api";

function App() {
  /* =====================================================
     SONGS
  ===================================================== */

  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState("");

  /* =====================================================
     SEARCH
  ===================================================== */

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  /* =====================================================
     USER DATA
     Temporary localStorage version.
     Later → MongoDB
  ===================================================== */

  const [favorites, setFavorites] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");

  /* =====================================================
     STATISTICS
     Temporary localStorage version.
     Later → Node + MongoDB
  ===================================================== */

  const [playCount, setPlayCount] = useState({});
  const [totalListeningTime, setTotalListeningTime] =
    useState(0);

  /* =====================================================
     UPLOAD
     Temporary frontend version.
     Later → Node upload API
  ===================================================== */

  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongCover, setNewSongCover] = useState("");
  const [newSongAudio, setNewSongAudio] = useState("");

  /* =====================================================
     UI
  ===================================================== */

  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("home");

  /* =====================================================
     AUDIO PLAYER
  ===================================================== */

  const handleSongPlayed = useCallback((song) => {
    if (!song) return;

    /* Recently played */

    setRecentSongs((previous) => [
      song,
      ...previous.filter(
        (item) => item.id !== song.id
      ),
    ].slice(0, 10));

    /* Play count */

    setPlayCount((previous) => ({
      ...previous,
      [song.id]: (previous[song.id] || 0) + 1,
    }));
  }, []);

  const {
    audioRef,

    currentSong,
    playing,

    progress,

    volume,
    setVolume,

    shuffle,
    setShuffle,

    queue,

    playSong,
    pauseSong,
    selectSong,
    nextSong,
    prevSong,

    addToQueue,

    handleProgress,
    handleSeek,
  } = useAudioPlayer({
    songs,
    onSongPlayed: handleSongPlayed,
  });

  /* =====================================================
     THEME
  ===================================================== */

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [theme]);

  /* =====================================================
     LOAD SONGS FROM NODE API
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const loadSongs = async () => {
      try {
        setSongsLoading(true);
        setSongsError("");

        const data = await getSongs();

        if (!mounted) return;

        setSongs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to load songs:",
          error
        );

        if (mounted) {
          setSongsError(
            "Unable to connect to Vibely server."
          );
        }
      } finally {
        if (mounted) {
          setSongsLoading(false);
        }
      }
    };

    loadSongs();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     LOAD TEMPORARY LOCAL DATA
  ===================================================== */

  useEffect(() => {
    try {
      setFavorites(
        JSON.parse(
          localStorage.getItem("favorites")
        ) || []
      );

      setRecentSongs(
        JSON.parse(
          localStorage.getItem("recentSongs")
        ) || []
      );

      setPlaylists(
        JSON.parse(
          localStorage.getItem("playlists")
        ) || []
      );

      setPlayCount(
        JSON.parse(
          localStorage.getItem("playCount")
        ) || {}
      );

      setTotalListeningTime(
        Number(
          localStorage.getItem(
            "listeningTime"
          )
        ) || 0
      );
    } catch (error) {
      console.error(
        "Failed to load local data:",
        error
      );
    }
  }, []);

  /* =====================================================
     SAVE TEMPORARY USER DATA
  ===================================================== */

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

  /* =====================================================
     LISTENING TIME
  ===================================================== */

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setTotalListeningTime((previous) => {
        const updated = previous + 1;

        localStorage.setItem(
          "listeningTime",
          updated
        );

        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playing]);

  /* =====================================================
     FAVORITES
  ===================================================== */

  const toggleFavorite = useCallback((song) => {
    if (!song) return;

    setFavorites((previous) => {
      const exists = previous.some(
        (favorite) =>
          favorite.id === song.id
      );

      if (exists) {
        return previous.filter(
          (favorite) =>
            favorite.id !== song.id
        );
      }

      return [...previous, song];
    });
  }, []);

  /* =====================================================
     PLAYLISTS
  ===================================================== */

  const createPlaylist = useCallback(() => {
    const name = playlistName.trim();

    if (!name) {
      alert("Please enter a playlist name");
      return;
    }

    const newPlaylist = {
      id: Date.now(),
      name,
      songs: [],
    };

    setPlaylists((previous) => [
      ...previous,
      newPlaylist,
    ]);

    setPlaylistName("");
  }, [playlistName]);

  const deletePlaylist = useCallback((id) => {
    setPlaylists((previous) =>
      previous.filter(
        (playlist) =>
          playlist.id !== id
      )
    );
  }, []);

  /* =====================================================
     ADD SONG
  ===================================================== */

  const addSong = useCallback(() => {
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

    setSongs((previous) => [
      ...previous,
      newSong,
    ]);

    setNewSongTitle("");
    setNewSongArtist("");
    setNewSongCover("");
    setNewSongAudio("");

    alert("Song added successfully 🎵");
  }, [
    newSongTitle,
    newSongArtist,
    newSongCover,
    newSongAudio,
  ]);

  /* =====================================================
     FILTERED SONGS
  ===================================================== */

  const filteredSongs = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return songs.filter((song) => {
      const title =
        song.title?.toLowerCase() || "";

      const artist =
        song.artist?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        artist.includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        song.category === selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    songs,
    search,
    selectedCategory,
  ]);

  /* =====================================================
     TRENDING SONGS
  ===================================================== */

  const topSongs = useMemo(() => {
    return [...songs]
      .sort(
        (a, b) =>
          (playCount[b.id] || 0) -
          (playCount[a.id] || 0)
      )
      .slice(0, 5);
  }, [songs, playCount]);

  /* =====================================================
     MOST PLAYED
  ===================================================== */

  const mostPlayedSong =
    topSongs[0] || null;

  /* =====================================================
     LOADING
  ===================================================== */

  if (songsLoading) {
    return (
      <div className="loading-screen">
        <h1>Loading Vibely...</h1>
        <p>Connecting to music server...</p>
      </div>
    );
  }

  /* =====================================================
     SERVER ERROR
  ===================================================== */

  if (songsError) {
    return (
      <div className="loading-screen">
        <h1>Vibely</h1>

        <p>{songsError}</p>

        <p>
          Make sure the Node.js server is
          running on port 5000.
        </p>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <>
      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="moon" />

      <div className="stars">
        {[...Array(40)].map((_, index) => (
          <span
            key={index}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="fireflies">
        {[...Array(15)].map((_, index) => (
          <span key={index} />
        ))}
      </div>

      <div className="petals">
        {[...Array(20)].map((_, index) => (
          <span key={index} />
        ))}
      </div>

      {/* =================================================
          AUDIO
      ================================================= */}

      {currentSong && (
        <audio
          ref={audioRef}
          src={currentSong.audio}
          onEnded={nextSong}
          onTimeUpdate={handleProgress}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      )}

      {/* =================================================
          APP
      ================================================= */}

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

          {/* =================================================
              HOME
          ================================================= */}

          {activePage === "home" && (
            <>
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

              {currentSong && (
                <Hero
                  currentSong={currentSong}
                  playing={playing}
                  playSong={playSong}
                />
              )}

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
                favorites={favorites}
                toggleFavorite={
                  toggleFavorite
                }
              />

              <SongList
                title="🎵 All Songs"
                songs={filteredSongs}
                selectSong={selectSong}
                favorites={favorites}
                toggleFavorite={
                  toggleFavorite
                }
                addToQueue={addToQueue}
              />

              <Playlist
                playlists={playlists}
                playlistName={playlistName}
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

              <UploadSong
                newSongTitle={newSongTitle}
                setNewSongTitle={
                  setNewSongTitle
                }
                newSongArtist={
                  newSongArtist
                }
                setNewSongArtist={
                  setNewSongArtist
                }
                newSongCover={newSongCover}
                setNewSongCover={
                  setNewSongCover
                }
                newSongAudio={newSongAudio}
                setNewSongAudio={
                  setNewSongAudio
                }
                addSong={addSong}
              />

              <AIDJ
                recommendedSongs={topSongs}
                favorites={favorites}
                recentSongs={recentSongs}
                playCount={playCount}
                selectSong={selectSong}
              />
            </>
          )}

          {/* =================================================
              SEARCH
          ================================================= */}

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
                selectSong={selectSong}
                favorites={favorites}
                toggleFavorite={
                  toggleFavorite
                }
                addToQueue={addToQueue}
              />
            </>
          )}

          {/* =================================================
              FAVORITES
          ================================================= */}

          {activePage === "favorites" && (
            <SongList
              title="❤️ Favorite Songs"
              songs={favorites}
              selectSong={selectSong}
              favorites={favorites}
              toggleFavorite={
                toggleFavorite
              }
              addToQueue={addToQueue}
            />
          )}

          {/* =================================================
              LIBRARY
          ================================================= */}

          {activePage === "library" && (
            <SongList
              title="🎵 Library"
              songs={songs}
              selectSong={selectSong}
              favorites={favorites}
              toggleFavorite={
                toggleFavorite
              }
              addToQueue={addToQueue}
            />
          )}

          {/* =================================================
              PLAYLISTS
          ================================================= */}

          {activePage === "playlists" && (
            <Playlist
              playlists={playlists}
              playlistName={playlistName}
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

      {/* =================================================
          MINI PLAYER
      ================================================= */}

      {currentSong && (
        <MiniPlayer
          currentSong={currentSong}
          playing={playing}
          playSong={playSong}
          pauseSong={pauseSong}
          prevSong={prevSong}
          nextSong={nextSong}
          progress={progress}
          setProgress={handleSeek}
          audioRef={audioRef}
          volume={volume}
          setVolume={setVolume}
          favorites={favorites}
          toggleFavorite={
            toggleFavorite
          }
          shuffle={shuffle}
          setShuffle={setShuffle}
          queue={queue}
        />
      )}
    </>
  );
}

export default App;