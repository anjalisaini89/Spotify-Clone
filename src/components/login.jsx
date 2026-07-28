const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const REDIRECT_URI = "http://localhost:5173/callback";

function Login() {

  const login = () => {

    window.location.href =
      `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
        REDIRECT_URI
      )}&scope=user-read-private user-read-email`;
  };

  return (
    <button
      className="login-btn"
      onClick={login}
    >
      Login with Spotify
    </button>
  );
}

export default Login;