const mongoose = require('mongoose');

const movieCopySchema = new mongoose.Schema({
    idCopia: { type: String, required: true },
    imdbID: { type: String, required: true },
    estado: { type: String, enum: ["Excelente", "Bueno", "Normal", "Malo"], required: true },
    soporte: { type: String, enum: ["Digital", "BluRay", "VHS", "DVD"], required: true },
    fechaAñadida: { type: Date, default: Date.now }
});

const watchedMovieSchema = new mongoose.Schema({
    imdbID: { type: String, required: true },
    fechaVisualizacion: { type: Date, required: true },
    nota: { type: Number, min: 0.5, max: 5, required: true }
});

const badgeSchema = new mongoose.Schema({
    idInsignia: { type: String, required: true },
    fechaAdquisicion: { type: Date, required: true }
});

const watchlistEntrySchema = new mongoose.Schema({
    imdbID: { type: String, required: true },
    fechaAñadida: { type: Date, default: Date.now }
}); 

const userSchema = new mongoose.Schema({
    user: { type: String, required: true, unique: true }, // nombre de login
    email: { type: String, required: true, unique: true },
    alias: { type: String, required: true }, // nombre visible
    password: { type: String, required: true },
    imagenPerfil: { type: String, default: '' }, // URL o nombre del archivo
    coleccion: [movieCopySchema],
    watchlist: [watchlistEntrySchema],
    peliculasVistas: [watchedMovieSchema],
    insignias: [badgeSchema],
    amigos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]

});

module.exports = mongoose.model('User', userSchema);
