import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const MovieDetails = () => {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, creditsRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/${imdbID}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`),
          axios.get(`https://api.themoviedb.org/3/movie/${imdbID}/credits?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`),
        ]);
        setMovie(movieRes.data);
        const dir = creditsRes.data.crew.find((m) => m.job === "Director");
        setDirector(dir ? dir.name : "Unknown");
        setCast(creditsRes.data.cast.slice(0, 6));
      } catch (err) {
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [imdbID]);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onBack={() => navigate(-1)} />;
  if (!movie) return null;

  return <MovieDetailsView movie={movie} director={director} cast={cast} onBack={() => navigate(-1)} />;
};

const LoadingScreen = () => (
  <div style={s.loadingWrap}>
    <div style={s.spinner}></div>
    <p style={s.loadingText}>Loading movie details...</p>
  </div>
);

const ErrorScreen = ({ message, onBack }) => (
  <div style={s.errorWrap}>
    <p style={s.errorText}>⚠️ {message}</p>
    <button style={s.backBtn} onClick={onBack}>← Go Back</button>
  </div>
);

const MovieDetailsView = ({ movie, director, cast, onBack }) => {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450/141420/888?text=No+Image";

  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;
  const runtime = movie.runtime ? `${hours}h ${minutes}m` : "N/A";

  const ratingColor = movie.vote_average >= 7 ? "#4caf50" : movie.vote_average >= 5 ? "#f5c518" : "#e50914";

  return (
    <div style={s.page}>
      {/* Backdrop */}
      {backdropUrl && (
        <div style={{ ...s.backdrop, backgroundImage: `url(${backdropUrl})` }}>
          <div style={s.backdropOverlay}></div>
        </div>
      )}

      {/* Back button */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={onBack}>← Back</button>
      </div>

      {/* Main content */}
      <div style={s.content}>
        <div style={s.mainLayout}>
          {/* Left: Poster */}
          <div style={s.posterCol}>
            <img src={posterUrl} alt={movie.title} style={s.poster} />
            <div style={{ ...s.ratingCircle, borderColor: ratingColor }}>
              <span style={{ ...s.ratingScore, color: ratingColor }}>
                {movie.vote_average ? movie.vote_average.toFixed(1) : "N/A"}
              </span>
              <span style={s.ratingLabel}>/ 10</span>
            </div>
          </div>

          {/* Right: Info */}
          <div style={s.infoCol}>
            <h1 style={s.title}>{movie.title}</h1>
            {movie.tagline && <p style={s.tagline}>"{movie.tagline}"</p>}

            {/* Meta row */}
            <div style={s.metaRow}>
              {movie.release_date && (
                <span style={s.metaChip}>
                  📅 {new Date(movie.release_date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              )}
              <span style={s.metaChip}>⏱ {runtime}</span>
              {movie.genres && movie.genres.map((g) => (
                <span key={g.id} style={s.genreChip}>{g.name}</span>
              ))}
            </div>

            {/* Overview */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>Overview</h3>
              <p style={s.overview}>{movie.overview || "No overview available."}</p>
            </div>

            {/* Details grid */}
            <div style={s.detailGrid}>
              <DetailItem label="Director" value={director} />
              <DetailItem label="Language" value={(movie.original_language || "").toUpperCase()} />
              <DetailItem label="Status" value={movie.status} />
              <DetailItem
                label="Release Date"
                value={
                  movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
                    : "N/A"
                }
              />
              <DetailItem
                label="Box Office"
                value={movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"}
              />
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div style={s.section}>
                <h3 style={s.sectionTitle}>Top Cast</h3>
                <div style={s.castGrid}>
                  {cast.map((actor) => (
                    <CastCard key={actor.id} actor={actor} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <div style={s.detailItem}>
    <span style={s.detailLabel}>{label}</span>
    <span style={s.detailValue}>{value || "N/A"}</span>
  </div>
);

const CastCard = ({ actor }) => {
  const photo = actor.profile_path
    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
    : "https://via.placeholder.com/100x150/1a1a2e/888?text=?";
  return (
    <div style={s.castCard}>
      <img src={photo} alt={actor.name} style={s.castPhoto} />
      <p style={s.castName}>{actor.name}</p>
      <p style={s.castChar}>{actor.character || ""}</p>
    </div>
  );
};

const s = {
  page: { minHeight: "100vh", background: "#0a0a0f", position: "relative", paddingBottom: "60px" },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0, height: "420px", backgroundSize: "cover", backgroundPosition: "center top" },
  backdropOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.85) 70%, #0a0a0f 100%)" },
  topBar: { position: "relative", zIndex: 10, padding: "24px 32px 0" },
  backBtn: { background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, fontFamily: "inherit", transition: "all 0.2s" },
  content: { position: "relative", zIndex: 5, maxWidth: "1200px", margin: "0 auto", padding: "32px 32px 0" },
  mainLayout: { display: "flex", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" },
  posterCol: { flexShrink: 0, width: "260px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" },
  poster: { width: "100%", borderRadius: "14px", boxShadow: "0 20px 60px rgba(0,0,0,0.8)", border: "2px solid rgba(255,255,255,0.08)" },
  ratingCircle: { width: "80px", height: "80px", borderRadius: "50%", border: "3px solid", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" },
  ratingScore: { fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 },
  ratingLabel: { fontSize: "0.7rem", color: "#888" },
  infoCol: { flex: 1, minWidth: "280px" },
  title: { fontSize: "2.2rem", fontWeight: 700, color: "#fff", marginBottom: "8px", lineHeight: 1.2 },
  tagline: { fontSize: "1rem", color: "#e50914", fontStyle: "italic", marginBottom: "20px" },
  metaRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" },
  metaChip: { background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "20px", padding: "5px 14px", fontSize: "0.82rem", color: "#ccc" },
  genreChip: { background: "rgba(229,9,20,0.15)", border: "1px solid rgba(229,9,20,0.3)", borderRadius: "20px", padding: "5px 14px", fontSize: "0.82rem", color: "#ff6b6b" },
  section: { marginBottom: "28px" },
  sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: "#e50914", marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" },
  overview: { fontSize: "0.95rem", color: "#bbb", lineHeight: 1.7 },
  detailGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "28px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "20px" },
  detailItem: { display: "flex", flexDirection: "column", gap: "4px" },
  detailLabel: { fontSize: "0.75rem", color: "#666", textTransform: "uppercase", letterSpacing: "0.8px" },
  detailValue: { fontSize: "0.92rem", color: "#ddd", fontWeight: 500 },
  castGrid: { display: "flex", gap: "14px", flexWrap: "wrap" },
  castCard: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", width: "90px" },
  castPhoto: { width: "80px", height: "110px", objectFit: "cover", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)" },
  castName: { fontSize: "0.75rem", color: "#ddd", fontWeight: 600, textAlign: "center", margin: 0 },
  castChar: { fontSize: "0.68rem", color: "#888", textAlign: "center", margin: 0, fontStyle: "italic" },
  loadingWrap: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0f", gap: "20px" },
  spinner: { width: "48px", height: "48px", border: "4px solid rgba(229,9,20,0.2)", borderTop: "4px solid #e50914", borderRadius: "50%", animation: "spin 0.8s linear infinite" },
  loadingText: { color: "#888", fontSize: "1rem" },
  errorWrap: { minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#0a0a0f", gap: "20px" },
  errorText: { color: "#ff6b6b", fontSize: "1.1rem" },
};

export default MovieDetails;
