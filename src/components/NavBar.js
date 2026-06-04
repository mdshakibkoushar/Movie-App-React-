import React, { useState, useRef, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import { MovieContext } from "../context/MovieContext";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { setSearchConfig } = useContext(MovieContext);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to home first, then set the search config
    navigate("/");
    // Use setTimeout to ensure Home is mounted before config is set
    setTimeout(() => {
      setSearchConfig({ query: searchQuery.trim(), filter: "popular" });
    }, 50);
    setSearchQuery("");
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="imdb-navbar">
      <div className="imdb-navbar-inner">
        {/* ── LEFT: Hamburger + Logo ── */}
        <div className="imdb-left">
          {/* Hamburger Menu */}
          <div className="imdb-menu-wrap" ref={menuRef}>
            <button
              className="imdb-menu-btn"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <MenuIcon fontSize="small" />
              <span>Menu</span>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="imdb-dropdown">
                <div className="imdb-dropdown-header">
                  <span>Browse</span>
                  <button
                    className="imdb-dropdown-close"
                    onClick={() => setMenuOpen(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </div>
                <NavLink
                  to="/"
                  end
                  className="imdb-dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  🏠 Home
                </NavLink>
                <NavLink
                  to="/favorites"
                  className="imdb-dropdown-item"
                  onClick={() => setMenuOpen(false)}
                >
                  ❤️ Favorites
                </NavLink>
              </div>
            )}
          </div>

          {/* Logo */}
          <NavLink to="/" className="imdb-logo" aria-label="CineVault Home">
            CineVault
          </NavLink>
        </div>

        {/* ── CENTER: Search Bar with Filter ── */}
        <form className="imdb-search-form" onSubmit={handleSearch}>
          <div className="imdb-search-box">
            <input
              type="text"
              className="imdb-search-input"
              placeholder="Search movies, shows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              className="imdb-search-btn"
              aria-label="Search"
            >
              <SearchIcon />
            </button>
          </div>
        </form>

        {/* ── RIGHT: Nav Links + Logout ── */}
        <nav className="imdb-right">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "imdb-nav-link imdb-nav-active" : "imdb-nav-link"
            }
          >
            <span className="imdb-nav-text">Home</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              isActive ? "imdb-nav-link imdb-nav-active" : "imdb-nav-link"
            }
          >
            <span className="imdb-nav-text">Favorites</span>
          </NavLink>

          <div className="imdb-divider" />

          {localStorage.getItem("loggedIn") === "true" && (
            <button className="imdb-logout-btn" onClick={handleLogout}>
              <LogoutIcon fontSize="small" />
              <span>Sign Out</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
