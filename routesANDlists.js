import express from 'express';
import auth from '../middleware/auth.js';
import List from '../models/List.js';
const router = express.Router();

// Create list
router.post('/', auth, async (req, res) => {
  const { name, type } = req.body;
  const list = await List.create({ user: req.user.id, name, type });
  res.status(201).json(list);
});

// Toggle movie in list
router.patch('/:id', auth, async (req, res) => {
  const { movieId } = req.body;
  const list = await List.findOne({ _id: req.params.id, user: req.user.id });
  if (!list) return res.status(404).json({ msg: 'List not found' });

  const exists = list.movies.includes(movieId);
  if (exists) list.movies.pull(movieId);
  else list.movies.push(movieId);
  await list.save();
  res.json(list);
});

// User lists
router.get('/', auth, async (_req, res) => {
  const lists = await List.find({ user: _req.user.id });
  res.json(lists);
});

export default router;