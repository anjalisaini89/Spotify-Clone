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

  useEffect(() => {
    fetch("/songs.json")
      .then((response) => response.json())
      .then((data) => {
        setSongs(data);
        setCurrentSong(data[0]);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!currentSong) {
    return <h1>Loading...</h1>;
  }

  const playSong = () => {
    audioRef.current.play();
    setPlaying(true);
  };

  const pauseSong = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

  const selectSong = (song) => {
  setCurrentSong(song);

  setRecentSongs((prev) => {
    const updated = [
      song,
      ...prev.filter((s) => s.id !== song.id),
    ];

    return updated.slice(0, 10);
  });

  setTimeout(() => {
    audioRef.current.play();
    setPlaying(true);
  }, 100);
};

  const nextSong = () => {
    if (shuffle) {
      const randomIndex = Math.floor(
        Math.random() * songs.length
      );

      setCurrentSong(songs[randomIndex]);

      setTimeout(() => {
        audioRef.current.play();
        setPlaying(true);
      }, 100);

      return;
    }

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex = (currentIndex + 1) % songs.length;

    setCurrentSong(songs[nextIndex]);

    setTimeout(() => {
      audioRef.current.play();
      setPlaying(true);
    }, 100);
  };

  const prevSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const prevIndex =
      (currentIndex - 1 + songs.length) % songs.length;

    setCurrentSong(songs[prevIndex]);

    setTimeout(() => {
      audioRef.current.play();
      setPlaying(true);
    }, 100);
  };

  const toggleFavorite = (song) => {
    if (favorites.some((fav) => fav.id === song.id)) {
      setFavorites(
        favorites.filter((fav) => fav.id !== song.id)
      );
    } else {
      setFavorites([...favorites, song]);
    }
  };

  const filteredSongs = songs.filter(
    (song) =>
      song.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      song.artist
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Vibely</h2>

        <Login />

        <div className="menu-item">🏠 Home</div>
        <div className="menu-item">🔍 Search</div>
        <div className="menu-item">📚 Library</div>
      </div>

      <div className="main">
        <h1>Vibely Library</h1>

        <input
          type="text"
          placeholder="Search songs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <br />
        <br />

        <button
          onClick={() =>
            setShuffle(!shuffle)
          }
        >
          {shuffle
            ? "🔀 Shuffle ON"
            : "🔀 Shuffle OFF"}
        </button>

        <h2>❤️ Favorite Songs</h2>
        <h2>🕒 Recently Played</h2>

<div className="song-list">
  {recentSongs.map((song) => (
    <div
      key={song.id}
      className="song-card"
      onClick={() => selectSong(song)}
    >
      <img
        src={song.cover}
        alt={song.title}
        className="cover"
      />

      <h3>{song.title}</h3>
      <p>{song.artist}</p>
    </div>
  ))}
</div>

<br />

        <div className="song-list">
          {favorites.map((song) => (
            <div
              key={song.id}
              className="song-card"
              onClick={() => selectSong(song)}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="cover"
              />

              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
          ))}
        </div>

        <div className="song-list">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="song-card"
              onClick={() => selectSong(song)}
            >
              <img
                src={song.cover}
                alt={song.title}
                className="cover"
              />

              <h3>{song.title}</h3>
              <p>{song.artist}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(song);
                }}
              >
                {favorites.some(
                  (fav) => fav.id === song.id
                )
                  ? "❤️"
                  : "🤍"}
              </button>
            </div>
          ))}
        </div>

        <h2>Now Playing</h2>

        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="current-cover"
        />

        <h3>{currentSong.title}</h3>
        <p>{currentSong.artist}</p>

        <button onClick={prevSong}>
          ⏮ Previous
        </button>

        <button onClick={playSong}>
          ▶ Play
        </button>

        <button onClick={pauseSong}>
          ⏸ Pause
        </button>

        <button onClick={nextSong}>
          ⏭ Next
        </button>

        <br />
        <br />

        <h3>Volume</h3>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);
            audioRef.current.volume =
              e.target.value;
          }}
        />

        <br />
        <br />

        <h3>Progress</h3>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          readOnly
        />

        <br />
        <br />

        <audio
          ref={audioRef}
          controls
          src={currentSong.audio}
          onEnded={nextSong}
          onTimeUpdate={() => {
            setProgress(
              (audioRef.current.currentTime /
                audioRef.current.duration) *
                100 || 0
            );
          }}
        />
      </div>

      <div className="player">
        🎵 {playing ? currentSong.title : "Paused"}
      </div>
    </div>
  );
}

export default App;