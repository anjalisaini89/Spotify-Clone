export const getRecommendations = (songs, favorites) => {

  if (!favorites.length) {

    return songs.slice(0, 8);

  }

  return songs.filter(
    (song) =>
      favorites.some(
        (fav) => fav.artist === song.artist
      ) &&
      !favorites.some(
        (fav) => fav.id === song.id
      )
  );
};