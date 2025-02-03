import { useEffect, useState } from 'react';
import { Play, Info } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl, fetchMovieDetails } from '../utils/api';
import { Link } from 'react-router-dom';

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    const loadTrailer = async () => {
      try {
        const details = await fetchMovieDetails(movie.id.toString());
        const trailer = details.videos.results.find(
          (video) => video.type === 'Trailer'
        );
        setTrailerKey(trailer?.key || null);
      } catch (error) {
        console.error('Error loading trailer:', error);
      }
    };

    loadTrailer();
  }, [movie.id]);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden no-scrollbar">
      <div className="absolute inset-0">
        {trailerKey ? (
          <>
            <div className="relative w-full h-full">
              <iframe
                className="w-full h-full scale-150"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${trailerKey}&disablekb=1&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </>
        ) : (
          <img
            src={getImageUrl(movie.backdrop_path)}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute h-screen inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 top-80 flex items-center px-4 sm:px-8 md:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {movie.title}
          </h1>
          <p className="text-lg text-gray-200 mb-8 line-clamp-3">
            {movie.overview}
          </p>
          <div className="flex space-x-4">
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center px-6 py-2 bg-white text-black rounded-md hover:bg-gray-200 transition-colors"
            >
              <Play className="w-5 h-5 mr-2" />
              Play
            </Link>
            <Link
              to={`/movie/${movie.id}`}
              className="flex items-center px-6 py-2 bg-gray-500/70 text-white rounded-md hover:bg-gray-600/70 transition-colors"
            >
              <Info className="w-5 h-5 mr-2" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}