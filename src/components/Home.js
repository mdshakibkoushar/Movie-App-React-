import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../context/MovieContext";
import MovieItem from "./MovieItem";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import "./Home.css";

const API_KEY = "4e44d9029b1270a757cddc766a1bcb63";

// ── Category filter definitions ──
const CATEGORIES = [
  { id: "bollywood", label: "Bollywood Movies", section: "main" },
  { id: "dual", label: "Dual Audio Content", section: "main" },
  { id: "dual720", label: "Dual Audio 720P", section: "main" },
  { id: "hollywood", label: "Hollywood Movies", section: "main" },
  { id: "hwood1080", label: "Hollywood 1080P", section: "main" },
  { id: "telugu", label: "Telugu", section: "main" },
  { id: "pakistani", label: "Pakistani", section: "main" },
  { id: "28", label: "Action", section: "main" },
  { id: "12", label: "Adventure", section: "main" },
  { id: "16", label: "Animation", section: "main" },
  { id: "cartoon", label: "Cartoon", section: "main" },
  { id: "35", label: "Comedy", section: "main" },
  { id: "80", label: "Crime", section: "main" },
  { id: "99", label: "Documentary", section: "main" },
  { id: "18", label: "Drama", section: "main" },
  { id: "10751", label: "Family", section: "main" },
  { id: "14", label: "Fantasy", section: "main" },
  { id: "36", label: "History", section: "main" },
  { id: "27", label: "Horror", section: "main" },
  { id: "9648", label: "Mystery", section: "main" },
  { id: "10749", label: "Romance", section: "main" },
  { id: "53", label: "Thriller", section: "main" },
  { id: "10752", label: "War", section: "main" },
  { id: "webseries", label: "Web Series", section: "main" },
];

