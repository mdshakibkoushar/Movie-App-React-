import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

/* ── Streaming Provider → Website URL map (TMDB provider IDs) ── */
const PROVIDER_URLS = {
  8: "https://www.netflix.com", // Netflix
  9: "https://www.amazon.com/Prime-Video", // Amazon Prime Video
  10: "https://www.amazon.com/Prime-Video", // Amazon Video
  15: "https://www.hulu.com", // Hulu
  29: "https://play.google.com/store/movies", // Google Play Movies
  2: "https://tv.apple.com", // Apple iTunes
  350: "https://tv.apple.com", // Apple TV+
  68: "https://www.microsoftstore.com", // Microsoft Store
  3: "https://play.google.com/store/movies", // Google Play
  192: "https://www.youtube.com/movies", // YouTube
  11: "https://www.mubi.com", // Mubi
  37: "https://www.fandangonow.com", // Fandango at Home
  78: "https://www.peacocktv.com", // Peacock
  386: "https://www.peacocktv.com", // Peacock Premium
  531: "https://www.paramountplus.com", // Paramount+
  387: "https://www.hbomax.com", // HBO Max
  384: "https://www.hbomax.com", // HBO
  283: "https://www.crunchyroll.com", // Crunchyroll
  190: "https://www.discoveryplus.com", // Discovery+
  43: "https://www.starz.com", // Starz
  526: "https://www.starz.com", // Starz Apple TV Channel
  39: "https://www.sundancenow.com", // Sundance Now
  100: "https://www.bet.com", // BET+
  175: "https://www.netflix.com", // Netflix Kids
  1796: "https://www.netflix.com", // Netflix basic with Ads
  2100: "https://www.jiocinema.com", // JioCinema
  237: "https://www.hotstar.com", // Disney+ Hotstar
  122: "https://www.hotstar.com", // Hotstar
  220: "https://www.hotstar.com", // Star Plus
  1892: "https://www.primevideo.com", // Prime Video (India)
  218: "https://www.sonyliv.com", // SonyLIV
  309: "https://www.zee5.com", // Zee5
  121: "https://www.voot.com", // Voot
  255: "https://www.erosnow.com", // Eros Now
  232: "https://www.mxplayer.in", // MX Player
  315: "https://www.disneyplus.com", // Disney+
};

