# 🎬 MovieVault — React Movie App

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6.x-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.7.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-6.x-007FFF?style=for-the-badge&logo=mui&logoColor=white)
![TMDB](https://img.shields.io/badge/TMDB_API-v3-01B4E4?style=for-the-badge&logo=themoviedatabase&logoColor=white)

---

## 📸 Screenshots

| Home Page                                                                                                                  | Movie Details                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ![Home](<https://github.com/mdshakibkoushar/Training-_session-3/blob/main/Movie%20App(React)/photo/Screenshot%20(94).png>) | ![Details](<https://github.com/mdshakibkoushar/Training-_session-3/blob/main/Movie%20App(React)/photo/Screenshot%20(101).png>) |

| Favorites Page                                                                                                                   | Coming Soon                                                                                                                      |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| ![Favorites](<https://github.com/mdshakibkoushar/Training-_session-3/blob/main/Movie%20App(React)/photo/Screenshot%20(104).png>) | ![ComingSoon](<https://github.com/mdshakibkoushar/Training-_session-3/blob/main/Movie%20App(React)/photo/Screenshot%20(95).png>) |

---

## 📖 Overview

**MovieVault** is a full-featured movie discovery web application built with **React 18**. It connects to the **TMDB (The Movie Database) API v3** to fetch real-time movie data and lets users browse, search, filter, and save their favourite films — all in a sleek, dark-themed UI inspired by streaming platforms like Netflix and IMDb.

Key highlights:

- 🔍 **Live search** with 350 ms debounce — results appear as you type
- 🎞️ **Hero carousel** with auto-rotating backdrop images
- 🎬 **YouTube trailer player** with resume-from-last-position support (via `localStorage`)
- 📺 **In-app movie player** powered by `vidsrc.sbs`
- 🌐 **Streaming provider links** (Netflix, Prime Video, Hotstar, JioCinema, and 30+ more)
- ❤️ **Favorites watchlist** managed with React Context
- 📄 **Paginated** movie grids (up to 200 pages per category)
- 📱 Fully **responsive** — works on mobile, tablet, and desktop

---

## ✨ Features

### 🏠 Home Page

- **Auto-rotating hero banner** — cycles through 10 popular movie backdrops every 4 seconds with clickable dot navigation
- **Quick filter bar** — All | Top Rated | Latest | Newest | Coming Soon buttons
- **Category pills** — 23 genre/language filters: Bollywood, Hollywood, Dual Audio, Telugu, Pakistani, Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, History, Horror, Mystery, Romance, Thriller, War, Web Series, Cartoon, and more
- **Mobile-friendly dropdown** for categories on small screens
- **Client-side sorting** — sort by Title, Release Year (newest first), or Rating
- **Pagination** — navigate up to 200 pages of results with smooth scroll-to-top

### 🔍 Search

- **Real-time search** with 350 ms debounce — no need to press Enter
- Search results can be additionally sorted by year or rating
- Clears automatically when search box is emptied, reverting to Popular movies

### 🎬 Movie Card (`MovieItem`)

- Poster image with hover overlay
- ⭐ Rating badge (top-left)
- ❤️ Favorite badge when saved (top-right)
- Play button (▶) on hover to open YouTube trailer inline
- Star rating visual (out of 5 stars, half-star support)
- "Add Favorite / Unfavorite" toggle button
- "View Details" link to full movie page

### 📄 Movie Details Page

- Full backdrop image with gradient overlay
- Movie poster + colour-coded rating circle (green ≥ 7, yellow ≥ 5, red < 5)
- **Play button** — opens in-app embedded player (vidsrc.sbs, TMDB ID based)
- Meta chips: Release Date, Runtime, Genres
- Full overview / synopsis
- Details grid: Director, Language, Status, Release Date, Box Office revenue
- **Top 6 cast** with clickable photos → Social Media modal (Instagram, Twitter/X, Facebook, TikTok, YouTube, IMDb links via TMDB external IDs)
- **Watch On** section — streaming provider logos with type badges (Stream / Free / Rent / Buy), direct platform links, and JustWatch fallback

### ❤️ Favorites

- Persistent in-session watchlist (React Context, in-memory)
- Grid of saved movies with poster, rating badge, year
- Hover overlay with "View Details" and "Remove" buttons
- Empty state with a link back to Browse

### 💥 Action Movies Page

- Dedicated page filtered to TMDB genre ID 28 (Action)
- Built-in search bar scoped to action movies
- Pagination up to 200 pages
- Same trailer + favorite functionality as home grid

### 🗓️ Coming Soon Page

- Fetches TMDB `/movie/upcoming` endpoint; filters to only truly future dates
- IMDb-style ranked list rows with poster, title, release countdown (days remaining), overview snippet
- "Watch Trailer" button + "More Details" link per row
- Paginated results

### 🎞️ Trailer Modal (`TrailerModal`)

- Fetches official YouTube trailer via TMDB `/movie/{id}/videos`
- Uses YouTube IFrame API for full player controls
- **Resume from last position** — saves timestamp to `localStorage` every 2 seconds; restored on next open
- Resets saved time when trailer finishes
- Close via ✕ button, backdrop click, or `Escape` key

### 🌐 Streaming Providers

- Supports 30+ providers including Netflix, Amazon Prime, Hulu, Apple TV+, Disney+, Hotstar, JioCinema, SonyLIV, Zee5, Voot, MX Player, Eros Now, YouTube Movies, and more
- Prefers India (IN) region data, falls back to US or first available
- Colour-coded type badges: 🟢 Stream | 🔵 Free | 🟠 Rent | 🟣 Buy

---

## 🛠️ Tech Stack

| Category               | Technology                               |
| ---------------------- | ---------------------------------------- |
| **Frontend Framework** | React 18.3.1                             |
| **Routing**            | React Router DOM v6                      |
| **HTTP Client**        | Axios 1.7.x                              |
| **UI Components**      | MUI (Material UI) v6 + MUI Icons         |
| **Icons**              | React Icons 5.x, FontAwesome 6.x         |
| **Styling**            | Plain CSS (component-level `.css` files) |
| **Movie Data API**     | TMDB (The Movie Database) API v3         |
| **Trailer Player**     | YouTube IFrame API                       |
| **Movie Player**       | vidsrc.sbs embed                         |
| **Carousel / Slider**  | react-slick + slick-carousel             |
| **Star Ratings**       | react-star-ratings                       |
| **Proxy Server**       | Node.js + Express + youtube-search-api   |
| **Testing**            | React Testing Library + Jest             |
| **Build Tool**         | Create React App (react-scripts 5)       |

---

## 📁 Project Structure

```
Movie App(React)/
├── public/
│   ├── index.html          # Root HTML template
│   ├── favicon.ico / .svg  # App icons
│   ├── manifest.json       # PWA manifest
│   └── robots.txt
├── src/
│   ├── index.js            # React DOM entry point
│   ├── index.css           # Global base styles
│   ├── App.js              # Root component + route setup
│   ├── App.css             # App-level styles
│   │
│   ├── context/
│   │   └── MovieContext.js # Global state (movies, favorites, search)
│   │
│   ├── components/
│   │   ├── NavBar.js / .css        # Top navigation bar + search
│   │   ├── Home.js / .css          # Main landing page + hero + grid
│   │   ├── MovieItem.js / .css     # Single movie card component
│   │   ├── MovieDetails.js         # Full movie details page
│   │   ├── TrailerModal.js / .css  # YouTube trailer popup
│   │   ├── Favorites.js / .css     # Saved movies page
│   │   ├── Footer.js / .css        # App footer
│   │   └── Login.js                # (Login placeholder)
│   │
│   └── NavButton/
│       ├── ActionMovies.js / .css  # Action genre dedicated page
│       └── ComingSoon.js / .css    # Upcoming movies page
│
├── proxy-server.js         # Node.js/Express proxy for YouTube search
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

---

## 🧩 Components

### `NavBar` — `src/components/NavBar.js`

The top fixed navigation bar. Contains:

- **Logo** (`MovieVault`) — links to `/`
- **Search bar** — live-search with 350 ms debounce; pushes `searchConfig` into context
- **Hamburger menu** — dropdown with Home & Favorites links (closes on outside click)
- **Desktop nav links** — Home | Favorites with active-link highlighting

### `Home` — `src/components/Home.js`

The main landing page. Responsibilities:

- Fetches movies from TMDB on mount and whenever `searchConfig` changes
- Renders the **hero carousel** (10 slides, 4 s auto-cycle)
- Shows **quick filter buttons** and **category pills** (23 categories)
- On mobile renders a collapsible **categories dropdown**
- Displays a **section label** describing the current view
- Shows a **loading spinner overlay** while fetching
- Renders the **movie grid** using `MovieItem` components
- Handles **pagination** (prev/next with scroll-to-top)

**`fetchMovies(page, query, mode, genreId, langCode, searchKw)`** — central async function that builds the correct TMDB URL and updates context state.

**Category mapping:**

| Category ID               | TMDB Query                   |
| ------------------------- | ---------------------------- |
| `bollywood`               | `with_original_language=hi`  |
| `dual` / `dual720`        | keyword `"dual audio hindi"` |
| `hollywood` / `hwood1080` | `with_original_language=en`  |
| `telugu`                  | `with_original_language=te`  |
| `pakistani`               | `with_original_language=ur`  |
| `cartoon`                 | genre `16` (Animation)       |
| `webseries`               | keyword `"web series"`       |
| Numeric IDs               | `with_genres={id}`           |

### `MovieItem` — `src/components/MovieItem.js`

Reusable movie card component. Props: `{ movie }`.

- Renders poster, rating badge, favorite badge
- Hover overlay shows title, year, star rating, action buttons
- Opens `TrailerModal` on play-button click
- Calls `addFavorite` / `removeFavorite` from context
- Star rendering: TMDB 0–10 score → 5-star display (half-star support)

### `MovieDetails` — `src/components/MovieDetails.js`

Full-page details view at `/movie/:imdbID`. Sub-components:

- **`LoadingScreen`** — spinner while fetching
- **`ErrorScreen`** — error message + back button
- **`MovieDetailsView`** — main layout with backdrop, poster, info, cast, providers
- **`MusicModal`** — in-app movie player via `vidsrc.sbs` iframe
- **`CastCard`** — actor photo with social-modal trigger on click
- **`SocialModal`** — actor social links (Instagram, Twitter/X, Facebook, TikTok, YouTube, IMDb)
- **`DetailItem`** — label/value pair in details grid

Fetches (parallel via `Promise.all`):

1. Movie info — `/movie/{id}`
2. Credits — `/movie/{id}/credits`
3. Watch providers — `/movie/{id}/watch/providers`

### `TrailerModal` — `src/components/TrailerModal.js`

YouTube trailer popup. Props: `{ movieId, movieTitle, onClose }`.

- Fetches trailer key from TMDB videos endpoint (prefers official trailer)
- Initialises YouTube IFrame Player API dynamically
- Saves/restores playback position via `localStorage` key `trailer_time_{movieId}`
- Auto-saves every 2 seconds; clears on video end
- Closes on backdrop click or `Escape` key

### `Favorites` — `src/components/Favorites.js`

Watchlist page at `/favorites`.

- Reads `favorites` array from context
- Shows count in header
- Renders `FavoriteCard` grid or empty-state prompt
- **`FavoriteCard`** — poster with rating badge, hover overlay for "View Details" / "Remove"

### `ActionMovies` — `src/NavButton/ActionMovies.js`

Dedicated Action genre page at `/genre/action`.

- Fetches TMDB discover with `with_genres=28`
- Own search bar scoped to action movies
- Pagination, trailer modal, and favorites toggle

### `ComingSoon` — `src/NavButton/ComingSoon.js`

Upcoming movies page at `/coming-soon`.

- Fetches `/movie/upcoming`; filters out movies already released
- Displays rank, poster (with play overlay), title, days-until-release badge, overview snippet
- "Watch Trailer" and "More Details" per row
- Pagination with `totalPages = ceil(apiTotalPages / 3)`

### `Footer` — `src/components/Footer.js`

Simple footer rendered at the bottom of every page.

---

## 🗂️ Context — `MovieContext`

**File:** `src/context/MovieContext.js`

Provides global state to all components via React Context API.

```jsx
const MovieContext = createContext();
```

### State

| State            | Type             | Description                                         |
| ---------------- | ---------------- | --------------------------------------------------- |
| `movies`         | `Array`          | Current page of movie results                       |
| `detailedMovies` | `Array`          | Same as movies (available for future detail use)    |
| `favorites`      | `Array`          | User's saved favourite movies                       |
| `searchConfig`   | `Object \| null` | `{ query, filter }` set by NavBar, consumed by Home |

### Methods

| Method              | Signature                     | Description                         |
| ------------------- | ----------------------------- | ----------------------------------- |
| `setMovies`         | `(movies[]) => void`          | Update current movie list           |
| `setDetailedMovies` | `(movies[]) => void`          | Update detailed movie list          |
| `addFavorite`       | `(movie) => void`             | Append movie to favorites           |
| `removeFavorite`    | `(id) => void`                | Remove movie by `id` from favorites |
| `setSearchConfig`   | `({ query, filter }) => void` | Trigger search/filter from NavBar   |

### Usage Example

```jsx
import { useContext } from "react";
import { MovieContext } from "../context/MovieContext";

const { favorites, addFavorite, removeFavorite } = useContext(MovieContext);
```

---

## 🗺️ Routing

All routes are defined in `src/App.js` using React Router v6 `<Routes>`.

| Path             | Component      | Description            |
| ---------------- | -------------- | ---------------------- |
| `/`              | `Home`         | Main browse page       |
| `/favorites`     | `Favorites`    | Saved movies watchlist |
| `/genre/:genre`  | `Home`         | Genre filter (generic) |
| `/genre/action`  | `ActionMovies` | Dedicated Action page  |
| `/coming-soon`   | `ComingSoon`   | Upcoming releases      |
| `/movie/:imdbID` | `MovieDetails` | Full movie detail page |

> **Note:** The `:imdbID` param actually holds the **TMDB numeric ID** (not an IMDb `tt…` ID) as that's what is available from the discover/search endpoints.

---

## 🌐 API Reference

This app uses the **TMDB (The Movie Database) API v3**.  
Base URL: `https://api.themoviedb.org/3`

| Endpoint                                       | Used In                 | Purpose                |
| ---------------------------------------------- | ----------------------- | ---------------------- |
| `GET /movie/popular`                           | Home                    | Popular movies list    |
| `GET /movie/now_playing`                       | Home                    | Latest / Now Playing   |
| `GET /movie/upcoming`                          | ComingSoon              | Upcoming releases      |
| `GET /search/movie?query=…`                    | Home, ActionMovies      | Search by title        |
| `GET /discover/movie?with_genres=…`            | Home, ActionMovies      | Filter by genre        |
| `GET /discover/movie?with_original_language=…` | Home                    | Filter by language     |
| `GET /movie/{id}`                              | MovieDetails            | Full movie info        |
| `GET /movie/{id}/credits`                      | MovieDetails            | Director + cast        |
| `GET /movie/{id}/videos`                       | TrailerModal            | YouTube trailer key    |
| `GET /movie/{id}/watch/providers`              | MovieDetails            | Streaming providers    |
| `GET /person/{id}/external_ids`                | MovieDetails (CastCard) | Actor social media IDs |

### Image URLs

TMDB images are served from: `https://image.tmdb.org/t/p/`

| Size       | Used For                              |
| ---------- | ------------------------------------- |
| `w500`     | Movie posters                         |
| `w185`     | Cast photos, Coming Soon posters      |
| `w92`      | Provider logos                        |
| `original` | Hero backdrop, movie details backdrop |

### API Key

The API key is hardcoded as:

```
4e44d9029b1270a757cddc766a1bcb63
```

> ⚠️ For production use, move this to an environment variable: `REACT_APP_TMDB_KEY` and reference it as `process.env.REACT_APP_TMDB_KEY`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 16.x
- **npm** ≥ 8.x (or yarn)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mdshakibkoushar/Training-_session-3.git

# 2. Navigate to the project folder
cd "Training-_session-3-main/Movie App(React)"

# 3. Install dependencies
npm install
```

### Running the App

```bash
# Start the React development server (runs on http://localhost:3000)
npm start
```

The app will open automatically in your default browser.

### Building for Production

```bash
npm run build
```

Generates an optimised production build in the `build/` folder.

---

## 📜 Available Scripts

| Script    | Command         | Description                                    |
| --------- | --------------- | ---------------------------------------------- |
| **Start** | `npm start`     | Runs the app in development mode on port 3000  |
| **Build** | `npm run build` | Creates an optimised production build          |
| **Test**  | `npm test`      | Runs the test suite with React Testing Library |
| **Eject** | `npm run eject` | Ejects CRA config (irreversible)               |

---

## 🔌 Proxy Server

**File:** `proxy-server.js`  
**Port:** `3001`

A lightweight Node.js / Express server that proxies YouTube search queries (used for song/soundtrack lookup features).

### Starting the Proxy

```bash
node proxy-server.js
```

### Endpoint

```
GET http://localhost:3001/search-songs?q={search_term}
```

**Response:**

```json
[
  {
    "key": "YouTube_video_id",
    "name": "Video Title",
    "thumb": "https://thumbnail-url"
  }
]
```

Returns up to 8 video results. Returns `[]` on error or missing query.

### Dependencies (proxy only)

- `express` — HTTP server
- `cors` — Cross-Origin Resource Sharing
- `youtube-search-api` — YouTube search without official API key

> **Note:** The proxy server is optional for the main movie browsing features. It is only needed if soundtrack/song search functionality is enabled.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m "Add: your feature description"`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** against the `main` branch

### Guidelines

- Follow the existing code style (functional components, hooks, plain CSS)
- Keep components small and focused on a single responsibility
- Add meaningful commit messages
- Test your changes locally before submitting

---

<p align="center">Made with ❤️ by <a href="https://github.com/mdshakibkoushar">Shakib</a></p>
