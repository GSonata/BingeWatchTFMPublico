const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    imdbID: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: [String], required: true },
    director: { type: String, required: true },
    actors: { type: [String], required: true },
    plot: { type: String, required: true },
    poster: { type: String, required: true },
    imdbID: { type: String, required: true, unique: true },
    runtime: { type: String, required: true },  
    metascore: { type: Number, default: 0 } 
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
