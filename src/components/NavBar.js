import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-title">
          CineVault
        </NavLink>

        <div className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            🏠 Home
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            ❤️ Favorites
          </NavLink>
          <NavLink
            to="/genre/action"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            💥 Action
          </NavLink>
          <NavLink
            to="/coming-soon"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            🎬 Coming Soon
          </NavLink>
        </div>

        <div className="navbar-icons">
          {localStorage.getItem("loggedIn") === "true" && (
            <button onClick={handleLogout} className="logout-button">
              <LogoutIcon fontSize="small" />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
