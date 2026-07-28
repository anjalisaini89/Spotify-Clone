function MiniPlayer({
  currentSong,
  playing,
  playSong,
  pauseSong,
  prevSong,
  nextSong,
  progress,
  audioRef,
  volume,
  setVolume,
}) {
  return (
    <div className="mini-player">

      <img
        src={currentSong.cover}
        alt={currentSong.title}
        className="mini-cover"
      />

      <div className="mini-info">

        <h4>{currentSong.title}</h4>

        <p>{currentSong.artist}</p>

      </div>

      <button onClick={prevSong}>
        ⏮
      </button>

      <button
        onClick={
          playing
            ? pauseSong
            : playSong
        }
      >
        {playing ? "⏸" : "▶"}
      </button>

      <button onClick={nextSong}>
        ⏭
      </button>

      <input
        type="range"
        min="0"
        max="100"
        value={progress}
        readOnly
      />

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
  );
}

export default MiniPlayer;