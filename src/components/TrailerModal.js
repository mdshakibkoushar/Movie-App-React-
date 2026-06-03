import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrailerModal.css";

const TrailerModal = ({ movieId, movieTitle, onClose }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US`
        );
        const videos = res.data.results;
        // Find official trailer first, then any teaser/trailer
        const trailer =
          videos.find(
            (v) => v.type === "Trailer" && v.site === "YouTube" && v.official
          ) ||
          videos.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
          videos.find((v) => v.site === "YouTube");

        if (trailer) {
          setTrailerKey(trailer.key);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTrailer();
  }, [movieId]);

  // Close on ESC key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="trailer-backdrop" onClick={onClose}>
      <div className="trailer-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="trailer-header">
          <h3 className="trailer-title">🎬 {movieTitle}</h3>
          <button className="trailer-close" onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className="trailer-body">
          {loading && (
            <div className="trailer-loading">
              <div className="trailer-spinner"></div>
              <p>Loading trailer...</p>
            </div>
          )}
          {!loading && error && (
            <div className="trailer-error">
              <p>😕 Trailer not available for this movie.</p>
              <button className="trailer-close-btn" onClick={onClose}>Close</button>
            </div>
          )}
          {!loading && trailerKey && (
            <iframe
              className="trailer-iframe"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
              title={`${movieTitle} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
