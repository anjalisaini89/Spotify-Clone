const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getSongs() {
  const response = await fetch(`${API_URL}/songs`);

  if (!response.ok) {
    throw new Error("Failed to fetch songs");
  }

  return response.json();
}

export async function getSong(id) {
  const response = await fetch(`${API_URL}/songs/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch song");
  }

  return response.json();
}