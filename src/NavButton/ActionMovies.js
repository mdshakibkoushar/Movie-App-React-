import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import TrailerModal from "../components/TrailerModal";
import "./ActionMovies.css";

const ActionMovies = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const { favorites, addFavorite, removeFavorite } = useContext(MovieContext);

  const fetchMovies = async (page = 1) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&with_genres=28&sort_by=popularity.desc&page=${page}`
      );
      if (response.data.results) {
        setMovies(response.data.results);
        setTotalPages(Math.min(response.data.total_pages, 200));
      }
    } catch (err) {
      setError("Failed to fetch movies");
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const handleSearch = async () => {
    if (!query.trim()) {
      fetchMovies(1);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&query=${query}`
      );
      if (response.data.results) {
        setMovies(response.data.results);
        setTotalPages(1);
        setError(null);
      }
    } catch (err) {
      setError("Failed to fetch search results");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleFavorite = (movie) => {
    const isAlready = favorites.some((f) => f.id === movie.id);
    isAlready ? removeFavorite(movie.id) : addFavorite(movie);
  };

  const isFav = (id) => favorites.some((f) => f.id === id);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="action-movies">
      {/* Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          movieId={trailerMovie.id}
          movieTitle={trailerMovie.title}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {/* Hero */}
      <div className="action-hero">
        <h1>💥 <span>Action</span> Movies</h1>
        <p>The best action-packed movies, handpicked for thrill-seekers</p>
        <div className="action-search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="🔍 Search action movies..."
          />
          <button onClick={handleSearch} className="search-button">
            Search
          </button>
        </div>
      </div>

      {/* Section label */}
      <div className="action-section-title">🔥 Popular Action Movies</div>

      {/* Error */}
      {error && <p className="error-message">⚠️ {error}</p>}

      {/* Movie Grid */}
      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-item">
              {/* Poster */}
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/300x450/141420/888?text=No+Image"
                }
                alt={movie.title}
                className="movie-poster"
              />

              {/* Play icon — hover pe dikhta hai, click se trailer khulta hai */}
              <div
                className="action-play-hint"
                onClick={() => setTrailerMovie({ id: movie.id, title: movie.title })}
              >
                ▶
              </div>

              {/* Rating badge */}
              <div className="movie-rating-badge">
                ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </div>

              {/* Hover overlay */}
              <div className="movie-item-overlay">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-release-date">
                  {movie.release_date ? movie.release_date.slice(0, 4) : "N/A"}
                </p>
                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`favorite-button ${isFav(movie.id) ? "favorited" : ""}`}
                >
                  {isFav(movie.id) ? "❤️ Unfavorite" : "🤍 Add Favorite"}
                </button>
                <Link to={`/movie/${movie.id}`} className="view-details-btn">
                  🎬 View Details
                </Link>
              </div>

              {/* Always-visible bottom */}
              <div className="movie-bottom-label">
                <h3>{movie.title}</h3>
              </div>
            </div>
          ))
        ) : (
          <p className="no-movies">😕 No movies found. Try a different search.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-controls">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ‹
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default ActionMovies;
