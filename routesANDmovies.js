import express from 'express';
import axios from 'axios';
const router = express.Router();

const TMDB = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: process.env.TMDB_API_KEY },
});

// Search
router.get('/search', async (req, res) => {
  const { q, page = 1 } = req.query;
  const { data } = await TMDB.get('/search/movie', { params: { query: q, page } });
  res.json(data);
});

// Trending
router.get('/trending', async (_req, res) => {
  const { data } = await TMDB.get('/trending/movie/week');
  res.json(data);
});

// Details
router.get('/:id', async (req, res) => {
  const { data } = await TMDB.get(`/movie/${req.params.id}`);
  res.json(data);
});

export default router;