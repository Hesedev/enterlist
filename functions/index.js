const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const axios = require("axios");
const { database } = require("firebase-admin");
require('dotenv').config(); // Carga variables de entorno desde .env

initializeApp();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Función para buscar películas
exports.fetchMovieByName = onRequest(
    { cors: true },
    async (req, res) => {
        const query = req.query.query;

        if (!query) {
            res.status(400).json({ error: "Falta el parámetro query" });
            return;
        }

        try {
            const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
                params: {
                    api_key: TMDB_API_KEY,
                    query,
                    page: 1,
                    language: "es-ES"
                },
            });
            res.status(200).json(response.data.results || []);
        } catch (error) {
            console.error("Error al buscar películas:", error);
            res.status(500).json({ error: "Error al buscar películas" });
        }
    });

// Función para buscar series
exports.fetchTVShowByName = onRequest(
    { cors: true },
    async (req, res) => {
        const query = req.query.query;

        if (!query) {
            res.status(400).json({ error: "Falta el parámetro query" });
            return;
        }

        try {
            const response = await axios.get(`${TMDB_BASE_URL}/search/tv`, {
                params: {
                    api_key: TMDB_API_KEY,
                    query,
                    page: 1,
                    language: "es-ES"
                },
            });

            res.status(200).json(response.data.results || []);
        } catch (error) {
            console.error("Error al buscar series:", error);
            res.status(500).json({ error: "Error al buscar series" });
        }
    });

// Función para obtener detalles de una película
exports.fetchMovieDetails = onRequest(
    { cors: true },
    async (req, res) => {
        const movieId = req.query.movieId;

        if (!movieId) {
            res.status(400).json({ error: "Falta el parámetro movieId" });
            return;
        }

        try {
            const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: "es-ES"
                }
            });
            res.status(200).json(response.data);
        } catch (error) {
            console.error("Error al obtener detalles de la película:", error);
            res.status(500).json({ error: "Error al obtener detalles de la película" });
        }
    });

// Función para obtener detalles de una serie
exports.fetchTvShowDetails = onRequest(
    { cors: true },
    async (req, res) => {
        const tvShowId = req.query.tvShowId;

        if (!tvShowId) {
            res.status(400).json({ error: "Falta el parámetro tvShowId" });
            return;
        }

        try {
            const response = await axios.get(`${TMDB_BASE_URL}/tv/${tvShowId}`, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: "es-ES"
                }
            });
            res.status(200).json(response.data);
        } catch (error) {
            console.error("Error al obtener detalles de la serie:", error);
            res.status(500).json({ error: "Error al obtener detalles de la serie" });
        }
    });

//Buscar libros: https://www.googleapis.com/books/v1/volumes?q={query}
//Ver detalles de un libro: https://www.googleapis.com/books/v1/volumes/{volumeId}

const GOOGLE_BOOKS_BASE_URL = 'https://www.googleapis.com/books/v1/volumes';
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API_KEY_OPEN = process.env.GOOGLE_BOOKS_API_KEY_OPEN;

exports.fetchBookByName = onRequest(
    { cors: true },
    async (req, res) => {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ error: "Hace falta el parámetro query" });
        }

        try {
            // Realizando la consulta a Google Books
            const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}`, {
                params: {
                    q: query,
                    langRestrict: 'es',
                    key: GOOGLE_BOOKS_API_KEY_OPEN,
                    maxResults: 20,
                    filter: 'ebooks'
                },
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Referer': 'https://www.google.com'
                }
            });


            // const url = `${GOOGLE_BOOKS_BASE_URL}?q=${encodeURIComponent(query)}&langRestrict=es&key=${GOOGLE_BOOKS_API_KEY_OPEN}&maxResults=20&filter=ebooks`;

            // const response = await fetch(url);

            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            // const data = await response.json();
            // res.status(200).json([...data.items] || [])

            // Enviar los resultados
            res.status(200).json(response.data.items || []);
        } catch (e) {
            console.error('Error al buscar libros:', e);
            res.status(500).json({ error: 'Error al buscar libros.' });
        }
    }
);

exports.fetchBookById = onRequest(
    { cors: true },
    async (req, res) => {
        const { libroId } = req.query;

        if (!libroId) {
            return res.status(400).json({ error: "Hace falta el parámetro libroId" });
        }

        try {
            const response = await axios.get(`${GOOGLE_BOOKS_BASE_URL}/${libroId}`, {
                params: {
                    key: GOOGLE_BOOKS_API_KEY_OPEN,
                }
            });
            res.status(200).json(response.data || []);
        } catch (e) {
            console.error('Error al buscar el libro:', e);
            res.status(500).json({ error: 'Error al buscar el libro.' });
        }
    }
);