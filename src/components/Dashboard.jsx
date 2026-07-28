function Dashboard({
  totalListeningTime,
  favorites,
  playlists,
  playCount,
  mostPlayedSong,
}) {
  return (
    <div className="stats-grid">

      <div className="stat-card">
        <h3>⏱ Listen Time</h3>

        <p>
          {Math.floor(totalListeningTime / 60)} min
        </p>
      </div>

      <div className="stat-card">
        <h3>❤️ Favorites</h3>

        <p>{favorites.length}</p>
      </div>

      <div className="stat-card">
        <h3>📂 Playlists</h3>

        <p>{playlists.length}</p>
      </div>

      <div className="stat-card">
        <h3>🎵 Songs Played</h3>

        <p>
          {Object.values(playCount).reduce(
            (a, b) => a + b,
            0
          )}
        </p>
      </div>

      <div className="stat-card">
        <h3>🔥 Top Track</h3>

        <p>
          {mostPlayedSong?.title || "None"}
        </p>
      </div>

    </div>
  );
}

export default Dashboard;