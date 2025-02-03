import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Clock, Star } from 'lucide-react';
import { MovieDetails, Movie } from '../types/movie';
import { fetchMovieDetails, fetchSimilarMovies, getImageUrl } from '../utils/api';
import { useFavorites } from '../context/FavoritesContext';
import VideoPlayer from '../components/VideoPlayer';
import MovieRow from '../components/MovieRow';

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [movieData, similarData] = await Promise.all([
          fetchMovieDetails(id),
          fetchSimilarMovies(id),
        ]);
        setMovie(movieData);
        setSimilarMovies(similarData);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading || !movie) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const trailerVideo = movie.videos.results.find(
    (video) => video.type === 'Trailer'
  );

  const handleFavoriteClick = () => {
    if (isFavorite(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  };

  const releaseYear = movie.release_date 
    ? new Date(movie.release_date).getFullYear().toString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-16">
        {trailerVideo ? (
          <VideoPlayer videoKey={trailerVideo.key} />
        ) : (
          <div className="aspect-video w-full relative">
            <img
              src={getImageUrl(movie.backdrop_path)}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3 md:-mt-24">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold">{movie.title}</h1>
              <button
                onClick={handleFavoriteClick}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${
                    isFavorite(movie.id) ? 'fill-red-500 text-red-500' : 'text-white'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center gap-4 text-gray-400 mb-6">
              <span>{releaseYear}</span>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{movie.runtime} min</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
            </div>

            {movie.tagline && (
              <p className="text-xl text-gray-400 italic mb-4">{movie.tagline}</p>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Overview</h2>
              <p className="text-gray-300">{movie.overview}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Genres</h2>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {similarMovies.length > 0 && (
          <div className="mt-12">
            <MovieRow title="More Like This" movies={similarMovies} />
          </div>
        )}
      </div>
    </div>
  );
}