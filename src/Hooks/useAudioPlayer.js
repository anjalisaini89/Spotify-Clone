import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export function useAudioPlayer({
  songs,
  onSongPlayed,
}) {
  const audioRef = useRef(null);

  const [currentSong, setCurrentSong] =
    useState(null);

  const [playing, setPlaying] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [volume, setVolume] =
    useState(1);

  const [shuffle, setShuffle] =
    useState(false);

  const [queue, setQueue] =
    useState([]);

  useEffect(() => {
    if (songs.length && !currentSong) {
      setCurrentSong(songs[0]);
    }
  }, [songs, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = useCallback(async () => {
    if (!audioRef.current || !currentSong) {
      return;
    }

    try {
      await audioRef.current.play();

      setPlaying(true);

      onSongPlayed?.(currentSong);
    } catch (error) {
      console.error(
        "Unable to play song:",
        error
      );

      setPlaying(false);
    }
  }, [currentSong, onSongPlayed]);

  const pauseSong = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();

    setPlaying(false);
  }, []);

  const selectSong = useCallback(
    async (song) => {
      if (!song) return;

      setCurrentSong(song);
      setProgress(0);

      setTimeout(async () => {
        if (!audioRef.current) return;

        try {
          audioRef.current.currentTime = 0;

          await audioRef.current.play();

          setPlaying(true);

          onSongPlayed?.(song);
        } catch (error) {
          console.error(
            "Unable to play selected song:",
            error
          );

          setPlaying(false);
        }
      }, 100);
    },
    [onSongPlayed]
  );

  const nextSong = useCallback(() => {
    if (!songs.length || !currentSong) {
      return;
    }

    if (queue.length) {
      const next = queue[0];

      setQueue((previous) =>
        previous.slice(1)
      );

      selectSong(next);

      return;
    }

    if (shuffle) {
      let randomSong;

      do {
        randomSong =
          songs[
            Math.floor(
              Math.random() *
                songs.length
            )
          ];
      } while (
        songs.length > 1 &&
        randomSong.id === currentSong.id
      );

      selectSong(randomSong);

      return;
    }

    const index = songs.findIndex(
      (song) =>
        song.id === currentSong.id
    );

    const nextIndex =
      index === -1
        ? 0
        : (index + 1) % songs.length;

    selectSong(songs[nextIndex]);
  }, [
    songs,
    currentSong,
    queue,
    shuffle,
    selectSong,
  ]);

  const prevSong = useCallback(() => {
    if (!songs.length || !currentSong) {
      return;
    }

    const index = songs.findIndex(
      (song) =>
        song.id === currentSong.id
    );

    const previousIndex =
      index === -1
        ? 0
        : (index - 1 + songs.length) %
          songs.length;

    selectSong(songs[previousIndex]);
  }, [
    songs,
    currentSong,
    selectSong,
  ]);

  const addToQueue = useCallback((song) => {
    if (!song) return;

    setQueue((previous) => {
      if (
        previous.some(
          (item) => item.id === song.id
        )
      ) {
        return previous;
      }

      return [...previous, song];
    });
  }, []);

  const handleProgress = useCallback(() => {
    if (!audioRef.current) return;

    const {
      currentTime,
      duration,
    } = audioRef.current;

    if (!duration || Number.isNaN(duration)) {
      setProgress(0);
      return;
    }

    setProgress(
      (currentTime / duration) * 100
    );
  }, []);

  const handleSeek = useCallback((value) => {
    if (!audioRef.current) return;

    const duration =
      audioRef.current.duration;

    if (!duration || Number.isNaN(duration)) {
      return;
    }

    audioRef.current.currentTime =
      (Number(value) / 100) * duration;

    setProgress(Number(value));
  }, []);

  return {
    audioRef,

    currentSong,
    setCurrentSong,

    playing,

    progress,
    volume,
    setVolume,

    shuffle,
    setShuffle,

    queue,

    playSong,
    pauseSong,
    selectSong,
    nextSong,
    prevSong,

    addToQueue,

    handleProgress,
    handleSeek,
  };
}