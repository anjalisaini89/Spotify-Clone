import "./MiniPlayer.css";

export default function MiniPlayer({
  currentSong,
  playing,
  playSong,
  pauseSong,
  prevSong,
  nextSong,
  progress,
  setProgress,
  audioRef,
  volume,
  setVolume,
  favorites,
  toggleFavorite,
}) {

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec.toString().padStart(2,"0")}`;
  };

  return (
    <div className="mini-player">

      {/* Left */}

      <div className="mini-left">

        <img
          src={currentSong.cover}
          alt=""
          className="mini-cover"
        />

        <div>

          <h4>{currentSong.title}</h4>

          <p>{currentSong.artist}</p>

        </div>

      </div>

      {/* Center */}

      <div className="mini-center">

        <div className="mini-buttons">

          <button onClick={prevSong}>⏮</button>

          <button onClick={playing ? pauseSong : playSong}>
            {playing ? "⏸" : "▶"}
          </button>

          <button onClick={nextSong}>⏭</button>

        </div>

        <div className="mini-progress">

          <span>
            {formatTime(audioRef.current?.currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e)=>{
              setProgress(e.target.value);

              if(audioRef.current){

                audioRef.current.currentTime =
                (e.target.value/100)*
                audioRef.current.duration;

              }

            }}
          />

          <span>
            {formatTime(audioRef.current?.duration)}
          </span>

        </div>

      </div>

      {/* Right */}

      <div className="mini-right">

        <button
          onClick={()=>toggleFavorite(currentSong)}
        >
          {favorites.some(f=>f.id===currentSong.id)
            ? "❤️"
            : "🤍"}
        </button>

        <span>🔊</span>

        <input
          type="range"
          min="0"
          max="1"
          step=".05"
          value={volume}
          onChange={(e)=>{

            setVolume(Number(e.target.value));

            audioRef.current.volume =
            Number(e.target.value);

          }}
        />

      </div>

    </div>
  );
}