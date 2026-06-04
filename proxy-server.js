const express = require("express");
const cors = require("cors");
const YT = require("youtube-search-api");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/search-songs", async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const result = await YT.GetListByKeyword(q, false, 8);
    const songs = (result.items || [])
      .filter((v) => v.id && v.title && v.type === "video")
      .slice(0, 8)
      .map((v) => ({
        key: v.id,
        name: v.title,
        thumb: v.thumbnail?.thumbnails?.[0]?.url || "",
      }));
    res.json(songs);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🎵 Song proxy running on http://localhost:${PORT}`),
);
