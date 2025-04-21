const User = require('../../models/User');
const Interaction = require('../../models/Interactions');

const migrateInteractions = async (req, res) => {
  try {
    const users = await User.find();

    for (const user of users) {
      console.log(`👤 Migrando interacciones de: ${user.alias || user._id}`);
      
      for (const copia of user.coleccion || []) {
        await Interaction.create({
          type: 'coleccion',
          imdbID: copia.imdbID,
          date: copia.fechaAñadida,
          userId: user._id,
          soporte: copia.soporte || null,
          estado: copia.estado || null,
          likes: [],
          comments: []
        });
      }

      for (const vista of user.peliculasVistas || []) {
        await Interaction.create({
          type: 'vista',
          imdbID: vista.imdbID,
          date: vista.fechaVisualizacion,
          userId: user._id,
          nota: vista.nota || null,
          likes: [],
          comments: []
        });
      }

      for (const entrada of user.watchlist || []) {
        await Interaction.create({
          type: 'watchlist',
          imdbID: entrada.imdbID,
          date: entrada.fechaAñadida,
          userId: user._id,
          likes: [],
          comments: []
        });
      }
    }

    console.log('✅ Migración completada con éxito');
    res.status(200).send('✅ Migración completada con éxito');
  } catch (err) {
    console.error('❌ Error en la migración:', err);
    res.status(500).send('❌ Error en la migración: ' + err.message);
  }
};

module.exports = { migrateInteractions };
