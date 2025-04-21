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
  }
});

module.exports = mongoose.model('Badge', badgeSchema, "Badge");
