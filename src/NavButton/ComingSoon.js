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
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let futureMovies = [];
      let apiPage = (page - 1) * 3 + 1;
      let maxApiPage = null;
      const seen = new Set();

      while (futureMovies.length < 20) {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=${apiPage}`,
        );

        if (maxApiPage === null) {
          maxApiPage = Math.min(res.data.total_pages, 60);
          setTotalPages(Math.max(1, Math.ceil(maxApiPage / 3)));
        }

        const results = res.data.results || [];
        results.forEach((movie) => {
          if (!seen.has(movie.id) && movie.release_date) {
            const releaseDate = new Date(movie.release_date);
            if (releaseDate > today) {
              seen.add(movie.id);
              futureMovies.push(movie);
            }
          }
        });

        apiPage++;
        if (apiPage > (page - 1) * 3 + 3 || apiPage > maxApiPage) break;
      }

      setMovies(futureMovies.slice(0, 20));
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

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBA";
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="cs-page">
      {trailerMovie && (
        <TrailerModal
          movieId={trailerMovie.id}
          movieTitle={trailerMovie.title}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      {/* ── HEADER ── */}
      <div className="cs-header">
        <div className="cs-header-inner">
          <h1 className="cs-heading">
            <span className="cs-heading-bar"></span>
            Most Anticipated Upcoming Movies
          </h1>
          <p className="cs-subheading">
            {movies.length > 0 && !loading
              ? `Showing ${movies.length} upcoming releases`
              : "Loading upcoming releases..."}
          </p>
        </div>
      </div>

      {/* ── ERROR ── */}
      {error && <p className="cs-error">⚠️ {error}</p>}

      {/* ── LOADING ── */}
      {loading && (
        <div className="cs-loading">
          <div className="cs-spinner"></div>
          <p>Fetching upcoming movies...</p>
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && movies.length === 0 && (
        <div className="cs-empty">
          <p>No upcoming movies found. Try next page.</p>
        </div>
      )}

      {/* ── MOVIE LIST (IMDB-style rows) ── */}
      {!loading && movies.length > 0 && (
        <div className="cs-list-wrap">
          <div className="cs-list">
            {movies.map((movie, index) => {
              const days = getDaysUntilRelease(movie.release_date);
              const releaseFormatted = formatDate(movie.release_date);

              return (
                <div key={movie.id} className="cs-row">
                  {/* Rank */}
                  <div className="cs-rank">
                    {(currentPage - 1) * 20 + index + 1}
                  </div>

                  {/* Poster */}
                  <div className="cs-row-poster-wrap">
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
                          : "https://via.placeholder.com/90x135/1a1a24/555?text=N/A"
                      }
                      alt={movie.title}
                      className="cs-row-poster"
                    />
                    {/* Play overlay on poster */}
                    <div
                      className="cs-row-play"
                      onClick={() =>
                        setTrailerMovie({ id: movie.id, title: movie.title })
                      }
                    >
                      <span className="cs-row-play-icon">▶</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="cs-row-info">
                    <Link to={`/movie/${movie.id}`} className="cs-row-title">
                      {movie.title}
                    </Link>

                    <div className="cs-row-meta">
                      {movie.release_date && (
                        <span className="cs-row-year">
                          {movie.release_date.slice(0, 4)}
                        </span>
                      )}
                      {movie.vote_average > 0 && (
                        <span className="cs-row-genre">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      )}
                      {days !== null && days > 0 && (
                        <span
                          className={`cs-row-days ${days <= 30 ? "soon" : ""}`}
                        >
                          {days === 1 ? "🔥 Tomorrow!" : `🕐 ${days} days`}
                        </span>
                      )}
                    </div>

                    <p className="cs-row-overview">
                      {movie.overview
                        ? movie.overview.slice(0, 200) +
                          (movie.overview.length > 200 ? "..." : "")
                        : "No description available."}
                    </p>

                    <div className="cs-row-date">
                      <span className="cs-row-date-label">Release Date:</span>
                      <span className="cs-row-date-val">
                        {releaseFormatted}
                      </span>
                    </div>

                    <div className="cs-row-actions">
                      <button
                        className="cs-btn-trailer"
                        onClick={() =>
                          setTrailerMovie({ id: movie.id, title: movie.title })
                        }
                      >
                        ▶ Watch Trailer
                      </button>
                      <Link
                        to={`/movie/${movie.id}`}
                        className="cs-btn-details"
                      >
                        + More Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PAGINATION ── */}
      {!loading && totalPages > 1 && (
        <div className="cs-pagination">
          <button
            className="cs-pg-btn"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ‹ Prev
          </button>
          <span className="cs-pg-info">
            Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
          </span>
          <button
            className="cs-pg-btn"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default ComingSoon;
