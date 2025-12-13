// services/normalizeData.js

export const normalizeMovieData = (data) => ({
    id: data.id,
    name: data.title,
    year: data.release_date ? new Date(data.release_date).getFullYear() : 'Desconocido',
    image: data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : `../assets/img/no-image-found.jpg`
});

export const normalizeTVShowData = (data) => ({
    id: data.id,
    name: data.name,
    year: data.first_air_date ? new Date(data.first_air_date).getFullYear() : 'Desconocido',
    image: data.poster_path ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` : `../assets/img/no-image-found.jpg`
});

export const normalizeBookData = (data) => ({
    id: data.id,
    name: data.volumeInfo.title,
    year: data.volumeInfo.publishedDate ? new Date(data.volumeInfo.publishedDate).getFullYear() : 'Desconocido',
    image: data.volumeInfo.imageLinks.thumbnail ? data.volumeInfo.imageLinks.thumbnail.toString() : `../assets/img/no-image-found.jpg`
});

export const normalizePodcastData = (data) => ({
    name: data.name,
    year: data.release_date ? new Date(data.release_date).getFullYear() : 'No disponible',
});

export const normalizeArtistData = (data) => ({
    name: data.name,
    year: null, // Los artistas no tienen una "fecha de lanzamiento"
});

// Puedes añadir más normalizadores según las APIs que uses
