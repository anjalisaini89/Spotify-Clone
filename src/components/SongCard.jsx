function SongCard({
  song,
  selectSong,
  favorites,
  toggleFavorite,
  addToQueue,
}) {
  return (
    <div
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

      {toggleFavorite && (
        <div className="song-actions">

          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(song);
            }}
          >
            {favorites?.some(
              (f) => f.id === song.id
            )
              ? "❤️"
              : "🤍"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();

              addToQueue(song);
            }}
          >
            ➕ Queue
          </button>

        </div>
      )}
    </div>
  );
}

export default SongCard;