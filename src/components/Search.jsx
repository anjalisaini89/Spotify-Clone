function Search({
  search,
  setSearch,
}) {
  return (
    <div className="search-container">

      <span>🔍</span>

      <input
        className="search-bar"
        type="text"
        placeholder="Search songs or artists..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

    </div>
  );
}

export default Search;