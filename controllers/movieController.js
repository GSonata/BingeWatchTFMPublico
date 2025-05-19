const Movie = require('../models/Movie');

const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function titleSimilarity(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();

    let score = 0;
    const minLen = 5;

    for (let i = 0; i <= a.length - minLen; i++) {
        const substr = a.slice(i, i + minLen);
        if (b.includes(substr)) score++;
    }

    return score;
}

const getMovies = async (req, res) => {
    const searchQuery = req.body.title;

    try {
        console.log(`🔍 Received search query: "${searchQuery}"`);

        if (!searchQuery || typeof searchQuery !== 'string') {
            console.error("❌ El título de la búsqueda está vacío o indefinido");
            return res.status(400).json({ message: "El título de la búsqueda es obligatorio" });
        }

        const normalizedQuery = normalizeString(searchQuery).toLowerCase();

        // Obtener todas las películas desde MongoDB
        let dbMovies = await Movie.find();

        // Calcular similitud y filtrar aquellas con al menos 1 coincidencia
        dbMovies = dbMovies
            .map(movie => ({
                ...movie.toObject(),
                similarityScore: titleSimilarity(normalizeString(movie.title), normalizedQuery)
            }))
            .filter(movie => movie.similarityScore > 0)
            .sort((a, b) => b.similarityScore - a.similarityScore);

        console.log(`📦 Coincidencias por similitud: ${dbMovies.length}`);
        console.log("ℹ️ Consultando también la API externa...");

        // Llamada a la API externa (OMDb)
        const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=b69b9800`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`❌ Error en API externa: ${response.statusText}`);
            return res.status(500).json({ message: "Error al consultar OMDb" });
        }

        const data = await response.json();

        if (Array.isArray(data.Search)) {
            for (const movie of data.Search) {
                try {
                    const exists = await Movie.findOne({ imdbID: movie.imdbID });
                    if (!exists) {
                        const detailsUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=b69b9800`;
                        const detailsRes = await fetch(detailsUrl);
                        const details = await detailsRes.json();

                        if (
                            details.Type === "movie" &&
                            details.Poster && details.Poster !== "N/A"
                        ) {
                            const newMovie = new Movie({
                                title: details.Title,
                                year: parseInt(details.Year),
                                genre: details.Genre ? details.Genre.split(',').map(g => g.trim()) : [],
                                director: details.Director || "Desconocido",
                                actors: details.Actors ? details.Actors.split(',').map(a => a.trim()) : [],
                                plot: details.Plot || "No disponible",
                                poster: details.Poster,
                                imdbID: details.imdbID,
                                runtime: details.Runtime || "Desconocido",
                                metascore: isNaN(parseInt(details.Metascore)) ? 0 : parseInt(details.Metascore)
                            });

                            await newMovie.save();
                            console.log(`✅ Guardada nueva película: ${newMovie.title}`);
                        }
                    }
                } catch (err) {
                    console.error("❌ Error al guardar película externa:", err.message);
                }
            }

            // Recalcular resultados después de guardar nuevas
            const updatedMovies = await Movie.find();
            dbMovies = updatedMovies
                .map(movie => ({
                    ...movie.toObject(),
                    similarityScore: titleSimilarity(normalizeString(movie.title), normalizedQuery)
                }))
                .filter(movie => movie.similarityScore > 0)
                .sort((a, b) => b.similarityScore - a.similarityScore);
        }

        res.json(dbMovies);

    } catch (err) {
        console.error("🔥 Error inesperado:", err);
        res.status(500).json({ message: "Error del servidor", error: err.message });
    }
};


const getMovieById = async (req, res) => {
    try {
        const { imdbID } = req.params;
        const movie = await Movie.findOne({ imdbID });

        if (!movie) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        res.json(movie);
    } catch (error) {
        console.error('Error al obtener detalles de la película:', error);
        res.status(500).json({ message: "Error al obtener detalles de la película" });
    }
};

module.exports = { getMovies, getMovieById };
