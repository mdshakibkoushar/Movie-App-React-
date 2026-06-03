import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import TrailerModal from "./TrailerModal";
import "./MovieItem.css";

const MovieItem = ({ movie }) => {
  const { favorites, addFavorite, removeFavorite } = useContext(MovieContext);
  const isFavorite = favorites.some((fav) => fav.id === movie.id);
  const [showTrailer, setShowTrailer] = useState(false);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isFavorite) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;

    return Array.from({ length: totalStars }, (_, index) => {
      if (index < fullStars) {
        return <span key={index} className="star filled">★</span>;
      } else if (index === fullStars && halfStar) {
        return <span key={index} className="star half-filled">★</span>;
      } else {
        return <span key={index} className="star">★</span>;
      }
    });
  };

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450/141420/888?text=No+Image";

  return (
    <>
      {showTrailer && (
        <TrailerModal
          movieId={movie.id}
          movieTitle={movie.title}
          onClose={() => setShowTrailer(false)}
        />
      )}
      <div className="movie-item">
        {/* Poster image */}
        <img
          src={posterUrl}
          alt={movie.title}
          className="movie-poster"
        />

        {/* Play icon — visible on hover, click opens trailer */}
        <div
          className="movie-play-hint"
          onClick={() => setShowTrailer(true)}
        >
          ▶
        </div>

        {/* Rating badge - top left */}
        <div className="rating-badge">
          ⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
        </div>

        {/* Favorite badge - top right */}
        {isFavorite && <div className="fav-badge">❤️</div>}

        {/* Hover overlay with details + actions */}
        <div className="movie-overlay">
          <div className="movie-info">
            <h2>{movie.title}</h2>
            <p className="movie-year">{releaseYear}</p>
            <div className="rating">{renderStars(movie.vote_average)}</div>
          </div>

          <div className="movie-actions">
            <button
              onClick={handleFavoriteClick}
              className={`favorite-button ${isFavorite ? "active" : ""}`}
            >
              {isFavorite ? "❤️ Unfavorite" : "🤍 Add Favorite"}
            </button>
            <Link to={`/movie/${movie.id}`} className="view-details">
              🎬 View Details
            </Link>
          </div>
        </div>

        {/* Always-visible bottom info */}
        <div className="movie-bottom">
          <h2 style={{ fontSize: "0.82rem", color: "#fff", margin: 0, fontWeight: 600, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>
            {movie.title}
          </h2>
          <p style={{ fontSize: "0.72rem", color: "#999", margin: "2px 0 0" }}>
            {releaseYear}
          </p>
        </div>
      </div>
    </>
  );
};

export default MovieItem;
