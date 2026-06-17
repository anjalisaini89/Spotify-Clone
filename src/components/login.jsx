const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

function Login() {
  const login = () => {
    alert("NEW CODE RUNNING");

    const redirectUri = "http://localhost:5173/callback";
console.log("Using CODE auth");
    window.location.href =
  `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(redirectUri)}` +
  `&scope=user-read-private user-read-email`;
  };

  return <button onClick={login}>Login with Spotify</button>;
}

export default Login