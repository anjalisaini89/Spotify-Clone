import SongCard from "./SongCard";

function SongList({
  title,
  songs,
  selectSong,
  favorites,
  toggleFavorite,
  addToQueue,
}) {
  if (!songs.length) return null;

  return (
    <>
      <h2>{title}</h2>

      <div className="song-list">

        {songs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            selectSong={selectSong}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            addToQueue={addToQueue}
          />
        ))}

      </div>
    </>
  );
}

export default SongList;