/* ───────────────────────────────────────────────
   Movie Player Modal – uses vidsrc.sbs API
   Format: https://vidsrc.sbs/embed/movie/{tmdb_id}
─────────────────────────────────────────────── */
const MusicModal = ({ movieTitle, movieId, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const embedUrl = `https://vidsrc.sbs/embed/movie/${movieId}`;

  return (
    <div style={sm.backdrop} onClick={onClose}>
      <div
        style={{ ...sm.modal, maxWidth: "960px", width: "96vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={sm.header}>
          <h3 style={sm.title}>🎬 {movieTitle}</h3>
          <button style={sm.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Player – vidsrc.sbs embed by TMDB ID */}
        <div style={{ ...sm.body, minHeight: "500px" }}>
          <iframe
            key={movieId}
            style={{
              width: "100%",
              height: "100%",
              minHeight: "500px",
              display: "block",
              border: "none",
            }}
            src={embedUrl}
            title={movieTitle}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Info bar */}
        <div
          style={{
            padding: "10px 16px",
            background: "rgba(0,0,0,0.5)",
            borderTop: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#555" }}>
            Powered by vidsrc.sbs • TMDB ID: {movieId}
          </span>
          <span
            style={{ fontSize: "0.72rem", color: "#444", fontStyle: "italic" }}
          >
            Press Escape or click outside to close
          </span>
        </div>
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

  const [justWatchLink, setJustWatchLink] = useState("");

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
        // Watch providers — prefer IN, fallback to US or first available
        const results = providersRes.data.results;
        const region =
          results?.IN || results?.US || Object.values(results || {})[0];
        // TMDB provides a JustWatch link per region — use it for exact movie redirect
        const tmdbLink = region?.link || "";
        setJustWatchLink(tmdbLink);
        // Collect all provider types with labels
        const seen = new Set();
        const combined = [];
        const addProviders = (list, type) => {
          (list || []).forEach((p) => {
            if (!seen.has(p.provider_id)) {
              seen.add(p.provider_id);
              combined.push({ ...p, streamType: type });
            }
          });
        };
        addProviders(region?.flatrate, "Stream");
        addProviders(region?.free, "Free");
        addProviders(region?.ads, "Free (Ads)");
        addProviders(region?.rent, "Rent");
        addProviders(region?.buy, "Buy");
        setWatchProviders(combined.slice(0, 10));
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
      justWatchLink={justWatchLink}
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
  justWatchLink,
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
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#666",
                    margin: "-6px 0 12px",
                    fontStyle: "italic",
                  }}
                >
                  Click on a platform to watch this movie
                </p>
                <div style={s.providersRow}>
                  {watchProviders.map((p) => {
                    // Priority: provider's own site → JustWatch movie page → search fallback
                    const directUrl = PROVIDER_URLS[p.provider_id];
                    const providerUrl = directUrl
                      ? directUrl
                      : justWatchLink
                        ? justWatchLink
                        : `https://www.justwatch.com/in/search?q=${encodeURIComponent(movie.title)}`;
                    // Badge color by stream type
                    const badgeColor =
                      p.streamType === "Stream"
                        ? "#4caf50"
                        : p.streamType === "Free" ||
                            p.streamType === "Free (Ads)"
                          ? "#2196F3"
                          : p.streamType === "Rent"
                            ? "#FF9800"
                            : p.streamType === "Buy"
                              ? "#9C27B0"
                              : "#666";
                    return (
                      <a
                        key={p.provider_id}
                        href={providerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={s.providerItem}
                        title={`${p.streamType || "Watch"} on ${p.provider_name}`}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-4px) scale(1.08)";
                          e.currentTarget.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.opacity = "0.9";
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <img
                            src={`https://image.tmdb.org/t/p/w92${p.logo_path}`}
                            alt={p.provider_name}
                            style={s.providerLogo}
                          />
                          {p.streamType && (
                            <span
                              style={{
                                position: "absolute",
                                bottom: "-6px",
                                left: "50%",
                                transform: "translateX(-50%)",
                                background: badgeColor,
                                color: "#fff",
                                fontSize: "0.55rem",
                                fontWeight: 700,
                                padding: "1px 5px",
                                borderRadius: "4px",
                                whiteSpace: "nowrap",
                                letterSpacing: "0.3px",
                              }}
                            >
                              {p.streamType}
                            </span>
                          )}
                        </div>
                        <span style={{ ...s.providerName, marginTop: "8px" }}>
                          {p.provider_name}
                        </span>
                      </a>
                    );
                  })}
                </div>
                {/* JustWatch link for all options */}
                {justWatchLink && (
                  <a
                    href={justWatchLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "14px",
                      color: "#e50914",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      opacity: 0.85,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                      e.currentTarget.style.textDecoration = "underline";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0.85";
                      e.currentTarget.style.textDecoration = "none";
                    }}
                  >
                    🔍 See all options on JustWatch →
                  </a>
                )}
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

/* ───────────────────────────────────────────────
   Social Media Modal – shows social links for cast
─────────────────────────────────────────────── */
const SocialModal = ({ actor, socialLinks, onClose }) => {
  const photo = actor.profile_path
    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
    : "https://via.placeholder.com/100x150/1a1a2e/888?text=?";

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const platforms = [
    {
      key: "instagram_id",
      label: "Instagram",
      url: (id) => `https://www.instagram.com/${id}`,
      icon: "📸",
      color: "#E1306C",
      bg: "linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)",
    },
    {
      key: "twitter_id",
      label: "X (Twitter)",
      url: (id) => `https://twitter.com/${id}`,
      icon: "🐦",
      color: "#1DA1F2",
      bg: "linear-gradient(135deg,#1DA1F2,#0d8ed4)",
    },
    {
      key: "facebook_id",
      label: "Facebook",
      url: (id) => `https://www.facebook.com/${id}`,
      icon: "👤",
      color: "#1877F2",
      bg: "linear-gradient(135deg,#1877F2,#0d5bbd)",
    },
    {
      key: "tiktok_id",
      label: "TikTok",
      url: (id) => `https://www.tiktok.com/@${id}`,
      icon: "🎵",
      color: "#010101",
      bg: "linear-gradient(135deg,#010101,#69C9D0)",
    },
    {
      key: "youtube_id",
      label: "YouTube",
      url: (id) => `https://www.youtube.com/${id}`,
      icon: "▶️",
      color: "#FF0000",
      bg: "linear-gradient(135deg,#FF0000,#cc0000)",
    },
    {
      key: "imdb_id",
      label: "IMDb",
      url: (id) => `https://www.imdb.com/name/${id}`,
      icon: "🎬",
      color: "#F5C518",
      bg: "linear-gradient(135deg,#F5C518,#d4a800)",
    },
  ];

  const availableLinks = platforms.filter(
    (p) => socialLinks && socialLinks[p.key],
  );
  const hasLinks = availableLinks.length > 0;

  return (
    <div style={soc.backdrop} onClick={onClose}>
      <div style={soc.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button style={soc.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Actor Info */}
        <div style={soc.actorHeader}>
          <img src={photo} alt={actor.name} style={soc.actorPhoto} />
          <div style={soc.actorInfo}>
            <h3 style={soc.actorName}>{actor.name}</h3>
            <p style={soc.actorChar}>as {actor.character || "—"}</p>
            <p style={soc.socialTitle}>🌐 Social Media</p>
          </div>
        </div>

        {/* Social Links */}
        <div style={soc.linksContainer}>
          {hasLinks ? (
            availableLinks.map((platform) => (
              <a
                key={platform.key}
                href={platform.url(socialLinks[platform.key])}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...soc.linkBtn, background: platform.bg }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "translateY(-3px) scale(1.03)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(0,0,0,0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(0,0,0,0.3)";
                }}
              >
                <span style={soc.linkIcon}>{platform.icon}</span>
                <span style={soc.linkLabel}>{platform.label}</span>
                <span style={soc.linkArrow}>→</span>
              </a>
            ))
          ) : (
            <div style={soc.noLinks}>
              <span style={{ fontSize: "2rem" }}>😔</span>
              <p
                style={{ color: "#888", margin: "8px 0 0", fontSize: "0.9rem" }}
              >
                No social media links available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CastCard = ({ actor }) => {
  const [showSocial, setShowSocial] = useState(false);
  const [socialLinks, setSocialLinks] = useState(null);
  const [loadingSocial, setLoadingSocial] = useState(false);
  const [hovered, setHovered] = useState(false);

  const photo = actor.profile_path
    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
    : "https://via.placeholder.com/100x150/1a1a2e/888?text=?";

  const handlePhotoClick = async () => {
    setShowSocial(true);
    if (socialLinks === null) {
      setLoadingSocial(true);
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/person/${actor.id}/external_ids?api_key=4e44d9029b1270a757cddc766a1bcb63`,
        );
        setSocialLinks(res.data);
      } catch {
        setSocialLinks({});
      } finally {
        setLoadingSocial(false);
      }
    }
  };

  return (
    <>
      {showSocial &&
        (loadingSocial ? (
          <div style={soc.backdrop} onClick={() => setShowSocial(false)}>
            <div
              style={{
                ...soc.modal,
                alignItems: "center",
                justifyContent: "center",
                minHeight: "220px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button style={soc.closeBtn} onClick={() => setShowSocial(false)}>
                ✕
              </button>
              <div style={s.spinner}></div>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>
                Loading social media...
              </p>
            </div>
          </div>
        ) : (
          <SocialModal
            actor={actor}
            socialLinks={socialLinks}
            onClose={() => setShowSocial(false)}
          />
        ))}
      <div style={s.castCard}>
        <div
          style={{
            ...soc.photoWrapper,
            transform: hovered ? "scale(1.07)" : "scale(1)",
            transition: "transform 0.2s ease",
            boxShadow: hovered ? "0 8px 24px rgba(229,9,20,0.5)" : "none",
          }}
          onClick={handlePhotoClick}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          title="Click to see social media"
        >
          <img src={photo} alt={actor.name} style={s.castPhoto} />
          <div style={{ ...soc.photoOverlay, opacity: hovered ? 1 : 0 }}>
            <span style={soc.overlayIcon}>🌐</span>
          </div>
        </div>
        <p style={s.castName}>{actor.name}</p>
        <p style={s.castChar}>{actor.character || ""}</p>
      </div>
    </>
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
    cursor: "pointer",
    textDecoration: "none",
    opacity: "0.9",
    transition: "all 0.2s ease",
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

/* ── Social Media Modal Styles ── */
const soc = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
  },
  modal: {
    position: "relative",
    background: "#141420",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "380px",
    overflow: "hidden",
    boxShadow: "0 30px 80px rgba(0,0,0,0.9)",
    padding: "24px",
  },
  closeBtn: {
    position: "absolute",
    top: "14px",
    right: "14px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "#fff",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "0.95rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  actorHeader: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  actorPhoto: {
    width: "70px",
    height: "95px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "2px solid rgba(229,9,20,0.4)",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
    flexShrink: 0,
  },
  actorInfo: { flex: 1, minWidth: 0 },
  actorName: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#fff",
    margin: "0 0 4px",
  },
  actorChar: {
    fontSize: "0.78rem",
    color: "#888",
    fontStyle: "italic",
    margin: "0 0 8px",
  },
  socialTitle: {
    fontSize: "0.8rem",
    color: "#e50914",
    fontWeight: 600,
    margin: 0,
  },
  linksContainer: { display: "flex", flexDirection: "column", gap: "10px" },
  linkBtn: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
    cursor: "pointer",
  },
  linkIcon: { fontSize: "1.2rem", flexShrink: 0 },
  linkLabel: { flex: 1 },
  linkArrow: { fontSize: "1rem", opacity: 0.8 },
  noLinks: {
    textAlign: "center",
    padding: "24px 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  photoWrapper: {
    position: "relative",
    cursor: "pointer",
    borderRadius: "10px",
    overflow: "hidden",
    width: "80px",
    height: "110px",
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(229,9,20,0.75)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0,
    transition: "opacity 0.2s ease",
    borderRadius: "10px",
  },
  overlayIcon: { fontSize: "1.6rem" },
};

export default MovieDetails;
