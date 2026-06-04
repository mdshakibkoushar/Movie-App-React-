import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

/* ───────────────────────────────────────────────
   Music Modal – shows Song 1/2/3/4 + real TMDB
   video names, plays each inline via YouTube embed
─────────────────────────────────────────────── */
const FIXED_SONGS = [
  { key: "fixed-1", name: "Song 1", type: "Song", fixed: true, index: 0 },
  { key: "fixed-2", name: "Song 2", type: "Song", fixed: true, index: 1 },
  { key: "fixed-3", name: "Song 3", type: "Song", fixed: true, index: 2 },
  { key: "fixed-4", name: "Song 4", type: "Song", fixed: true, index: 3 },
];

const MusicModal = ({ movieTitle, movieId, onClose }) => {
  const [tmdbVideos, setTmdbVideos] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null); // { key, name, fixed?, index? }

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (activeVideo) setActiveVideo(null);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, activeVideo]);

  // Fetch real video names from TMDB
  useEffect(() => {
    setLoadingList(true);
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`,
      )
      .then((res) => {
        const all = (res.data.results || [])
          .filter((v) => v.site === "YouTube")
          .slice(0, 8)
          .map((v) => ({
            key: v.key,
            name: v.name,
            type: v.type,
            fixed: false,
          }));
        setTmdbVideos(all);
        setLoadingList(false);
      })
      .catch(() => {
        setTmdbVideos([]);
        setLoadingList(false);
      });
  }, [movieId]);

  // Resolve embed key for active video
  const embedKey = activeVideo
    ? activeVideo.fixed
      ? tmdbVideos[activeVideo.index % Math.max(tmdbVideos.length, 1)]?.key ||
        null
      : activeVideo.key
    : null;

  // All items to display = fixed songs + tmdb videos
  const allItems = [...FIXED_SONGS, ...tmdbVideos];

  return (
    <div
      style={sm.backdrop}
      onClick={() => {
        if (activeVideo) setActiveVideo(null);
        else onClose();
      }}
    >
      <div
        style={{
          ...sm.modal,
          maxWidth: activeVideo ? "860px" : "500px",
          transition: "max-width 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={sm.header}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: 0,
            }}
          >
            {activeVideo && (
              <button style={sm.backBtn} onClick={() => setActiveVideo(null)}>
                ←
              </button>
            )}
            <h3 style={sm.title}>
              🎵 {movieTitle}
              {activeVideo ? ` — ${activeVideo.name}` : " — Songs"}
            </h3>
          </div>
          <button style={sm.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Song list: Song 1-4 always shown + TMDB videos below */}
        {!activeVideo && (
          <div style={sm.songList}>
            {/* Fixed Song 1-4 always visible */}
            {FIXED_SONGS.map((video, i) => (
              <button
                key={video.key}
                style={{
                  ...sm.songRow,
                  borderLeft: "3px solid rgba(229,9,20,0.5)",
                }}
                onClick={() => setActiveVideo(video)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(229,9,20,0.18)";
                  e.currentTarget.style.borderColor = "#e50914";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(229,9,20,0.5)";
                }}
              >
                <span style={sm.songNum}>{i + 1}</span>
                <span style={sm.songIcon}>🎵</span>
                <span style={sm.songName}>{video.name}</span>
                <span style={sm.songType}>{video.type}</span>
                <span style={sm.playIcon}>▶</span>
              </button>
            ))}

            {/* Divider */}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                margin: "8px 0 12px",
              }}
            />

            {/* TMDB videos below */}
            {loadingList && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px 4px",
                  color: "#666",
                  fontSize: "0.85rem",
                }}
              >
                <div
                  style={{
                    ...sm.spinner,
                    width: "18px",
                    height: "18px",
                    borderWidth: "2px",
                  }}
                ></div>
                Loading more videos...
              </div>
            )}
            {!loadingList &&
              tmdbVideos.map((video, i) => (
                <button
                  key={video.key}
                  style={{ ...sm.songRow }}
                  onClick={() => setActiveVideo(video)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(229,9,20,0.18)";
                    e.currentTarget.style.borderColor = "#e50914";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.08)";
                  }}
                >
                  <span style={sm.songNum}>{FIXED_SONGS.length + i + 1}</span>
                  <span style={sm.songIcon}>🎬</span>
                  <span style={sm.songName}>{video.name}</span>
                  <span style={sm.songType}>{video.type}</span>
                  <span style={sm.playIcon}>▶</span>
                </button>
              ))}
          </div>
        )}

        {/* Player area */}
        {activeVideo && (
          <div style={sm.body}>
            {embedKey ? (
              <iframe
                style={sm.iframe}
                src={`https://www.youtube.com/embed/${embedKey}?autoplay=1&rel=0`}
                title={activeVideo.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div style={sm.loadingBox}>
                <p style={{ color: "#aaa", margin: 0 }}>
                  😕 No video available for this movie.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const sm = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.88)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modal: {
    background: "#141420",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(229,9,20,0.08)",
  },
  title: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    maxWidth: "380px",
  },
  backBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  closeBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  songList: { padding: "16px", maxHeight: "420px", overflowY: "auto" },
  songRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "12px 16px",
    marginBottom: "8px",
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s ease",
    fontFamily: "inherit",
  },
  songNum: {
    fontSize: "0.75rem",
    color: "#666",
    minWidth: "20px",
    textAlign: "right",
    flexShrink: 0,
  },
  songIcon: { fontSize: "1.1rem", flexShrink: 0 },
  songName: {
    flex: 1,
    fontSize: "0.95rem",
    fontWeight: 600,
    color: "#fff",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  songType: {
    fontSize: "0.7rem",
    color: "#888",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "6px",
    padding: "2px 8px",
    flexShrink: 0,
  },
  playIcon: { fontSize: "0.85rem", color: "#e50914", flexShrink: 0 },
  body: {
    position: "relative",
    width: "100%",
    aspectRatio: "16/9",
    background: "#0a0a0f",
    minHeight: "280px",
  },
  iframe: {
    width: "100%",
    height: "100%",
    display: "block",
    border: "none",
    minHeight: "280px",
  },
  loadingBox: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid rgba(229,9,20,0.2)",
    borderTop: "4px solid #e50914",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

const MovieDetails = () => {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [director, setDirector] = useState("");
  const [cast, setCast] = useState([]);
  const [watchProviders, setWatchProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieRes, creditsRes, providersRes] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${imdbID}?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${imdbID}/credits?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`,
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${imdbID}/watch/providers?api_key=4e44d9029b1270a757cddc766a1bcb63`,
          ),
        ]);
        setMovie(movieRes.data);
        const dir = creditsRes.data.crew.find((m) => m.job === "Director");
        setDirector(dir ? dir.name : "Unknown");
        setCast(creditsRes.data.cast.slice(0, 6));
        // Watch providers
        const results = providersRes.data.results;
        const region =
          results?.IN || results?.US || Object.values(results || {})[0];
        const providers = region?.flatrate || region?.buy || region?.rent || [];
        setWatchProviders(providers.slice(0, 6));
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

  return (
    <MovieDetailsView
      movie={movie}
      director={director}
      cast={cast}
      watchProviders={watchProviders}
      onBack={() => navigate(-1)}
    />
  );
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
    <button style={s.backBtn} onClick={onBack}>
      ← Go Back
    </button>
  </div>
);

