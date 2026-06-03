import React from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import Favorites from "./components/Favorites";
import NavBar from "./components/NavBar";
import Login from "./components/Login";
import ActionMovies from "./NavButton/ActionMovies";
import ComingSoon from "./NavButton/ComingSoon";
import { MovieProvider } from "./context/MovieContext";
import Footer from "./components/Footer";
import "./App.css";

const AppContent = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {isLoggedIn && location.pathname !== "/login" && <NavBar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/favorites"
            element={isLoggedIn ? <Favorites /> : <Navigate to="/login" />}
          />
          <Route
            path="/genre/:genre"
            element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/genre/action"
            element={isLoggedIn ? <ActionMovies /> : <Navigate to="/login" />}
          />
          <Route
            path="/coming-soon"
            element={isLoggedIn ? <ComingSoon /> : <Navigate to="/login" />}
          />
          <Route
            path="/movie/:imdbID"
            element={isLoggedIn ? <MovieDetails /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      {isLoggedIn && location.pathname !== "/login" && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <MovieProvider>
      <AppContent />
    </MovieProvider>
    // this structure allows us to keep the MovieProvider at the top level while managing the routing and authentication logic separately in AppContent.git
  );
};

export default App;
