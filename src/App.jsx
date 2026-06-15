import "./App.css";
import { useRef, useState } from "react";

function App() {
  const audioRef = useRef(null);

  const songs = [
    {
      id: 1,
      title: "One Dance",
      artist: "Drake",
      cover: "/covers/images.jpeg",
      audio:
        "/songs/u_mzp0jgj0y4-one-dance-instrumental-drake-2016instrumentals-420830.mp3",
    },
    {
      id: 2,
      title: "All In My Mind",
      artist: "Unknown",
      cover: "/covers/download.jpeg",
      audio:
        "/songs/Aled_Edwards_-_All_In_My_Mind_-_Jazz_Dream_Pop.mp3",
    },
    {
      id: 3,
      title: "Spring Mother",
      artist: "Instrumental",
      cover: "/covers/images (1).jpeg",
      audio:
        "/songs/ikoliks_aj-acoustic-spring-mothers-day-music-320427.mp3",
    },
  ];

  const [currentSong, setCurrentSong] = useState(songs[0]);
  const [playing, setPlaying] = useState(false);

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

    setTimeout(() => {
      audioRef.current.play();
      setPlaying(true);
    }, 100);
  };

  const nextSong = () => {
    const currentIndex = songs.findIndex(
      (song) => song.id === currentSong.id
    );

    const nextIndex =
      (currentIndex + 1) % songs.length;

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
      (currentIndex - 1 + songs.length) %
      songs.length;

    setCurrentSong(songs[prevIndex]);

    setTimeout(() => {
      audioRef.current.play();
      setPlaying(true);
    }, 100);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <h2>Spotify Clone</h2>

        <div className="menu-item">🏠 Home</div>
        <div className="menu-item">🔍 Search</div>
        <div className="menu-item">📚 Library</div>
      </div>

      <div className="main">
        <h1>Spotify Library</h1>

        <div className="song-list">
          {songs.map((song) => (
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

        <h2>Now Playing</h2>

        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="current-cover"
        />

        <h3>{currentSong.title}</h3>
        <p>{currentSong.artist}</p>

        <button onClick={prevSong}>⏮ Previous</button>

        <button onClick={playSong}>▶ Play</button>

        <button onClick={pauseSong}>⏸ Pause</button>

        <button onClick={nextSong}>⏭ Next</button>

        <br />
        <br />

        <audio
          ref={audioRef}
          controls
          src={currentSong.audio}
          onEnded={nextSong}
        />
      </div>

      <div className="player">
        🎵 {playing ? currentSong.title : "Paused"}
      </div>
    </div>
  );
}

export default App;