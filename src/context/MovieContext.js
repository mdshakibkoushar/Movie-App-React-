import React, { createContext, useState } from "react";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [detailedMovies, setDetailedMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // searchConfig is set by NavBar and consumed by Home
  // { query: "", filter: "popular" | "latest" | "title" | "year" | "rating" }
  const [searchConfig, setSearchConfig] = useState(null);

  const addFavorite = (movie) => {
    setFavorites((prevFavorites) => [...prevFavorites, movie]);
  };

  const removeFavorite = (id) => {
    setFavorites((prevFavorites) =>
      prevFavorites.filter((movie) => movie.id !== id),
    );
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        setMovies,
        detailedMovies,
        setDetailedMovies,
        favorites,
        addFavorite,
        removeFavorite,
        searchConfig,
        setSearchConfig,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