const Home = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("title");
  const [filterMode, setFilterMode] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [categoryLabel, setCategoryLabel] = useState("🔥 Popular Movies");
  const [loading, setLoading] = useState(false);

  const {
    movies,
    setMovies,
    setDetailedMovies,
    searchConfig,
    setSearchConfig,
  } = useContext(MovieContext);

  // ── Fisher-Yates shuffle ──
  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // ── Fetch movies based on current state ──
  const fetchMovies = async (
    page,
    query,
    mode,
    genreId,
    langCode,
    searchKw,
  ) => {
    setLoading(true);
    try {
      let url;
      if (query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}`;
      } else if (mode === "latest") {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`;
      } else if (genreId) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`;
      } else if (langCode) {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&with_original_language=${langCode}&sort_by=popularity.desc&page=${page}`;
      } else if (searchKw) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchKw)}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=${page}`;
      }
      const res = await axios.get(url);
      const results = shuffleArray(res.data.results);
      setMovies(results);
      setDetailedMovies(results);
      setTotalPages(Math.min(res.data.total_pages, 200));
    } catch (err) {
      console.error("Error fetching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Handle category click ──
  const handleCategoryClick = (cat) => {
    if (cat.isLink) {
      window.open(cat.href, "_blank");
      return;
    }
    setActiveCategory(cat.id);
    setCategoryLabel(cat.label);
    setCurrentPage(1);
    setIsSearching(false);
    setSearchQuery("");
    setShowFilter(false);

    const numericGenres = [
      "28",
      "12",
      "16",
      "35",
      "80",
      "99",
      "18",
      "10751",
      "14",
      "36",
      "27",
      "9648",
      "10749",
      "53",
      "10752",
    ];
    if (cat.id === "all") {
      fetchMovies(1, "", "popular");
      setFilterMode("popular");
    } else if (cat.id === "latest") {
      fetchMovies(1, "", "latest");
      setFilterMode("latest");
    } else if (cat.id === "bollywood") {
      fetchMovies(1, "", "popular", null, "hi");
      setFilterMode("category");
    } else if (cat.id === "dual" || cat.id === "dual720") {
      fetchMovies(1, "", "popular", null, null, "dual audio hindi");
      setFilterMode("category");
    } else if (cat.id === "hollywood" || cat.id === "hwood1080") {
      fetchMovies(1, "", "popular", null, "en");
      setFilterMode("category");
    } else if (cat.id === "telugu") {
      fetchMovies(1, "", "popular", null, "te");
      setFilterMode("category");
    }
    // else if (cat.id === "tamil") { fetchMovies(1,"","popular",null,"ta"); setFilterMode("category"); }
    else if (cat.id === "pakistani") {
      fetchMovies(1, "", "popular", null, "ur");
      setFilterMode("category");
    } else if (cat.id === "cartoon") {
      fetchMovies(1, "", "popular", "16");
      setFilterMode("category");
    } else if (cat.id === "webseries") {
      fetchMovies(1, "", "popular", null, null, "web series");
      setFilterMode("category");
    } else if (numericGenres.includes(cat.id)) {
      fetchMovies(1, "", "popular", cat.id);
      setFilterMode("category");
    }
  };

  // ── Initial load ──
  useEffect(() => {
    fetchMovies(1, "", "popular");
    // Fetch carousel
    axios
      .get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`,
      )
      .then((res) => {
        const withBackdrop = res.data.results.filter((m) => m.backdrop_path);
        setCarouselMovies(withBackdrop.slice(0, 10));
      })
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── React to searchConfig set by NavBar ──
  useEffect(() => {
    if (!searchConfig) return;

    const { query, filter } = searchConfig;

    if (query) {
      // Search mode — sort is applied client-side
      const sortVal =
        filter === "year" || filter === "rating" || filter === "title"
          ? filter
          : "title";
      setSearchQuery(query);
      setIsSearching(true);
      setSortBy(sortVal);
      setFilterMode("popular");
      setCurrentPage(1);
      fetchMovies(1, query, "popular");
    } else if (filter === "latest") {
      setSearchQuery("");
      setIsSearching(false);
      setSortBy("title");
      setFilterMode("latest");
      setCurrentPage(1);
      fetchMovies(1, "", "latest");
    } else if (filter === "title" || filter === "year" || filter === "rating") {
      setSearchQuery("");
      setIsSearching(false);
      setSortBy(filter);
      setFilterMode("popular");
      setCurrentPage(1);
      fetchMovies(1, "", "popular");
    } else {
      // "popular" / All
      setSearchQuery("");
      setIsSearching(false);
      setSortBy("title");
      setFilterMode("popular");
      setCurrentPage(1);
      fetchMovies(1, "", "popular");
    }

    // Reset so same config can be applied again if needed
    setSearchConfig(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchConfig]);

  // ── Auto-cycle carousel background ──
  useEffect(() => {
    if (carouselMovies.length === 0) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselMovies]);

  // ── Pagination ──
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMovies(newPage, isSearching ? searchQuery : "", filterMode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ── Sort movies client-side ──
  const getSortedMovies = () => {
    if (sortBy === "year")
      return [...movies].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date),
      );
    if (sortBy === "rating")
      return [...movies].sort((a, b) => b.vote_average - a.vote_average);
    // Default: keep original order from API
    return [...movies];
  };

  const displayedMovies = getSortedMovies();

  const sectionLabel = isSearching
    ? `Results for "${searchQuery}"${sortBy === "year" ? " · Newest First" : sortBy === "rating" ? " · Top Rated First" : ""}`
    : filterMode === "latest"
      ? "Latest Movies (Now Playing)"
      : sortBy === "year"
        ? "Popular Movies · Sorted by Newest"
        : sortBy === "rating"
          ? "Popular Movies · Top Rated First"
          : "All Popular Movies";

  return (
    <div className="home">
      {/* ── HERO ── */}
      <div className="home-hero">
        <div className="hero-bg-container">
          {carouselMovies.map((movie, idx) => (
            <div
              key={movie.id}
              className={`hero-bg-slide ${idx === bgIndex ? "active" : ""}`}
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
              }}
            />
          ))}
          <div className="hero-bg-overlay" />
        </div>

        <div className="hero-content">
          <h2 className="hero-heading">
            Discover <span>Amazing</span> Movies
          </h2>
          <p className="hero-subtext">
            Search from thousands of movies, explore genres and save your
            favorites
          </p>

          <div className="hero-dots">
            {carouselMovies.map((_, i) => (
              <span
                key={i}
                className={`hero-dot ${i === bgIndex ? "active" : ""}`}
                onClick={() => setBgIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* 5 Quick Filter Buttons — overlapping hero bottom (desktop) */}
        <div className="quick-filter-bar">
          {[
            { id: "all", label: "All" },
            { id: "rating", label: "Top Rated" },
            { id: "latest", label: "Latest" },
            { id: "year", label: "Newest" },
            { id: "comingsoon", label: "Coming Soon" },
          ].map((btn) => (
            <button
              key={btn.id}
              className={`quick-filter-btn ${activeCategory === "hero-" + btn.id ? "active" : ""}`}
              onClick={() => {
                if (btn.id === "comingsoon") {
                  navigate("/coming-soon");
                  return;
                }
                setActiveCategory("hero-" + btn.id);
                setCurrentPage(1);
                setIsSearching(false);
                setSearchQuery("");
                if (btn.id === "all") {
                  setSortBy("title");
                  setFilterMode("popular");
                  fetchMovies(1, "", "popular");
                }
                if (btn.id === "latest") {
                  setSortBy("title");
                  setFilterMode("latest");
                  fetchMovies(1, "", "latest");
                }
                if (btn.id === "rating") {
                  setSortBy("rating");
                  setFilterMode("popular");
                  fetchMovies(1, "", "popular");
                }
                if (btn.id === "year") {
                  setSortBy("year");
                  setFilterMode("popular");
                  fetchMovies(1, "", "popular");
                }
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* ── Category Pills — overlaid on hero (desktop) ── */}
        <div className="filter-bar category-pills-bar hero-category-pills">
          {CATEGORIES.map((cat, index) => (
            <button
              key={cat.id}
              className={`filter-pill ${activeCategory === cat.id ? "active" : ""} ${cat.isLink ? "link-pill" : ""} ${index >= 12 ? "mobile-hidden-pill" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile Filter Section (below hero, only visible on mobile) ── */}
      <div className="mobile-filter-section">
        {/* 5 Quick Buttons */}
        <div className="mobile-quick-filters">
          {[
            { id: "all", label: "All" },
            { id: "rating", label: "Top Rated" },
            { id: "latest", label: "Latest" },
            { id: "year", label: "Newest" },
            { id: "comingsoon", label: "Coming Soon" },
          ].map((btn) => (
            <button
              key={btn.id}
              className={`quick-filter-btn ${activeCategory === "hero-" + btn.id ? "active" : ""}`}
              onClick={() => {
                if (btn.id === "comingsoon") {
                  navigate("/coming-soon");
                  return;
                }
                setActiveCategory("hero-" + btn.id);
                setCurrentPage(1);
                setIsSearching(false);
                setSearchQuery("");
                if (btn.id === "all") {
                  setSortBy("title");
                  setFilterMode("popular");
                  fetchMovies(1, "", "popular");
                }
                if (btn.id === "latest") {
                  setSortBy("title");
                  setFilterMode("latest");
                  fetchMovies(1, "", "latest");
                }
                if (btn.id === "rating") {
                  setSortBy("rating");
                  setFilterMode("popular");
                  fetchMovies(1, "", "popular");
                }
                if (btn.id === "year") {
                  setSortBy("year");
                  setFilterMode("popular");
                  fetchMovies(1, "", "popular");
                }
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
        {/* Category Dropdown Toggle */}
        <div className="mobile-category-dropdown">
          <button
            className={`mobile-cat-toggle-btn ${showFilter ? "open" : ""}`}
            onClick={() => setShowFilter((prev) => !prev)}
          >
            <span>Categories</span>
            <span className="mobile-cat-arrow">{showFilter ? "▲" : "▼"}</span>
          </button>
          {showFilter && (
            <div className="mobile-category-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`filter-pill ${activeCategory === cat.id ? "active" : ""} ${cat.isLink ? "link-pill" : ""}`}
                  onClick={() => handleCategoryClick(cat)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Section Label ── */}
      <div className="section-title">
        {filterMode === "category" ? categoryLabel : sectionLabel}
      </div>

      {/* ── Loader ── */}
      {loading && (
        <div className="loader-overlay">
          <div className="loader-spinner">
            <div className="spinner-ring"></div>
            <p className="loader-text">Loading Movies...</p>
          </div>
        </div>
      )}

      {/* ── Movie Grid ── */}
      <div className={`movie-list${loading ? " movie-list--loading" : ""}`}>
        {!loading && displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))
        ) : !loading ? (
          <p className="no-movies">
            😕 No movies found. Try a different search or filter.
          </p>
        ) : null}
      </div>

      {/* ── Pagination ── */}
      <div className="pagination-controls">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <ArrowBackIosNew fontSize="small" />
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <ArrowForwardIos fontSize="small" />
        </button>
      </div>
    </div>
  );
};

export default Home;
