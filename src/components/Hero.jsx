function Hero({
  currentSong,
  playing,
  playSong,
}) {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <p className="hero-tag">
          ✨ Welcome Back
        </p>

        <h1 className="hero-title">
          Enjoy Your
          <span> Music Journey</span>
        </h1>

        <p className="hero-text">
          Discover trending music,
          create playlists,
          enjoy AI DJ recommendations,
          and experience Vibely.
        </p>

        <div className="hero-buttons">
          <button
            className="hero-btn primary"
            onClick={playSong}
          >
            ▶ Play Now
          </button>

          <button
            className="hero-btn secondary"
          >
            ❤️ Favorites
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img
          src={currentSong.cover}
          alt={currentSong.title}
          className={
            playing
              ? "hero-cover spinning"
              : "hero-cover"
          }
        />
      </div>
    </div>
  );
}

export default Hero;