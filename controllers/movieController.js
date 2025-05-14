const Movie = require('../models/Movie');

const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const getMovies = async (req, res) => {
    const searchQuery = req.body.title;

    try {
        console.log(`🔍 Received search query: "${searchQuery}"`);

        if (!searchQuery || typeof searchQuery !== 'string') {
            console.error("❌ El título de la búsqueda está vacío o indefinido");
            return res.status(400).json({ message: "El título de la búsqueda es obligatorio" });
        }

        const normalizedQuery = normalizeString(searchQuery);


        const allMovies = await Movie.find();
        let dbMovies = allMovies.filter(movie =>
            normalizeString(movie.title).toLowerCase().includes(normalizedQuery.toLowerCase())
        ).sort((a, b) => b.metascore - a.metascore); // orden descendente de las notas
    
        console.log(`📦 Películas encontradas en MongoDB: ${dbMovies.length}`);

        if (dbMovies.length > 0) {
            console.log("✅ Devolviendo películas desde MongoDB");
            return res.json(dbMovies);
        }

        const apiUrl = `https://www.omdbapi.com/?s=${encodeURIComponent(searchQuery)}&apikey=b69b9800`;
        console.log(`🌐 Fetching from OMDB API: ${apiUrl}`);

        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error(`❌ Error al llamar a la API externa: ${response.statusText}`);
            return res.status(500).json({ message: "Error al llamar a la API externa" });
        }

        const data = await response.json();

        // ✅ Validación para evitar error si no hay resultados
        if (!data.Search || !Array.isArray(data.Search)) {
            console.log("ℹ️ No se encontraron resultados en la API externa");
            return res.json([]);
        }

        const moviesFromAPI = data.Search;
        const savedMovies = [];

        for (const movie of moviesFromAPI) {
            const movieDetailsUrl = `https://www.omdbapi.com/?i=${movie.imdbID}&apikey=b69b9800`;
            console.log(`🎬 Fetching movie details: ${movieDetailsUrl}`);

            const movieDetailsResponse = await fetch(movieDetailsUrl);
            if (!movieDetailsResponse.ok) {
                console.error(`❌ Error en detalles de la película: ${movieDetailsResponse.statusText}`);
                continue;
            }

            const movieDetails = await movieDetailsResponse.json();

            if (
                movieDetails.Type !== "movie" || 
                !movieDetails.Poster || 
                movieDetails.Poster === "N/A" || 
                movieDetails.Poster.trim() === ""
            ){
                console.log(`⏭️ Ignorando tipo no "movie": ${movieDetails.Type}`);
                continue;
            }

            try {
                const existingMovie = await Movie.findOne({ imdbID: movieDetails.imdbID });
                if (!existingMovie) {
                    const newMovie = new Movie({
                        title: movieDetails.Title,
                        year: parseInt(movieDetails.Year),
                        genre: movieDetails.Genre ? movieDetails.Genre.split(',').map(g => g.trim()) : [],
                        director: movieDetails.Director || "Desconocido",
                        actors: movieDetails.Actors ? movieDetails.Actors.split(',').map(a => a.trim()) : [],
                        plot: movieDetails.Plot || "No disponible",
                        poster: movieDetails.Poster,
                        imdbID: movieDetails.imdbID,
                        runtime: movieDetails.Runtime || "Desconocido",
                        metascore: isNaN(parseInt(movieDetails.Metascore)) ? 0 : parseInt(movieDetails.Metascore)
                    });
                    await newMovie.save();
                    savedMovies.push(newMovie);
                    console.log(`✅ Película guardada: ${newMovie.title}`);
                } else {
                    console.log(`↪️ Película ya existente: ${existingMovie.title}`);
                }
            } catch (err) {
                console.error("❌ Error al guardar la película:", err.message);
            }
        }

        if (savedMovies.length > 0) {
            console.log("📥 Nuevas películas guardadas. Recargando desde MongoDB...");
            const updatedMovies = await Movie.find();
            dbMovies = updatedMovies.filter(movie =>
                normalizeString(movie.title).toLowerCase().includes(normalizedQuery.toLowerCase())
            );
        }
        

        res.json(dbMovies);

    } catch (err) {
        console.error("🔥 Error inesperado al obtener películas:", err);
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
