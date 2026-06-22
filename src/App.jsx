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
  const [djMessage, setDjMessage] =
  useState("Welcome to Vibely DJ 🎧");
  const [newSongTitle, setNewSongTitle] = useState("");
  const [newSongArtist, setNewSongArtist] = useState("");
  const [newSongCover, setNewSongCover] =
  useState("");
  const [newSongAudio, setNewSongAudio] =
  useState("");


  useEffect(() => {
  fetch("/songs.json")
  .then((response) => response.json())
  .then((data) => {
    const customSongs =
      JSON.parse(
        localStorage.getItem("customSongs")
      ) || [];

    const allSongs = [
      ...data,
      ...customSongs,
    ];

    setSongs(allSongs);
    setCurrentSong(allSongs[0]);
  })
  .catch((err) => console.error(err));

  const savedFavorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

  const savedRecentSongs =
    JSON.parse(localStorage.getItem("recentSongs")) || [];

  setFavorites(savedFavorites);
  setRecentSongs(savedRecentSongs);
}, []);

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
  const savedPlaylists =
    JSON.parse(localStorage.getItem("playlists")) || [];

  setPlaylists(savedPlaylists);
}, []);

useEffect(() => {
  localStorage.setItem(
    "playlists",
    JSON.stringify(playlists)
  );
}, [playlists]);


 const playSong = () => {
  if (!audioRef.current) return;

  audioRef.current.play();
  setPlaying(true);
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
  `✨ Based on your taste, this is a perfect pick.`,
  `🎧 DJ Vibely recommends this track for your mood.`,
  `🚀 This song is climbing your charts!`,
];

setDjMessage(
  messages[
    Math.floor(
      Math.random() * messages.length
    )
  ]
);

  setRecentSongs((prev) => {
    const updated = [
      song,
      ...prev.filter((s) => s.id !== song.id),
    ];
    
    setPlayCount((prev) => {
  const updated = {
    ...prev,
    [song.id]: (prev[song.id] || 0) + 1,
  };

  localStorage.setItem(
    "playCount",
    JSON.stringify(updated)
  );

  return updated;
});

    return updated.slice(0, 10);
  });

  setTimeout(() => {
  if (audioRef.current) {
    audioRef.current.play();
    setPlaying(true);
  }
}, 100);
};

const topSongs = [...songs]
  .sort(
    (a, b) =>
      (playCount[b.id] || 0) -
      (playCount[a.id] || 0)
  )
  .slice(0, 5);

  const nextSong = () => {
    if (shuffle) {
      const randomIndex = Math.floor(
        Math.random() * songs.length
      );

      selectSong(songs[randomIndex]);

      return;
    }

    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex = (currentIndex + 1) % songs.length;

    selectSong(songs[nextIndex]);
  };

  const prevSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const prevIndex =
      (currentIndex - 1 + songs.length) % songs.length;

    selectSong(songs[prevIndex]);
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

  const createPlaylist = () => {
  if (!playlistName.trim()) return;

  const newPlaylist = {
    id: Date.now(),
    name: playlistName,
    songs: [],
  };

  setPlaylists([...playlists, newPlaylist]);
  setPlaylistName("");
};
const deletePlaylist = (id) => {
  setPlaylists(
    playlists.filter((playlist) => playlist.id !== id)
  );
};

useEffect(() => {
  const savedTime =
    Number(localStorage.getItem("listeningTime")) || 0;

  setTotalListeningTime(savedTime);
}, []);

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

useEffect(() => {
  const saved =
    JSON.parse(localStorage.getItem("playCount")) || {};

  setPlayCount(saved);
}, []);

useEffect(() => {
  localStorage.setItem(
    "playCount",
    JSON.stringify(playCount)
  );
}, [playCount]);

if (!currentSong) {
  return <h1>Loading...</h1>;
}

const recommendedSongs =
  songs.filter(
    (song) =>
      favorites.some(
        (fav) =>
          fav.artist === song.artist
      ) &&
      !favorites.some(
        (fav) => fav.id === song.id
      )
  );

  const addToPlaylist = (playlistId, song) => {
  setPlaylists(
    playlists.map((playlist) =>
      playlist.id === playlistId
        ? {
            ...playlist,
            songs: playlist.songs.some(
  (s) => s.id === song.id
)
  ? playlist.songs
  : [...playlist.songs, song],
          }
        : playlist
    )
  );
};

const addSong = () => {
  if (
    !newSongTitle.trim() ||
    !newSongArtist.trim()
  ) {
    alert("Please enter title and artist");
    return;
  }

  const newSong = {
  id: Date.now(),
  title: newSongTitle,
  artist: newSongArtist,
  cover:
    newSongCover ||
    "/default-cover.jpg",
  audio:
    newSongAudio ||
    "/default.mp3",
};


const savedSongs =
  JSON.parse(localStorage.getItem("customSongs")) || [];

localStorage.setItem(
  "customSongs",
  JSON.stringify([...savedSongs, newSong])
);

  setSongs([...songs, newSong]);

  setNewSongTitle("");
  setNewSongArtist("");
  setNewSongCover("");
  setNewSongAudio("");
};

const mostPlayedSong =
  topSongs.length > 0
    ? topSongs[0]
    : null;