const MovieDetailsView = ({
  movie,
  director,
  cast,
  watchProviders,
  onBack,
}) => {
  const [showMusicModal, setShowMusicModal] = useState(false);

  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450/141420/888?text=No+Image";

  const hours = Math.floor((movie.runtime || 0) / 60);
  const minutes = (movie.runtime || 0) % 60;
  const runtime = movie.runtime ? `${hours}h ${minutes}m` : "N/A";

  const ratingColor =
    movie.vote_average >= 7
      ? "#4caf50"
      : movie.vote_average >= 5
        ? "#f5c518"
        : "#e50914";

  return (
    <div style={s.page}>
      {/* Music Modal */}
      {showMusicModal && (
        <MusicModal
          movieTitle={movie.title}
          movieId={movie.id}
          onClose={() => setShowMusicModal(false)}
        />
      )}

      {/* Backdrop */}
      {backdropUrl && (
        <div style={{ ...s.backdrop, backgroundImage: `url(${backdropUrl})` }}>
          <div style={s.backdropOverlay}></div>
        </div>
      )}

      {/* Back button */}
      <div style={s.topBar}>
        <button style={s.backBtn} onClick={onBack}>
          ← Back
        </button>
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

            {/* Play Music Button */}
            <div style={s.section}>
              <button
                style={s.playMusicBtn}
                onClick={() => setShowMusicModal(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg,#c0392b,#922b21)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 28px rgba(229,9,20,0.55)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    "linear-gradient(135deg,#e50914,#c0392b)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 16px rgba(229,9,20,0.35)";
                }}
              >
                {/* Animated play circle */}
                <span style={s.playCircle}>▶</span>
                {/* Icons + label */}
                <span
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    lineHeight: 1.2,
                  }}
                >
                  {/* <span style={{ fontSize: "0.7rem", opacity: 0.8, letterSpacing: "0.5px" }}>🎬 &nbsp;Watch &amp; Listen</span> */}
                  <span style={{ fontSize: "1rem", fontWeight: 800 }}>
                    Play
                  </span>
                </span>
              </button>
            </div>

            {/* Meta row */}
            <div style={s.metaRow}>
              {movie.release_date && (
                <span style={s.metaChip}>
                  📅{" "}
                  {new Date(movie.release_date).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              <span style={s.metaChip}>⏱ {runtime}</span>
              {movie.genres &&
                movie.genres.map((g) => (
                  <span key={g.id} style={s.genreChip}>
                    {g.name}
                  </span>
                ))}
            </div>

            {/* Overview */}
            <div style={s.section}>
              <h3 style={s.sectionTitle}>Overview</h3>
              <p style={s.overview}>
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Details grid */}
            <div style={s.detailGrid}>
              <DetailItem label="Director" value={director} />
              <DetailItem
                label="Language"
                value={(movie.original_language || "").toUpperCase()}
              />
              <DetailItem label="Status" value={movie.status} />
              <DetailItem
                label="Release Date"
                value={
                  movie.release_date
                    ? new Date(movie.release_date).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "N/A"
                }
              />
              <DetailItem
                label="Box Office"
                value={
                  movie.revenue ? `$${movie.revenue.toLocaleString()}` : "N/A"
                }
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

            {/* Watch On */}
            {watchProviders && watchProviders.length > 0 && (
              <div style={s.section}>
                <h3 style={s.sectionTitle}>🎬 Watch On</h3>
                <div style={s.providersRow}>
                  {watchProviders.map((p) => (
                    <div
                      key={p.provider_id}
                      style={s.providerItem}
                      title={p.provider_name}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                        alt={p.provider_name}
                        style={s.providerLogo}
                      />
                      <span style={s.providerName}>{p.provider_name}</span>
                    </div>
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
  page: {
    minHeight: "100vh",
    background: "#0a0a0f",
    position: "relative",
    paddingBottom: "60px",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "420px",
    backgroundSize: "cover",
    backgroundPosition: "center top",
  },
  backdropOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(10,10,15,0.4) 0%, rgba(10,10,15,0.85) 70%, #0a0a0f 100%)",
  },
  topBar: { position: "relative", zIndex: 10, padding: "24px 32px 0" },
  backBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: 600,
    fontFamily: "inherit",
    transition: "all 0.2s",
  },
  content: {
    position: "relative",
    zIndex: 5,
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px 32px 0",
  },
  mainLayout: {
    display: "flex",
    gap: "40px",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
  posterCol: {
    flexShrink: 0,
    width: "260px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  poster: {
    width: "100%",
    borderRadius: "14px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
    border: "2px solid rgba(255,255,255,0.08)",
  },
  ratingCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    border: "3px solid",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
  },
  ratingScore: { fontSize: "1.4rem", fontWeight: 700, lineHeight: 1 },
  ratingLabel: { fontSize: "0.7rem", color: "#888" },
  infoCol: { flex: 1, minWidth: "280px" },
  title: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "8px",
    lineHeight: 1.2,
  },
  tagline: {
    fontSize: "1rem",
    color: "#e50914",
    fontStyle: "italic",
    marginBottom: "20px",
  },
  playMusicBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "14px",
    background: "linear-gradient(135deg,#e50914,#c0392b)",
    border: "none",
    color: "#fff",
    padding: "10px 24px 10px 10px",
    borderRadius: "50px",
    cursor: "pointer",
    fontFamily: "inherit",
    boxShadow: "0 4px 16px rgba(229,9,20,0.35)",
    transition: "all 0.2s ease",
  },
  playCircle: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.2)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    flexShrink: 0,
    boxShadow: "0 0 0 2px rgba(255,255,255,0.15)",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "28px",
  },
  metaChip: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "0.82rem",
    color: "#ccc",
  },
  genreChip: {
    background: "rgba(229,9,20,0.15)",
    border: "1px solid rgba(229,9,20,0.3)",
    borderRadius: "20px",
    padding: "5px 14px",
    fontSize: "0.82rem",
    color: "#ff6b6b",
  },
  section: { marginBottom: "28px" },
  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#e50914",
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  overview: { fontSize: "0.95rem", color: "#bbb", lineHeight: 1.7 },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "28px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "20px",
  },
  detailItem: { display: "flex", flexDirection: "column", gap: "4px" },
  detailLabel: {
    fontSize: "0.75rem",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  detailValue: { fontSize: "0.92rem", color: "#ddd", fontWeight: 500 },
  castGrid: { display: "flex", gap: "14px", flexWrap: "wrap" },
  castCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    width: "90px",
  },
  castPhoto: {
    width: "80px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  castName: {
    fontSize: "0.75rem",
    color: "#ddd",
    fontWeight: 600,
    textAlign: "center",
    margin: 0,
  },
  castChar: {
    fontSize: "0.68rem",
    color: "#888",
    textAlign: "center",
    margin: 0,
    fontStyle: "italic",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    gap: "20px",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(229,9,20,0.2)",
    borderTop: "4px solid #e50914",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { color: "#888", fontSize: "1rem" },
  errorWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    gap: "20px",
  },
  errorText: { color: "#ff6b6b", fontSize: "1.1rem" },
  providersRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "center",
  },
  providerItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
    cursor: "default",
  },
  providerLogo: {
    width: "56px",
    height: "56px",
    borderRadius: "12px",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.12)",
    boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
  },
  providerName: {
    fontSize: "0.7rem",
    color: "#aaa",
    textAlign: "center",
    maxWidth: "70px",
    lineHeight: 1.3,
  },
};

export default MovieDetails;
