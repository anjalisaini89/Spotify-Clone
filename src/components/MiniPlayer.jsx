function MiniPlayer({
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
}) {
  return (
    <div className="mini-player">

      <div className="mini-left">
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className="mini-cover"
        />

        <div className="mini-info">
          <h4>{currentSong.title}</h4>
          <p>{currentSong.artist}</p>
        </div>
      </div>

      <div className="mini-center">

        <div className="mini-buttons">
          <button onClick={prevSong}>⏮</button>

          <button
            onClick={playing ? pauseSong : playSong}
          >
            {playing ? "⏸" : "▶"}
          </button>

          <button onClick={nextSong}>⏭</button>
        </div>

        <div className="mini-progress">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) =>
              setProgress(e.target.value)
            }
          />
        </div>

      </div>

      <div className="mini-right">
        <span>🔊</span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            setVolume(e.target.value);

            if (audioRef.current) {
              audioRef.current.volume =
                e.target.value;
            }
          }}
        />
      </div>

    </div>
  );
}

export default MiniPlayer;