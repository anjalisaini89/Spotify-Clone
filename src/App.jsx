import {
  FaHome, FaSearch, FaHeart, FaMusic,
  FaList, FaMoon, FaSun, FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import "./App.css";
import { useRef, useState, useEffect } from "react";
import Login from "./components/Login";

function App() {
  const audioRef = useRef(null);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [shuffle, setShuffle] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [recentSongs, setRecentSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [totalListeningTime, setTotalListeningTime] = useState(0);
  const [playCount, setPlayCount] = useState({});
  const [djMessage, setDjMessage] = useState("Welcome to Vibely DJ 🎧");
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongCover, setNewSongCover] = useState("");
  const [newSongAudio, setNewSongAudio] = useState("");
  const [queue, setQueue] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    fetch("/songs.json")
      .then((r) => r.json())
      .then((data) => {
        const custom = JSON.parse(localStorage.getItem("customSongs")) || [];
        const all = [...data, ...custom];
        setSongs(all);
        setCurrentSong(all[0]);
      })
      .catch(console.error);
    setFavorites(JSON.parse(localStorage.getItem("favorites")) || []);
    setRecentSongs(JSON.parse(localStorage.getItem("recentSongs")) || []);
    setPlaylists(JSON.parse(localStorage.getItem("playlists")) || []);
    setPlayCount(JSON.parse(localStorage.getItem("playCount")) || {});
    setTotalListeningTime(Number(localStorage.getItem("listeningTime")) || 0);
  }, []);

  useEffect(() => { localStorage.setItem("favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("recentSongs", JSON.stringify(recentSongs)); }, [recentSongs]);
  useEffect(() => { localStorage.setItem("playlists", JSON.stringify(playlists)); }, [playlists]);
  useEffect(() => { localStorage.setItem("playCount", JSON.stringify(playCount)); }, [playCount]);

  useEffect(() => {
    let timer;
    if (playing) {
      timer = setInterval(() => {
        setTotalListeningTime((prev) => {
          const u = prev + 1;
          localStorage.setItem("listeningTime", u);
          return u;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [playing]);

  const playSong = () => {
    if (!audioRef.current) return;
    audioRef.current.play();
    setPlaying(true);
    setPlayCount((prev) => ({ ...prev, [currentSong.id]: (prev[currentSong.id] || 0) + 1 }));
  };

  const pauseSong = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setPlaying(false);
  };

  const selectSong = (song) => {
    setCurrentSong(song);
    const msgs = [
      `🎵 Now spinning ${song.title}!`,
      `🔥 ${song.artist} is trending in your library!`,
      `✨ Based on your taste, this is a perfect pick.`,
      `🎧 DJ Vibely recommends this track for your mood.`,
      `🚀 This song is climbing your charts!`,
    ];
    setDjMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    setRecentSongs((prev) => [song, ...prev.filter((s) => s.id !== song.id)].slice(0, 10));
    setTimeout(() => {
      if (audioRef.current) { audioRef.current.play(); setPlaying(true); }
    }, 100);
  };

  const topSongs = [...songs]
    .sort((a, b) => (playCount[b.id] || 0) - (playCount[a.id] || 0))
    .slice(0, 5);

  const nextSong = () => {
    if (queue.length > 0) {
      const next = queue[0];
      setQueue((p) => p.slice(1));
      selectSong(next);
      return;
    }
    if (shuffle) { selectSong(songs[Math.floor(Math.random() * songs.length)]); return; }
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    selectSong(songs[(idx + 1) % songs.length]);
  };

  const prevSong = () => {
    const idx = songs.findIndex((s) => s.id === currentSong.id);
    selectSong(songs[(idx - 1 + songs.length) % songs.length]);
  };

  const toggleFavorite = (song) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === song.id)
        ? prev.filter((f) => f.id !== song.id)
        : [...prev, song]
    );
  };

  const filteredSongs = songs.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.artist.toLowerCase().includes(search.toLowerCase())
  );

  const createPlaylist = () => {
    if (!playlistName.trim()) return;
    setPlaylists([...playlists, { id: Date.now(), name: playlistName, songs: [] }]);
    setPlaylistName("");
  };

  const deletePlaylist = (id) => setPlaylists(playlists.filter((p) => p.id !== id));
  const addToQueue = (song) => setQueue((prev) => prev.some((s) => s.id === song.id) ? prev : [...prev, song]);

  const addToPlaylist = (playlistId, song) => {
    setPlaylists(playlists.map((p) =>
      p.id === playlistId
        ? { ...p, songs: p.songs.some((s) => s.id === song.id) ? p.songs : [...p.songs, song] }
        : p
    ));
  };

  const removeFromPlaylist = (playlistId, songId) => {
    setPlaylists(playlists.map((p) =>
      p.id === playlistId ? { ...p, songs: p.songs.filter((s) => s.id !== songId) } : p
    ));
  };

  const addSong = () => {
    if (!newSongTitle.trim() || !newSongArtist.trim()) { alert("Please enter title and artist"); return; }
    const newSong = {
      id: Date.now(), title: newSongTitle, artist: newSongArtist,
      cover: newSongCover || "/default-cover.jpg", audio: newSongAudio || "/default.mp3"
    };
    const saved = JSON.parse(localStorage.getItem("customSongs")) || [];
    localStorage.setItem("customSongs", JSON.stringify([...saved, newSong]));
    setSongs([...songs, newSong]);
    setNewSongTitle(""); setNewSongArtist(""); setNewSongCover(""); setNewSongAudio("");
  };

  const recommendedSongs = songs.filter((s) =>
    favorites.some((f) => f.artist === s.artist) && !favorites.some((f) => f.id === s.id)
  );

  const mostPlayedSong = topSongs[0] || null;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!currentSong) return <h1 style={{ color: "white", padding: 40 }}>Loading...</h1>;

  return (
    <>
      {/* BG decorations */}
      <div className="moon" />
      <div className="stars">
        {[...Array(30)].map((_, i) => (
          <span key={i} style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }} />
        ))}
      </div>
      <div className="fireflies">{[...Array(12)].map((_, i) => <span key={i} />)}</div>
      <img src="/tree.png" className="tree-decoration" alt="" />
      <div className="petals">{[...Array(15)].map((_, i) => <span key={i} />)}</div>

      <audio
        ref={audioRef}
        src={currentSong.audio}
        onEnded={nextSong}
        onTimeUpdate={() => {
          setProgress(
            ((audioRef.current?.currentTime || 0) / (audioRef.current?.duration || 1)) * 100
          );
        }}
      />

      <div className="app">

        {/* ── SIDEBAR ── */}
        <div className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>

          <div className="sidebar-logo">
            🎧 {sidebarOpen && "Vibely"}
          </div>

          {sidebarOpen && <Login />}

          <div className="menu-item">
            <FaHome /> {sidebarOpen && <span>Home</span>}
          </div>
          <div className="menu-item">
            <FaSearch /> {sidebarOpen && <span>Search</span>}
          </div>
          <div className="menu-item">
            <FaMusic /> {sidebarOpen && <span>Library</span>}
          </div>
          <div className="menu-item">
            <FaHeart /> {sidebarOpen && <span>Favorites</span>}
          </div>
          <div className="menu-item">
            <FaList /> {sidebarOpen && <span>Playlists</span>}
          </div>
          <div className="menu-item" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
            {sidebarOpen && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
          </div>
        </div>

        {/* ── MAIN ── */}
        <div className="main">

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card"><h3>⏱ Listen Time</h3><p>{Math.floor(totalListeningTime / 60)} min</p></div>
            <div className="stat-card"><h3>❤️ Favorites</h3><p>{favorites.length}</p></div>
            <div className="stat-card"><h3>📂 Playlists</h3><p>{playlists.length}</p></div>
            <div className="stat-card"><h3>🎵 Played</h3><p>{Object.values(playCount).reduce((a, b) => a + b, 0)}</p></div>
            <div className="stat-card"><h3>🔥 Top Track</h3><p style={{ fontSize: 13 }}>{mostPlayedSong?.title || "—"}</p></div>
          </div>

          <br />
        {/* HERO SECTION */}
<div className="hero-section">
  <div className="hero-content">
    <p className="hero-tag">✨ Welcome Back</p>

    <h1 className="hero-title">
      Enjoy Your <span>Music Journey</span>
    </h1>

    <p className="hero-text">
      Discover new songs, enjoy your favorite playlists,
      and let Vibely DJ create the perfect vibe for every moment.
    </p>

    <div className="hero-buttons">
      <button className="hero-btn primary">
        ▶ Play Now
      </button>

      <button className="hero-btn secondary">
        ❤️ Favorites
      </button>
    </div>
  </div>

  <div className="hero-image">
    <img
      src={currentSong.cover}
      alt={currentSong.title}
      className={playing ? "hero-cover spinning" : "hero-cover"}
    />
  </div>
</div>
          {/* Search */}
          <div className="search-container">
            <span>🔍</span>
            <input
              className="search-bar"
              type="text"
              placeholder="Search songs, artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <br />
          <button onClick={() => setShuffle(!shuffle)}>
            {shuffle ? "🔀 Shuffle ON" : "🔀 Shuffle OFF"}
          </button>
          <br /><br />

          {/* ── NOW PLAYING ISLAND ── */}
          <div className="np-island">
            <div className="np-bg-art" style={{ backgroundImage: `url(${currentSong.cover})` }} />
            <div className="np-orb np-orb-1" />
            <div className="np-orb np-orb-2" />

            <div className="np-content">
              <div className="np-cover-ring">
                <div className="np-cover-ring-inner">
                  <img
                    src={currentSong.cover}
                    alt={currentSong.title}
                    className={`np-cover ${playing ? "np-cover-playing" : ""}`}
                  />
                </div>
              </div>

              <div className="np-petals">
                <span>🌸</span><span>🌸</span><span>🌸</span>
              </div>

              <div className="np-info">
                <p className="np-now-label">✦ NOW PLAYING ✦</p>
                <h2 className="np-title">{currentSong.title}</h2>
                <p className="np-artist">{currentSong.artist}</p>
              </div>

              <div className="np-progress-wrap">
                <span className="np-time">{formatTime(audioRef.current?.currentTime)}</span>
                <input
                  className="np-progress"
                  type="range" min="0" max="100" value={progress}
                  onChange={(e) => {
                    setProgress(e.target.value);
                    if (audioRef.current)
                      audioRef.current.currentTime = (e.target.value / 100) * audioRef.current.duration;
                  }}
                />
                <span className="np-time">{formatTime(audioRef.current?.duration)}</span>
              </div>

              <div className="np-controls">
                <button className="np-btn-sm" onClick={() => setShuffle(!shuffle)}>
                  {shuffle ? "🔀" : "🔁"}
                </button>
                <button className="np-btn" onClick={prevSong}>⏮</button>
                <button className="np-btn-play" onClick={playing ? pauseSong : playSong}>
                  {playing ? "⏸" : "▶"}
                </button>
                <button className="np-btn" onClick={nextSong}>⏭</button>
                <button className="np-btn-sm" onClick={() => toggleFavorite(currentSong)}>
                  {favorites.some((f) => f.id === currentSong.id) ? "❤️" : "🤍"}
                </button>
              </div>

              <div className="np-volume">
                <span>🔈</span>
                <input
                  className="np-vol-slider"
                  type="range" min="0" max="1" step="0.05" value={volume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    if (audioRef.current) audioRef.current.volume = Number(e.target.value);
                  }}
                />
                <span>🔊</span>
              </div>

              {playing && (
                <div className="np-visualizer">
                  <span /><span /><span /><span /><span /><span /><span />
                </div>
              )}
            </div>
          </div>

          {/* Recently Played */}
          {recentSongs.length > 0 && (
            <>
              <h2>🕒 Recently Played</h2>
              <div className="song-list">
                {recentSongs.map((song) => (
                  <div key={song.id} className="song-card" onClick={() => selectSong(song)}>
                    <img src={song.cover} alt={song.title} className="cover" />
                    <h3>{song.title}</h3><p>{song.artist}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* All Songs */}
          <h2>🎵 All Songs</h2>
          <div className="song-list">
            {filteredSongs.map((song) => (
              <div key={song.id} className="song-card" onClick={() => selectSong(song)}>
                <img src={song.cover} alt={song.title} className="cover" />
                <h3>{song.title}</h3><p>{song.artist}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                  <button onClick={(e) => { e.stopPropagation(); toggleFavorite(song); }}>
                    {favorites.some((f) => f.id === song.id) ? "❤️" : "🤍"}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); addToQueue(song); }}>➕</button>
                  <select
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => { if (e.target.value) addToPlaylist(Number(e.target.value), song); }}
                    style={{ borderRadius: 20, padding: "4px 8px", background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}
                  >
                    <option value="">+ Playlist</option>
                    {playlists.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Favorites */}
          {favorites.length > 0 && (
            <>
              <h2>❤️ Favorite Songs</h2>
              <div className="song-list">
                {favorites.map((song) => (
                  <div key={song.id} className="song-card" onClick={() => selectSong(song)}>
                    <img src={song.cover} alt={song.title} className="cover" />
                    <h3>{song.title}</h3><p>{song.artist}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* On Repeat */}
          {topSongs.length > 0 && (
            <>
              <h2>🔥 On Repeat</h2>
              <div className="song-list">
                {topSongs.map((song) => (
                  <div key={song.id} className="song-card" onClick={() => selectSong(song)}>
                    <img src={song.cover} alt={song.title} className="cover" />
                    <h3>{song.title}</h3><p>{song.artist}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Recommended */}
          {recommendedSongs.length > 0 && (
            <>
              <h2>✨ Recommended For You</h2>
              <div className="song-list">
                {recommendedSongs.map((song) => (
                  <div key={song.id} className="song-card" onClick={() => selectSong(song)}>
                    <img src={song.cover} alt={song.title} className="cover" />
                    <h3>{song.title}</h3><p>{song.artist}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Playlists */}
          <h2>📂 Create Playlist</h2>
          <input type="text" placeholder="Playlist name" value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)} />
          <button onClick={createPlaylist}>Create</button>
          <br /><br />
          {playlists.map((playlist) => (
            <div key={playlist.id} style={{ marginBottom: 20 }}>
              <h3>{playlist.name} ({playlist.songs.length} songs)</h3>
              {playlist.songs.map((song) => (
                <p key={song.id} style={{ color: "var(--text-dim)", margin: "6px 0" }}>
                  🎵 {song.title}
                  <button style={{ marginLeft: 8, padding: "4px 10px" }}
                    onClick={() => removeFromPlaylist(playlist.id, song.id)}>❌</button>
                </p>
              ))}
              <button onClick={() => deletePlaylist(playlist.id)}>🗑 Delete</button>
            </div>
          ))}

          {/* Queue */}
          {queue.length > 0 && (
            <>
              <h2>📋 Queue ({queue.length})</h2>
              <div className="song-list">
                {queue.map((song, i) => (
                  <div key={i} className="song-card">
                    <h3>{song.title}</h3><p>{song.artist}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Add Song */}
          <h2>➕ Add Song</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 400 }}>
            <input placeholder="Title" value={newSongTitle} onChange={(e) => setNewSongTitle(e.target.value)} />
            <input placeholder="Artist" value={newSongArtist} onChange={(e) => setNewSongArtist(e.target.value)} />
            <input placeholder="Cover URL" value={newSongCover} onChange={(e) => setNewSongCover(e.target.value)} />
            <input placeholder="Audio URL" value={newSongAudio} onChange={(e) => setNewSongAudio(e.target.value)} />
            <button onClick={addSong}>Add Song</button>
          </div>

          <br />
          <h2>🎧 AI DJ</h2>
          <div className="dj-box">{djMessage}</div>
          <br /><br />

        </div>
      </div>

      {/* ── PLAYER BAR ── */}
      <div className={`player ${sidebarOpen ? "player-open" : "player-collapse"}`}>
        <span>{playing ? `🎵 ${currentSong.title} — ${currentSong.artist}` : "⏸ Paused"}</span>
        <div className={`visualizer ${playing ? "playing-bars" : ""}`}>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>
      </div>
    </>
  );
}

export default App;