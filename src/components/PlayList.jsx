function Playlist({
  playlists,
  playlistName,
  setPlaylistName,
  createPlaylist,
  deletePlaylist,
}) {
  return (
    <>
      <h2>📂 Create Playlist</h2>

      <div className="playlist-box">

        <input
          type="text"
          placeholder="Playlist Name"
          value={playlistName}
          onChange={(e) =>
            setPlaylistName(e.target.value)
          }
        />

        <button onClick={createPlaylist}>
          Create
        </button>

      </div>

      {playlists.map((playlist) => (

        <div
          key={playlist.id}
          className="playlist-card"
        >

          <h3>{playlist.name}</h3>

          <p>
            {playlist.songs.length} songs
          </p>

          <button
            onClick={() =>
              deletePlaylist(playlist.id)
            }
          >
            🗑 Delete
          </button>

        </div>

      ))}

    </>
  );
}

export default Playlist;