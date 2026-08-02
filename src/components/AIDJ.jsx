import { useState, useEffect } from "react";

function AIDJ({
  recommendedSongs = [],
  favorites = [],
  recentSongs = [],
  playCount = {},
  selectSong,
}) {
  const [message, setMessage] = useState("");
  const [pick, setPick] = useState(null);

  useEffect(() => {
    generateRecommendation();
  }, [recommendedSongs, favorites, recentSongs, playCount]);

  const generateRecommendation = () => {
    let text = "";
    let song = null;

    // AI Recommendation Priority
    if (recommendedSongs.length > 0) {
      song = recommendedSongs[
        Math.floor(Math.random() * recommendedSongs.length)
      ];

      text = `🎧 Since you enjoy ${song.artist}, I think you'll love "${song.title}".`;
    } else if (favorites.length > 0) {
      song = favorites[Math.floor(Math.random() * favorites.length)];

      text = `❤️ You're a fan of ${song.artist}. Let's listen to "${song.title}" again!`;
    } else if (recentSongs.length > 0) {
      song = recentSongs[0];

      text = `🕒 Continue where you left off with "${song.title}".`;
    } else {
      text =
        "🎵 Start playing songs and I'll learn your music taste!";
    }

    setMessage(text);
    setPick(song);
  };

  return (
    <div className="dj-box">

      <h2>🤖 Vibely AI DJ</h2>

      <p className="dj-message">{message}</p>

      {pick && (
        <div className="dj-card">

          <img
            src={pick.cover}
            alt={pick.title}
            className="dj-cover"
          />

          <div className="dj-info">

            <h3>{pick.title}</h3>

            <p>{pick.artist}</p>

            <button
              className="dj-play"
              onClick={() => selectSong(pick)}
            >
              ▶ Play Recommendation
            </button>

          </div>

        </div>
      )}

      <button
        className="dj-refresh"
        onClick={generateRecommendation}
      >
        🔄 New Recommendation
      </button>

    </div>
  );
}

export default AIDJ;