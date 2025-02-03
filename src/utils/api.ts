import axios from 'axios';
import { Movie, MovieDetails } from '../types/movie';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

export const getImageUrl = (path: string) =>
  path ? `https://image.tmdb.org/t/p/original${path}` : '';

export async function fetchMovies(endpoint: string): Promise<Movie[]> {
  try {
    const response = await api.get(endpoint);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching movies from ${endpoint}:`, error);
    return [];
  }
}

export async function fetchMovieDetails(id: string): Promise<MovieDetails> {
  try {
    const response = await api.get(`/movie/${id}`, {
      params: {
        append_to_response: 'videos,credits',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ${id}:`, error);
    throw error;
  }
}

export async function fetchSimilarMovies(id: string): Promise<Movie[]> {
  try {
    const response = await api.get(`/movie/${id}/similar`);
    return response.data.results;
  } catch (error) {
    console.error(`Error fetching similar movies for ${id}:`, error);
    return [];
  }
}

export async function searchMovies(query: string): Promise<Movie[]> {
  try {
    const response = await api.get('/search/movie', {
      params: {
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Error searching movies for "${query}":`, error);
    return [];
  }
}