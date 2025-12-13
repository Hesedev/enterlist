import { normalizeMovieData, normalizeTVShowData } from '../services/normalizeData.js';

export async function fetchMovieByName(query) {
    try {
        const response = await fetch(`https://fetchmoviebyname-6rwliplava-uc.a.run.app?query=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error al buscar películas:', error);
        return [];
    }
}

export async function fetchTVShowByName(query) {
    try {
        const response = await fetch(`https://fetchtvshowbyname-6rwliplava-uc.a.run.app?query=${encodeURIComponent(query)}`);

        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error('Error al buscar series:', error);
        return [];
    }
}

export async function fetchMovieDetails(movieId) {
    try {
        const response = await fetch(
            `https://fetchmoviedetails-6rwliplava-uc.a.run.app?movieId=${movieId}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener detalles de la película:", error);
        return null;
    }
}

export async function fetchTvShowDetails(TvShowId) {
    try {
        const response = await fetch(
            `https://fetchtvshowdetails-6rwliplava-uc.a.run.app?tvShowId=${TvShowId}`
        );
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener detalles de la serie:", error);
        return null;
    }
}

// Función genérica para realizar búsqueda en diferentes tipos de contenido
export async function searchInTMDB(query, type) {
    let data = [];
    switch (type) {
        case 'Película':
            data = await fetchMovieByName(query);
            return data.map(normalizeMovieData);
        case 'Serie':
            data = await fetchTVShowByName(query);
            return data.map(normalizeTVShowData);
        default:
            console.error("Tipo de contenido no soportado.");
            return [];
    }
}

export async function getDetailsTMDB(id, type) {
    switch (type) {
        case 'Película':
            return await fetchMovieDetails(id);
        case 'Serie':
            return await fetchTvShowDetails(id);
        default:
            console.error("Tipo de contenido no soportado.");
            return [];
    }
}
