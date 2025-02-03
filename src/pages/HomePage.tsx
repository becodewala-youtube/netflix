import { useEffect, useState } from 'react';
import { Movie } from '../types/movie';
import { fetchMovies } from '../utils/api';
import MovieRow from '../components/MovieRow';
import HeroSection from '../components/HeroSection';

export default function HomePage() {
  const [movies, setMovies] = useState<{
    trending: Movie[];
    popular: Movie[];
    topRated: Movie[];
    upcoming: Movie[];
  }>({
    trending: [],
    popular: [],
    topRated: [],
    upcoming: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [trending, popular, topRated, upcoming] = await Promise.all([
          fetchMovies('/trending/movie/week'),
          fetchMovies('/movie/popular'),
          fetchMovies('/movie/top_rated'),
          fetchMovies('/movie/upcoming'),
        ]);

        setMovies({
          trending,
          popular,
          topRated,
          upcoming,
        });
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {movies.trending.length > 0 && (
        <HeroSection movie={movies.trending[0]} />
      )}
      
      <div className="space-y-8 pb-8">
        <MovieRow title="Trending Now" movies={movies.trending} />
        <MovieRow title="Popular" movies={movies.popular} />
        <MovieRow title="Top Rated" movies={movies.topRated} />
        <MovieRow title="Upcoming" movies={movies.upcoming} />
      </div>
    </div>
  );
}