const removeFromPlaylist = (
  playlistId,
  songId
) => {
  setPlaylists(
    playlists.map((playlist) =>
      playlist.id === playlistId
        ? {
            ...playlist,
            songs:
              playlist.songs.filter(
                (song) =>
                  song.id !== songId
              ),
          }
        : playlist
    )
  );
};

  return (
 <>
  <div className="moon"></div>

  <div className="stars">
  {[...Array(30)].map((_, i) => (
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
  {[...Array(12)].map((_, i) => (
    <span key={i}></span>
  ))}
</div>

<img
  src="/tree.png"
  className="tree-decoration"
  alt="Cherry Blossom Tree"
/>

<div className="petals">
  {[...Array(15)].map((_, i) => (
    <span key={i}></span>
  ))}
</div>

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
      <h2>📂 Create Playlist</h2>

<input
  type="text"
  placeholder="Playlist name"
  value={playlistName}
  onChange={(e) => setPlaylistName(e.target.value)}
/>

<button onClick={createPlaylist}>
  Create Playlist
</button>
<h2>🎶 Your Playlists</h2>

{playlists.map((playlist) => (
  <div key={playlist.id}>
   <h3>
  {playlist.name} ({playlist.songs.length})
</h3>
    {playlist.songs.map((song) => (
  <p key={song.id}>
    🎵 {song.title}

    <button
      onClick={() =>
        removeFromPlaylist(
          playlist.id,
          song.id
        )
      }
    >
      ❌
    </button>
  </p>
))}
    <button onClick={() => deletePlaylist(playlist.id)}>
  🗑 Delete
</button>
  </div>
))}

<h2>❤️ Favorite Songs</h2>

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
<h2>🎵 All Songs</h2>

<br />

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

<select
  onClick={(e) => e.stopPropagation()}
  onChange={(e) => {
    if (e.target.value) {
      addToPlaylist(
        Number(e.target.value),
        song
      );
    }
  }}
>
  <option value="">
    Add to Playlist
  </option>

  {playlists.map((playlist) => (
    <option
      key={playlist.id}
      value={playlist.id}
    >
      {playlist.name}
    </option>
  ))}
</select>
            </div>
          ))}
        </div>

        
       <div className="now-playing">
  <h2>🎵 Now Playing</h2>

  <img
  src={currentSong.cover}
  alt={currentSong.title}
  className={`current-cover ${playing ? "playing" : ""}`}
/>

  <h3>{currentSong.title}</h3>
  <p>{currentSong.artist}</p>
</div>
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
    const newVolume = Number(e.target.value);

    setVolume(newVolume);

    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
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
  onChange={(e) => {
    const newProgress = e.target.value;

    setProgress(newProgress);

    if (audioRef.current) {
      audioRef.current.currentTime =
        (newProgress / 100) *
        audioRef.current.duration;
    }
  }}
/>
<h2>📊 Stats</h2>

<p>
  Total Listening Time:
  {" "}
  {Math.floor(totalListeningTime / 60)}
  min
</p>

<p>
  Favorites:
  {favorites.length}
</p>

<p>
  Playlists:
  {playlists.length}
</p>

<p>
  Songs Played:
  {Object.values(playCount).reduce(
    (a, b) => a + b,
    0
  )}
</p>


<h2>🔥 On Repeat</h2>

<div className="song-list">
  {topSongs.map(song => (
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

<h2>✨ Recommended For You</h2>

<div className="song-list">
  {recommendedSongs.map(song => (
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

<h2>➕ Add Song</h2>

<input
  placeholder="Title"
  value={newSongTitle}
  onChange={(e) =>
    setNewSongTitle(e.target.value)
  }
/>

<input
  placeholder="Artist"
  value={newSongArtist}
  onChange={(e) =>
    setNewSongArtist(e.target.value)
  }
/>

<input
  placeholder="Cover URL"
  value={newSongCover}
  onChange={(e) =>
    setNewSongCover(e.target.value)
  }
/>

<input
  placeholder="Audio URL"
  value={newSongAudio}
  onChange={(e) =>
    setNewSongAudio(e.target.value)
  }
/>

<button onClick={addSong}>
  Add Song
</button>

        <br />
        <br />

       <audio
  ref={audioRef}
  controls
  src={currentSong.audio}
  onEnded={nextSong}
  onTimeUpdate={() => {
    setProgress(
      ((audioRef.current?.currentTime || 0) /
        (audioRef.current?.duration || 1)) *
        100
    );
  }}
/>

<p>Favorites: {favorites.length}</p>

<p>Recently Played: {recentSongs.length}</p>

<p>Total Songs: {songs.length}</p>

<p>Playlists: {playlists.length}</p>

<p>
  Most Played:{" "}
  {mostPlayedSong
    ? mostPlayedSong.title
    : "None"}
</p>

<div className="player">
  🎵{" "}
  {playing
    ? `${currentSong.title} - ${currentSong.artist}`
    : "Paused"}

  {playing && (
    <div className="visualizer">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  )}
</div>

<h2>🎧 AI DJ</h2>

<div className="dj-box">
  {djMessage}
</div>

</div> {/* main */}
</div> {/* app */}
</>
);
}

export default App;