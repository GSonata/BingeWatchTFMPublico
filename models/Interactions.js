const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  alias: String,
  imagenPerfil: String,
  text: String,
  date: { type: Date, default: Date.now }
});

const interactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['coleccion', 'vista', 'watchlist', 'badge'], // ✅ Añadido 'badge'
    required: true
  },
  imdbID: {
    type: String,
    required: function () {
      return this.type !== 'badge'; // ✅ Requerido solo si NO es 'badge'
    }
  },
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: function () {
      return this.type === 'badge'; // ✅ Solo requerido si ES 'badge'
    }
  },
  date: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Opcionales según el tipo
  nota: Number,
  soporte: String,
  estado: String,

  // Reacciones
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema]
});

module.exports = mongoose.model('Interaction', interactionSchema);
