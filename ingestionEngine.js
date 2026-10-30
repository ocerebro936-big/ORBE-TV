/**
 * Pilar 1: UBlue Media Ingestion Engine (Backend Service / Node.js)
 * Scraper automatizado, normalizador e validador de sinais .m3u8
 */

import axios from 'axios';

// Configuração das APIs de Metadados
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'demo-key';
const TMDB_BASE = 'https://api.themoviedb.org/3';

/**
 * 1. Varredura e Busca Automatizada de Conteúdo no TMDB / TVmaze
 */
export async function scanMediaContent(query, type = 'movie') {
  try {
    const endpoint = type === 'tv' ? `${TMDB_BASE}/search/tv` : `${TMDB_BASE}/search/movie`;
    const response = await axios.get(endpoint, {
      params: { api_key: TMDB_API_KEY, query, language: 'pt-PT' },
      timeout: 5000
    });

    return response.data.results.map(item => ({
      tmdbId: item.id,
      title: item.title || item.name,
      overview: item.overview,
      releaseDate: item.release_date || item.first_air_date,
      posterUrl: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
      backdropUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null,
      category: type === 'tv' ? (item.genre_ids?.includes(10766) ? 'Novela' : 'Série') : 'Filme',
      voteAverage: item.vote_average
    }));
  } catch (error) {
    console.warn(`[Scraper Notice] Busca alternativa TVmaze para "${query}":`, error.message);
    try {
      const tvRes = await axios.get(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`, { timeout: 5000 });
      return tvRes.data.map(entry => ({
        tvmazeId: entry.show.id,
        title: entry.show.name,
        overview: entry.show.summary ? entry.show.summary.replace(/<[^>]*>?/gm, '') : '',
        releaseDate: entry.show.premiered,
        posterUrl: entry.show.image?.medium || null,
        backdropUrl: entry.show.image?.original || null,
        category: 'Série',
        voteAverage: entry.show.rating?.average || 7.5
      }));
    } catch (e) {
      console.error(`[Scraper Error] Falha final ao buscar mídia (${query}):`, e.message);
      return [];
    }
  }
}

/**
 * 2. Verificador de Saúde do Stream (Health Checker)
 * Garante que apenas links HLS (.m3u8) ativos vão para a TV
 */
export async function checkStreamHealth(streamUrl) {
  const startTime = Date.now();
  try {
    const response = await axios.get(streamUrl, {
      timeout: 5000,
      headers: { 'User-Agent': 'Mozilla/5.0 (SmartTV; UBlueTV-Ingestion/3.0)' }
    });

    const isHls = typeof response.data === 'string' && response.data.includes('#EXTM3U');
    const latency = Date.now() - startTime;

    return {
      status: isHls ? 'ONLINE' : 'DEGRADED',
      latencyMs: latency,
      format: isHls ? 'HLS' : 'UNKNOWN',
      httpStatus: response.status
    };
  } catch (error) {
    return {
      status: 'OFFLINE',
      latencyMs: Date.now() - startTime,
      error: error.message,
      httpStatus: error.response ? error.response.status : 0
    };
  }
}

export default {
  scanMediaContent,
  checkStreamHealth
};
