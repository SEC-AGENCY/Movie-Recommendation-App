import mongoose from 'mongoose';
const listSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  type: { type: String, enum: ['favorites', 'watchlist'] },
  movies: [Number],        // TMDB ids
}, { timestamps: true });
export default mongoose.model('List', listSchema);