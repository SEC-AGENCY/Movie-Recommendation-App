import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const generateTokens = (payload) => {
  const access = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { access, refresh };
};

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ msg: 'All fields required' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ msg: 'Email already exists' });

  const user = await User.create({ username, email, password });
  const { access, refresh } = generateTokens({ id: user._id });
  res.cookie('refresh', refresh, { httpOnly: true, sameSite: 'none', secure: true });
  res.json({ token: access, user: { id: user._id, username } });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ msg: 'Invalid credentials' });
  const { access, refresh } = generateTokens({ id: user._id });
  res.cookie('refresh', refresh, { httpOnly: true, sameSite: 'none', secure: true });
  res.json({ token: access, user: { id: user._id, username: user.username } });
});

// Refresh token
router.post('/refresh', (req, res) => {
  const refresh = req.cookies.refresh;
  if (!refresh) return res.status(401).json({ msg: 'No refresh token' });
  jwt.verify(refresh, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ msg: 'Invalid refresh' });
    const { access } = generateTokens({ id: decoded.id });
    res.json({ token: access });
  });
});

// Logout
router.post('/logout', (_req, res) => {
  res.clearCookie('refresh');
  res.json({ msg: 'Logged out' });
});

export default router;