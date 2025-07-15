import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Discover() {
  const [movies, setMovies] = useState([]);
  useEffect(() => {
    api.get('/movies/trending').then(({ data }) => setMovies(data.results));
  }, []);
  return (
    <div className="grid md:grid-cols-4 gap-4 p-4">
      {movies.map((m) => (
        <div key={m.id} className="shadow rounded">
          <img src={`https://image.tmdb.org/t/p/w300${m.poster_path}`} alt={m.title} />
          <h3 className="p-2 font-bold">{m.title}</h3>
        </div>
      ))}
    </div>
  );
}