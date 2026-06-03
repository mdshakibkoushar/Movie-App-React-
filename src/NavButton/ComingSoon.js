import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TrailerModal from "../components/TrailerModal";
import "./ComingSoon.css";

const ComingSoon = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [trailerMovie, setTrailerMovie] = useState(null);

  const API_KEY = "4e44d9029b1270a757cddc766a1bcb63";

  const fetchUpcoming = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch 2 pages at once and merge to ensure we always have 20 movies
      const [res1, res2] = await Promise.all([
        axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page}`
        ),
        axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${page + 1}`
        ).catch(() => ({ data: { results: [] } })),
      ]);

      const combined = [
        ...(res1.data.results || []),
        ...(res2.data.results || []),
      ];

      // Remove duplicates by id
      const seen = new Set();
      const unique = combined.filter((m) => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });

      // Show up to 20 movies per page
      setMovies(unique.slice(0, 20));
      setTotalPages(Math.min(res1.data.total_pages, 20));
    } catch (err) {
      setError("Failed to fetch upcoming movies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getDaysUntilRelease = (dateStr) => {
    if (!dateStr) return null;
    const today = new Date();
    const release = new Date(dateStr);
    const diff = Math.ceil((release - today) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="coming-soon-page">
      {/* Trailer Modal */}
      {trailerMovie && (
        <TrailerModal
          movieId={trailerMovie.id}
          movieTitle={trailerMovie.title}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {/* Hero */}
      <div className="cs-hero">
        <div className="cs-hero-badge">🎬 Coming Soon</div>
        <h1>
          Upcoming <span>Movies</span>
        </h1>
        <p>Get ready! These blockbusters are hitting theaters soon.</p>
      </div>

      {/* Error */}
      {error && <p className="cs-error">⚠️ {error}</p>}

      {/* Loading */}
      {loading && (
        <div className="cs-loading">
          <div className="cs-spinner"></div>
          <p>Loading upcoming movies...</p>
        </div>
      )}

      {/* Movie Grid */}
      {!loading && movies.length === 0 && (
        <div className="cs-loading">
          <p style={{ color: "#888", fontSize: "1.1rem" }}>😕 No upcoming movies found on this page. Try next page.</p>
        </div>
      )}

      {!loading && movies.length > 0 && (
        <div className="cs-grid">
          {movies.map((movie) => {
            const days = getDaysUntilRelease(movie.release_date);
            const releaseYear = movie.release_date
              ? movie.release_date.slice(0, 4)
              : "TBA";
            const releaseFormatted = movie.release_date
              ? new Date(movie.release_date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "TBA";

            return (
              <div key={movie.id} className="cs-card">
                {/* Poster */}
                <div className="cs-poster-wrap">
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "https://via.placeholder.com/300x450/141420/888?text=No+Image"
                    }
                    alt={movie.title}
                    className="cs-poster"
                  />

                  {/* Days badge */}
                  {days !== null && days > 0 && (
                    <div className={`cs-days-badge ${days <= 30 ? "soon" : ""}`}>
                      {days === 1 ? "Tomorrow!" : `${days} days`}
                    </div>
                  )}
                  {/* Play Button */}
                  <div
                    className="cs-play-btn"
                    onClick={() => setTrailerMovie({ id: movie.id, title: movie.title })}
                  >
                    ▶
                  </div>

                  <div className="cs-overlay">
                    <h3 className="cs-overlay-title">{movie.title}</h3>
                    <p className="cs-overlay-date">📅 {releaseFormatted}</p>
                    <p className="cs-overlay-overview">
                      {movie.overview
                        ? movie.overview.slice(0, 100) + "..."
                        : "No description available."}
                    </p>
                    <Link to={`/movie/${movie.id}`} className="cs-details-btn">
                      🎬 View Details
                    </Link>
                  </div>
                </div>

                {/* Bottom info */}
                <div className="cs-card-bottom">
                  <h3 className="cs-card-title">{movie.title}</h3>
                  <p className="cs-card-date">📅 {releaseFormatted}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="cs-pagination">
          <button
            className="cs-page-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="cs-page-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
