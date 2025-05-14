const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true 
  },
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: true 
  },
  esMensual: {
    type: Boolean,
    default: false
  },
  tipo: {
    type: String,
    enum: ['vista', 'coleccion', 'watchlist'],
    default: 'vista'
  },
  objetivo: {
    type: Number,
    default: 10 
  },
  mes: {
    type: Number 
  },
  año: {
    type: Number
  }
});

module.exports = mongoose.model('Badge', badgeSchema, "Badge");
