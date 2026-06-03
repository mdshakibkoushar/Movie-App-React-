import React, { useContext } from "react";
import { MovieContext } from "../context/MovieContext";
import { Link } from "react-router-dom";

const Favorites = () => {
  const { favorites, removeFavorite } = useContext(MovieContext);

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h1 style={s.heading}>
          ❤️ My <span style={s.accent}>Favorites</span>
        </h1>
        <p style={s.subheading}>
          {favorites.length > 0
            ? `${favorites.length} movie${favorites.length > 1 ? "s" : ""} saved`
            : "Your watchlist is empty"}
        </p>
      </div>

      {/* Grid or Empty State */}
      {favorites.length > 0 ? (
        <div style={s.grid}>
          {favorites.map((movie) => (
            <FavoriteCard
              key={movie.id}
              movie={movie}
              onRemove={() => removeFavorite(movie.id)}
            />
          ))}
        </div>
      ) : (
        <div style={s.emptyState}>
          <div style={s.emptyIcon}>🎬</div>
          <h2 style={s.emptyTitle}>No favorites yet</h2>
          <p style={s.emptyText}>
            Browse movies and click the heart to save them here.
          </p>
          <Link to="/" style={s.browseBtn}>
            Explore Movies →
          </Link>
        </div>
      )}
    </div>
  );
};

const FavoriteCard = ({ movie, onRemove }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450/141420/888?text=No+Image";

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "N/A";

  return (
    <div style={s.card}>
      <div style={s.posterWrap}>
        <img src={posterUrl} alt={movie.title} style={s.poster} />
        {movie.vote_average && (
          <div style={s.ratingBadge}>
            ⭐ {movie.vote_average.toFixed(1)}
          </div>
        )}
        <div style={s.cardOverlay}>
          <Link to={`/movie/${movie.id}`} style={s.detailsBtn}>
            🎬 View Details
          </Link>
          <button style={s.removeBtn} onClick={onRemove}>
            🗑️ Remove
          </button>
        </div>
      </div>
      <div style={s.cardInfo}>
        <h3 style={s.cardTitle}>{movie.title}</h3>
        <p style={s.cardYear}>{releaseYear}</p>
      </div>
    </div>
  );
};

const s = {
  page: {
    minHeight: "calc(100vh - 68px)",
    background: "#0a0a0f",
    padding: "0 0 60px",
  },
  header: {
    background: "linear-gradient(180deg, rgba(229,9,20,0.08) 0%, transparent 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "48px 32px 36px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "8px",
  },
  accent: {
    background: "linear-gradient(135deg, #e50914, #ff6b6b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subheading: {
    fontSize: "0.95rem",
    color: "#888",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "20px",
    maxWidth: "1400px",
    margin: "40px auto 0",
    padding: "0 24px",
  },
  card: {
    borderRadius: "12px",
    overflow: "hidden",
    background: "#141420",
    border: "1px solid rgba(255,255,255,0.06)",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },
  posterWrap: {
    position: "relative",
    aspectRatio: "2/3",
    overflow: "hidden",
  },
  poster: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.4s ease",
  },
  ratingBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    background: "rgba(0,0,0,0.75)",
    backdropFilter: "blur(4px)",
    borderRadius: "6px",
    padding: "4px 8px",
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#f5c518",
    zIndex: 2,
  },
  cardOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "14px",
    gap: "8px",
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  detailsBtn: {
    display: "block",
    textAlign: "center",
    padding: "9px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "0.8rem",
    fontWeight: 600,
    textDecoration: "none",
  },
  removeBtn: {
    width: "100%",
    padding: "9px",
    background: "rgba(229,9,20,0.2)",
    border: "1px solid rgba(229,9,20,0.4)",
    borderRadius: "8px",
    color: "#ff6b6b",
    fontSize: "0.8rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  cardInfo: {
    padding: "12px 12px 14px",
  },
  cardTitle: {
    fontSize: "0.88rem",
    fontWeight: 600,
    color: "#fff",
    margin: "0 0 4px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    lineHeight: 1.4,
  },
  cardYear: {
    fontSize: "0.76rem",
    color: "#888",
    margin: 0,
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "50vh",
    gap: "16px",
    padding: "60px 24px",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: "8px",
  },
  emptyTitle: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#fff",
  },
  emptyText: {
    fontSize: "0.95rem",
    color: "#888",
    maxWidth: "300px",
  },
  browseBtn: {
    marginTop: "8px",
    padding: "14px 32px",
    background: "linear-gradient(135deg, #e50914, #c0392b)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 4px 20px rgba(229,9,20,0.4)",
    transition: "all 0.3s ease",
  },
};

// Add CSS hover effect via a style tag approach (inline style limitations for :hover)
// We'll add it via a global class injection approach
const styleTag = document.createElement("style");
styleTag.innerHTML = `
  .fav-card:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
  .fav-card:hover .fav-overlay { opacity: 1 !important; }
  .fav-card:hover img { transform: scale(1.05); }
`;
if (!document.head.querySelector("#fav-styles")) {
  styleTag.id = "fav-styles";
  document.head.appendChild(styleTag);
}

export default Favorites;
