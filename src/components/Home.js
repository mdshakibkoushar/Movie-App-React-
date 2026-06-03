import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { MovieContext } from "../context/MovieContext";
import MovieItem from "./MovieItem";
import SearchIcon from "@mui/icons-material/Search";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [filterMode, setFilterMode] = useState("popular"); // "popular" | "latest" | "sort"
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [carouselMovies, setCarouselMovies] = useState([]);
  const [bgIndex, setBgIndex] = useState(0);
  const { movies, setMovies, setDetailedMovies } = useContext(MovieContext);

  const fetchMovies = async (page = 1, searchQuery = "", mode = filterMode) => {
    try {
      let url;
      if (searchQuery) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&query=${searchQuery}&page=${page}`;
      } else if (mode === "latest") {
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&page=${page}`;
      }
      const response = await axios.get(url);
      setMovies(response.data.results);
      setDetailedMovies(response.data.results);
      setTotalPages(Math.min(response.data.total_pages, 200));
    } catch (err) {
      console.error("Error fetching movies:", err);
    }
  };

  const fetchCarouselMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=4e44d9029b1270a757cddc766a1bcb63&language=en-US&page=1`
      );
      // Only keep movies that have a backdrop image
      const withBackdrop = response.data.results.filter((m) => m.backdrop_path);
      setCarouselMovies(withBackdrop.slice(0, 10));
    } catch (err) {
      console.error("Error fetching carousel movies:", err);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchCarouselMovies();
  }, []);

  // Auto-cycle background movie every 3 seconds
  useEffect(() => {
    if (carouselMovies.length === 0) return;
    const timer = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % carouselMovies.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselMovies]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value === "") {
      setIsSearching(false);
      fetchMovies(1);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setIsSearching(!!query.trim());
    fetchMovies(1, query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSelectChange = (e) => {
    const value = e.target.value;
    if (value === "latest") {
      setFilterMode("latest");
      setSortBy("title");
      setCurrentPage(1);
      setIsSearching(false);
      setQuery("");
      fetchMovies(1, "", "latest");
    } else if (value.includes("Sort by")) {
      const newSort = value.split(": ")[1].toLowerCase();
      setSortBy(newSort);
      setFilterMode("popular");
    } else {
      // "all" / popular
      setSortBy("title");
      setFilterMode("popular");
      setCurrentPage(1);
      fetchMovies(1, "", "popular");
    }
  };

  const filteredAndSortedMovies = () => {
    return [...movies].sort((a, b) => {
      if (sortBy === "year") {
        return new Date(b.release_date) - new Date(a.release_date);
      } else if (sortBy === "rating") {
        return b.vote_average - a.vote_average;
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchMovies(newPage, query, filterMode);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const displayedMovies = filteredAndSortedMovies();
  const currentBgMovie = carouselMovies[bgIndex];
  const sectionLabel = isSearching
    ? `Results for "${query}"`
    : filterMode === "latest"
    ? "🆕 Latest Movies (Now Playing)"
    : "🔥 Popular Movies";

  return (
    <div className="home">

      {/* ===== FULL-WIDTH HERO WITH CYCLING MOVIE BACKGROUNDS ===== */}
      <div className="home-hero">

        {/* Background slides — one per movie */}
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
          {/* Dark overlay so text is readable */}
          <div className="hero-bg-overlay" />
        </div>

        {/* Content on top of the background */}
        <div className="hero-content">
          {/* Title & subtitle */}
          <h2 className="hero-heading">
            Discover <span>Amazing</span> Movies
          </h2>
          <p className="hero-subtext">
            Search from thousands of movies, explore genres and save your favorites
          </p>

          {/* Search bar with inline filter */}
          <div className="search-bar">
            <div className="search-input-container">
              <div className="inline-filter-wrapper">
                <select className="inline-filter" onChange={handleSelectChange}>
                  <option value="all">All</option>
                  <option value="latest">🆕 Latest</option>
                  <option value="Sort by: Title">📝 Title</option>
                  <option value="Sort by: Year">📅 Newest</option>
                  <option value="Sort by: Rating">⭐ Top Rated</option>
                </select>
                <span className="filter-arrow">▾</span>
              </div>
              <input
                type="text"
                value={query}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="🔍 Search for a movie..."
              />
              <SearchIcon className="search-icon" onClick={handleSearch} />
            </div>
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          {/* Dot indicators */}
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
      </div>

      {/* Section Title */}
      <div className="section-title">{sectionLabel}</div>

      {/* Movie Grid */}
      <div className="movie-list">
        {displayedMovies.length > 0 ? (
          displayedMovies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} />
          ))
        ) : (
          <p className="no-movies">
            😕 No movies found. Try a different search term or filter.
          </p>
        )}
      </div>

      {/* Pagination */}
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
