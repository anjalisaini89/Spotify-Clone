function UploadSong({
  newSongTitle,
  setNewSongTitle,
  newSongArtist,
  setNewSongArtist,
  newSongCover,
  setNewSongCover,
  newSongAudio,
  setNewSongAudio,
  addSong,
}) {
  return (
    <>
      <h2>➕ Upload Song</h2>

      <div className="upload-box">

        <input
          placeholder="Song Title"
          value={newSongTitle}
          onChange={(e) =>
            setNewSongTitle(e.target.value)
          }
        />

        <input
          placeholder="Artist"
          value={newSongArtist}
          onChange={(e) =>
            setNewSongArtist(e.target.value)
          }
        />

        <input
          placeholder="Cover URL"
          value={newSongCover}
          onChange={(e) =>
            setNewSongCover(e.target.value)
          }
        />

        <input
          placeholder="Audio URL"
          value={newSongAudio}
          onChange={(e) =>
            setNewSongAudio(e.target.value)
          }
        />

        <button onClick={addSong}>
          Upload Song
        </button>

      </div>
    </>
  );
}

export default UploadSong;