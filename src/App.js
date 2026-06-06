import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import MovieDetails from "./components/MovieDetails";
import Favorites from "./components/Favorites";
import NavBar from "./components/NavBar";
import ActionMovies from "./NavButton/ActionMovies";
import ComingSoon from "./NavButton/ComingSoon";
import { MovieProvider } from "./context/MovieContext";
import Footer from "./components/Footer";
import "./App.css";

const AppContent = () => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <NavBar />
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/genre/:genre" element={<Home />} />
          <Route path="/genre/action" element={<ActionMovies />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/movie/:imdbID" element={<MovieDetails />} />
        </Routes>
      </main>
      <Footer />
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
