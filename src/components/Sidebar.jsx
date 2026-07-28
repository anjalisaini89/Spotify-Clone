import {
  FaHome,
  FaSearch,
  FaMusic,
  FaHeart,
  FaList,
  FaMoon,
  FaSun,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import Login from "./Login";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activePage,
  setActivePage,
  theme,
  setTheme,
}) {
  return (
    <div
      className={`sidebar ${
        sidebarOpen ? "sidebar-open" : "sidebar-collapsed"
      }`}
    >
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <div className="sidebar-logo">
        🎧 {sidebarOpen && "Vibely"}
      </div>

      {sidebarOpen && <Login />}

      <div
        className={`menu-item ${activePage === "home" ? "active" : ""}`}
        onClick={() => setActivePage("home")}
      >
        <FaHome />
        {sidebarOpen && <span>Home</span>}
      </div>

      <div
        className={`menu-item ${activePage === "search" ? "active" : ""}`}
        onClick={() => setActivePage("search")}
      >
        <FaSearch />
        {sidebarOpen && <span>Search</span>}
      </div>

      <div
        className={`menu-item ${activePage === "library" ? "active" : ""}`}
        onClick={() => setActivePage("library")}
      >
        <FaMusic />
        {sidebarOpen && <span>Library</span>}
      </div>

      <div
        className={`menu-item ${activePage === "favorites" ? "active" : ""}`}
        onClick={() => setActivePage("favorites")}
      >
        <FaHeart />
        {sidebarOpen && <span>Favorites</span>}
      </div>

      <div
        className={`menu-item ${activePage === "playlists" ? "active" : ""}`}
        onClick={() => setActivePage("playlists")}
      >
        <FaList />
        {sidebarOpen && <span>Playlists</span>}
      </div>

      <div
        className="menu-item"
        onClick={() =>
          setTheme(theme === "dark" ? "light" : "dark")
        }
      >
        {theme === "dark" ? <FaSun /> : <FaMoon />}

        {sidebarOpen && (
          <span>
            {theme === "dark"
              ? "Light Mode"
              : "Dark Mode"}
          </span>
        )}
      </div>
    </div>
  );
}

export default Sidebar;