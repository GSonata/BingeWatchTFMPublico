const User = require('../models/User');
const Movie = require('../models/Movie');
const Badge = require('../models/Badge');
const Interaction = require('../models/Interactions');


const { checkAllBadges } = require('../controllers/badgeController');

const { v4: uuidv4 } = require('uuid');

const getUserCollectionByMovie = async (req, res) => {

    console.log('Session:', req.session);
    console.log('User en sesión:', req.session.user);

    const { imdbID } = req.params;

    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const copiasDeEstaPelicula = user.coleccion.filter(copia => copia.imdbID === imdbID);
        res.json(copiasDeEstaPelicula);
    } catch (error) {
        console.error('Error al obtener la colección:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const addCopyToCollection = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

  const { imdbID, soporte, estado, foto = "", tags = [] } = req.body;

  if (!imdbID || !soporte || !estado) {
    return res.status(400).json({ message: 'Faltan datos obligatorios' });
  }

  if (tags.length > 5) {
    return res.status(400).json({ message: 'No puedes añadir más de 5 tags' });
  }

  try {
    const user = await User.findById(req.session.user._id);

    const nuevaCopia = {
      idCopia: uuidv4(),
      imdbID,
      soporte,
      estado,
      fechaAñadida: new Date(),
      foto, // ✅ base64
      tags  // ✅ array de strings
    };

    user.coleccion.push(nuevaCopia);
    await user.save();

    await Interaction.create({
      type: 'coleccion',
      imdbID,
      date: nuevaCopia.fechaAñadida,
      userId: user._id,
      soporte,
      estado,
      likes: [],
      comments: []
    });

    const nuevasInsignias = await checkAllBadges(user._id);
    console.log('🆕 Nuevas insignias obtenidas:', nuevasInsignias.map(b => b.id));

    res.status(200).json({
      message: 'Copia añadida correctamente',
      copia: nuevaCopia,
      nuevasInsignias
    });
  } catch (error) {
    console.error('Error al añadir copia:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const deleteCopyFromCollection = async (req, res) => {
    const { idCopia } = req.params;
    if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

    try {
        const user = await User.findById(req.session.user._id);
        const originalLength = user.coleccion.length;
        user.coleccion = user.coleccion.filter(copia => copia.idCopia !== idCopia);

        if (user.coleccion.length === originalLength) {
            return res.status(404).json({ message: 'Copia no encontrada' });
        }

        await user.save();
        const nuevasInsignias = await checkAllBadges(user._id);
        console.log('🆕 Nuevas insignias obtenidas:', nuevasInsignias.map(b => b.id));


        res.status(200).json({
            message: 'Copia eliminada correctamente',
            nuevasInsignias
        });
    } catch (error) {
        console.error('Error al eliminar copia:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const updateCopyFromCollection = async (req, res) => {
  const { idCopia } = req.params;
  const { soporte, estado, foto = "", tags = [] } = req.body;

  if (!req.session.user) {
    return res.status(401).json({ message: 'No autenticado' });
  }

  if (tags.length > 5) {
    return res.status(400).json({ message: 'No puedes añadir más de 5 tags' });
  }

  if (foto && !foto.startsWith("data:image/") && foto !== "") {
    return res.status(400).json({ message: 'Formato de imagen no válido' });
  }

  try {
    const user = await User.findById(req.session.user._id);
    const copia = user.coleccion.find(c => c.idCopia === idCopia);

    if (!copia) {
      return res.status(404).json({ message: 'Copia no encontrada' });
    }

    copia.soporte = soporte;
    copia.estado = estado;
    copia.foto = foto; 
    copia.tags = tags;
    
    await user.save();
    res.status(200).json({ message: 'Copia actualizada correctamente', copia });
  } catch (error) {
    console.error('Error al actualizar copia:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


/* FUNCIONES DE INTERACCION */

const addRating = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });
  
    const { imdbID, nota, fecha } = req.body;
  
    try {
      const user = await User.findById(req.session.user._id);
  
      // 1. Actualizar o añadir la película en 'peliculasVistas'
      const existing = user.peliculasVistas.find(p => p.imdbID === imdbID);
      if (existing) {
        existing.nota = nota;
        existing.fechaVisualizacion = fecha;
      } else {
        user.peliculasVistas.push({ imdbID, nota, fechaVisualizacion: fecha });
      }
  
      // 2. Eliminar de la watchlist si estaba
      user.watchlist = user.watchlist.filter(entry => entry.imdbID !== imdbID);
  
      await user.save();
  
      // 3. Buscar si ya existe interacción de tipo "vista" para este usuario y película
      const existingInteraction = await Interaction.findOne({
        type: 'vista',
        userId: user._id,
        imdbID
      });
  
      if (existingInteraction) {
        existingInteraction.nota = nota;
        existingInteraction.date = fecha;
        await existingInteraction.save();
      } else {
        await Interaction.create({
          type: 'vista',
          imdbID,
          date: fecha,
          userId: user._id,
          nota,
          likes: [],
          comments: []
        });
      }
  
      const nuevasInsignias = await checkAllBadges(user._id);
  
      res.status(200).json({ message: 'Nota guardada correctamente', nuevasInsignias });
    } catch (error) {
      console.error('Error al guardar la nota:', error);
      res.status(500).json({ message: 'Error del servidor' });
    }
  };
  

const getUserRatingForMovie = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

    const { imdbID } = req.params;

    try {
        const user = await User.findById(req.session.user._id);
        const movie = user.peliculasVistas.find(p => p.imdbID === imdbID);

        if (movie) {
            res.status(200).json({ nota: movie.nota });
        } else {
            res.status(200).json({ nota: null });
        }
    } catch (error) {
        console.error('Error al obtener la calificación:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const toggleWatchlist = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    const { imdbID } = req.body;

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const exists = user.watchlist.some(entry => entry.imdbID === imdbID);

        if (exists) {
            user.watchlist = user.watchlist.filter(entry => entry.imdbID !== imdbID);
        } else {
            user.watchlist.push({ imdbID, fechaAñadida: new Date() });
        }

        await user.save();
        await Interaction.create({
            type: 'watchlist',
            imdbID,
            date: new Date(),
            userId: user._id,
            likes: [],
            comments: []
          });

        const imdbIDs = user.watchlist.map(entry => entry.imdbID);
        res.status(200).json({ message: 'Watchlist actualizada', watchlist: imdbIDs });
    } catch (error) {
        console.error('Error al actualizar watchlist:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const getUserWatchlist = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

  try {
    const user = await User.findById(req.session.user._id);
    const imdbIDs = user.watchlist.map(entry => entry.imdbID);
    res.status(200).json({ watchlist: imdbIDs });
  } catch (err) {
    console.error('Error al obtener watchlist:', err.message);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

/* FUNCIONES DE USUARIO AJENAS */

const searchUsers = async (req, res) => {
    const { query } = req.body;
    if (!query) return res.json([]);

    try {
        const users = await User.find({
            alias: { $regex: query, $options: 'i' }
        }).select('_id alias imagenPerfil');

        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error al buscar usuarios', error: err.message });
    }
};

const getUserProfileById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        res.json(user);
    } catch (err) {
        console.error('❌ Error al obtener datos del usuario:', err.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const getUserHistoryById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const peliculasConCopias = await Promise.all(
            user.coleccion.map(async copia => {
                const pelicula = await Movie.findOne({ imdbID: copia.imdbID });
                return {
                    imdbID: copia.imdbID,
                    poster: pelicula?.poster || '',
                    title: pelicula?.title || '',
                    año: pelicula?.year || 0,
                    genre: pelicula?.genre || [],
                    estado: copia.estado,
                    soporte: copia.soporte,
                    fechaAñadida: copia.fechaAñadida || Date.now()
                };
            })
        );

        const peliculasUnicas = [];
        const seen = new Set();
        for (const peli of peliculasConCopias) {
            if (!seen.has(peli.imdbID)) {
                seen.add(peli.imdbID);
                const numCopias = peliculasConCopias.filter(c => c.imdbID === peli.imdbID).length;
                peliculasUnicas.push({ ...peli, numCopias });
            }
        }

        const peliculasVistasCompletas = await Promise.all(
            user.peliculasVistas.map(async vista => {
                const pelicula = await Movie.findOne({ imdbID: vista.imdbID });

                return {
                    imdbID: vista.imdbID,
                    poster: pelicula?.poster || '',
                    title: pelicula?.title || '',
                    año: pelicula?.year || 0,
                    genre: pelicula?.genre || [],
                    nota: vista.nota,
                    fechaVisualizacion: vista.fechaVisualizacion
                };
            })
        );

        const watchlistCompletas = await Promise.all(
            user.watchlist.map(async entry => {
                const pelicula = await Movie.findOne({ imdbID: entry.imdbID });

                return {
                    imdbID: entry.imdbID,
                    poster: pelicula?.poster || '',
                    title: pelicula?.title || '',
                    año: pelicula?.year || 0,
                    genre: pelicula?.genre || [],
                    fechaAñadida: entry.fechaAñadida || Date.now()
                };
            })
        );

        res.json({
            coleccion: peliculasUnicas,
            peliculasVistas: peliculasVistasCompletas,
            watchlist: watchlistCompletas
        });
    } catch (err) {
        console.error('❌ Error al obtener historial por ID:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const getUserBadgesById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Mapa para obtener fechas de adquisición
        const fechaMap = {};
        user.insignias.forEach((i) => {
            fechaMap[i.idInsignia] = i.fechaAdquisicion;
        });

        // Busca las insignias completas en la colección Badge
        const badges = await Badge.find({ id: { $in: Object.keys(fechaMap) } });

        const badgesWithFecha = badges.map((badge) => ({
            ...badge.toObject(),
            fechaAdquisicion: fechaMap[badge.id] || null
        }));

        badgesWithFecha.sort((a, b) => new Date(b.fechaAdquisicion) - new Date(a.fechaAdquisicion));

        res.status(200).json(badgesWithFecha);
    } catch (err) {
        console.error('❌ Error al obtener insignias por ID:', err.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
};





/* FUNCIONES DEL PERFIL */

const getUserHistory = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    try {
        const user = await User.findById(req.session.user._id);
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        // COLECCIÓN: todas las copias individuales con info de película
        const peliculasConCopias = await Promise.all(
            user.coleccion.map(async copia => {
                const pelicula = await Movie.findOne({ imdbID: copia.imdbID });

                return {
                    imdbID: copia.imdbID,
                    poster: pelicula?.poster || '',
                    title: pelicula?.title || '',
                    año: pelicula?.year || 0,
                    genre: pelicula?.genre || [],
                    estado: copia.estado,
                    soporte: copia.soporte,
                    fechaAñadida: copia.fechaAñadida || Date.now()
                };
            })
        );

        // Agrupar por imdbID con número de copias
        const peliculasUnicas = [];
        const seen = new Set();
        for (const peli of peliculasConCopias) {
            if (!seen.has(peli.imdbID)) {
                seen.add(peli.imdbID);
                const numCopias = peliculasConCopias.filter(c => c.imdbID === peli.imdbID).length;
                peliculasUnicas.push({ ...peli, numCopias });
            }
        }

        // PELÍCULAS VISTAS
        const peliculasVistasCompletas = await Promise.all(
            user.peliculasVistas.map(async vista => {
                const pelicula = await Movie.findOne({ imdbID: vista.imdbID });

                return {
                    imdbID: vista.imdbID,
                    poster: pelicula?.poster || '',
                    title: pelicula?.title || '',
                    año: pelicula?.year || 0,
                    genre: pelicula?.genre || [],
                    nota: vista.nota,
                    fechaVisualizacion: vista.fechaVisualizacion
                };
            })
        );

        // WATCHLIST (nuevo formato con fechaAñadida)
        const watchlistCompletas = await Promise.all(
            user.watchlist.map(async entry => {
                const pelicula = await Movie.findOne({ imdbID: entry.imdbID });

                return {
                    imdbID: entry.imdbID,
                    poster: pelicula?.poster || '',
                    title: pelicula?.title || '',
                    año: pelicula?.year || 0,
                    genre: pelicula?.genre || [],
                    fechaAñadida: entry.fechaAñadida || Date.now()
                };
            })
        );

        res.json({
            coleccion: peliculasUnicas,
            peliculasVistas: peliculasVistasCompletas,
            watchlist: watchlistCompletas
        });
    } catch (err) {
        console.error('❌ Error al obtener historial:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const updateProfileImage = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    const { base64Image } = req.body;

    if (!base64Image) {
        return res.status(400).json({ message: 'No se recibió ninguna imagen' });
    }

    try {
        const user = await User.findById(req.session.user._id);
        user.imagenPerfil = base64Image;
        await user.save();

        res.status(200).json({ message: 'Imagen de perfil actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar imagen de perfil:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const getUserBadges = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

    try {
        const user = await User.findById(req.session.user._id);

        const fechaMap = {};
        user.insignias.forEach((i) => {
            fechaMap[i.idInsignia] = i.fechaAdquisicion;
        });

        const badges = await Badge.find({ id: { $in: Object.keys(fechaMap) } });

        const badgesWithFecha = badges.map((badge) => ({
            ...badge.toObject(),
            fechaAdquisicion: fechaMap[badge.id] || null
        }));

        badgesWithFecha.sort((a, b) => new Date(b.fechaAdquisicion) - new Date(a.fechaAdquisicion));

        res.status(200).json(badgesWithFecha);
    } catch (err) {
        console.error('Error al obtener insignias del usuario:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};

const updateAlias = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

    const { newAlias } = req.body;

    if (!newAlias || typeof newAlias !== 'string') {
        return res.status(400).json({ message: 'Alias inválido' });
    }

    try {
        // Verifica si el alias ya existe en otro usuario
        const existingUser = await User.findOne({ alias: newAlias });
        if (existingUser && existingUser._id.toString() !== req.session.user._id) {
            return res.status(409).json({ message: 'El alias ya está en uso' });
        }

        const user = await User.findById(req.session.user._id);
        user.alias = newAlias;
        await user.save();

        // Actualiza la sesión en caso de que se necesite
        req.session.user.alias = newAlias;

        res.status(200).json({ message: 'Alias actualizado correctamente', alias: newAlias });
    } catch (err) {
        console.error('Error al actualizar alias:', err);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


module.exports = {
    addCopyToCollection,
    getUserCollectionByMovie,
    deleteCopyFromCollection,
    updateCopyFromCollection,
    addRating,
    toggleWatchlist,
    getUserWatchlist,
    getUserRatingForMovie,
    getUserHistory,
    updateProfileImage,
    getUserBadges,
    updateAlias,
    searchUsers,
    getUserProfileById,
    getUserHistoryById,
    getUserBadgesById
};
