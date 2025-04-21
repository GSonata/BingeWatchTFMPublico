const User = require('../models/User');
const Movie = require('../models/Movie');
const Interaction = require('../models/Interactions');
const Notification = require('../models/Notification');
const Badge = require('../models/Badge');


const addFriend = async (req, res) => {
    const { friendId } = req.params;

    if (!req.session.user) {
        return res.status(401).json({ message: 'No autenticado' });
    }

    try {
        const user = await User.findById(req.session.user._id);

        if (!user.amigos.includes(friendId)) {
            user.amigos.push(friendId);
            await user.save();
            return res.status(200).json({ message: 'Amigo añadido correctamente' });
        } else {
            return res.status(400).json({ message: 'Este usuario ya es tu amigo' });
        }
    } catch (err) {
        console.error('❌ Error al añadir amigo:', err.message);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


const removeFriend = async (req, res) => {
    const { friendId } = req.params;
    const userId = req.session.user._id;

    try {
        const user = await User.findById(userId);
        user.amigos = user.amigos.filter(id => id.toString() !== friendId);
        await user.save();
        res.json({ message: 'Amigo eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar amigo', error: err.message });
    }
};

const getFriends = async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('amigos', 'alias imagenPerfil');
        res.json(user.amigos);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener lista de amigos', error: err.message });
    }
};


const isFriend = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = req.session.user._id;
        const user = await User.findById(userId);
        const isFriend = user.amigos.includes(friendId);
        res.json({ isFriend });
    } catch (err) {
        res.status(500).json({ message: 'Error al verificar amistad', error: err.message });
    }
};

const getNotifications = async (req, res) => {
  const userId = req.session?.user?._id;

  if (!userId) return res.status(401).json({ message: 'No autenticado' });

  try {
    const notifs = await Notification.find({ userId }) // <- corregido aquí
      .sort({ date: -1 })
      .populate('fromUserId', 'alias imagenPerfil')
      .populate('interactionId'); // interactionId puede incluir badgeId o imdbID

    const enriched = await Promise.all(
      notifs.map(async notif => {
        const notifObj = notif.toObject();

        // Para interacciones de películas
        if (notif.interactionId?.imdbID) {
          const movie = await Movie.findOne({ imdbID: notif.interactionId.imdbID });
          notifObj.title = movie?.title || '';
          notifObj.year = movie?.year || null;
        }

        // Para interacciones tipo insignia
        if (notif.actionType === 'badge' && notif.interactionId?.badgeId) {
          const badge = await Badge.findById(notif.interactionId.badgeId);
          if (badge) {
            notifObj.title = badge.nombre;
          }
        }

        return notifObj;
      })
    );

    res.status(200).json(enriched);
  } catch (err) {
    console.error('❌ Error al obtener notificaciones:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};



// FUNCIONES DEL FEED 

// RECUPERAR EL FEED
const getFriendActivity = async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'No autenticado' });

  const { offset = 0, limit = 30 } = req.query;

  try {
    const user = await User.findById(req.session.user._id).populate('amigos');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const amigosIds = user.amigos.map(a => a._id);

    const interactions = await Interaction.find({ userId: { $in: amigosIds } })
      .sort({ date: -1 })
      .skip(Number(offset))
      .limit(Number(limit))
      .lean();

    const enriched = await Promise.all(interactions.map(async act => {
      const amigo = user.amigos.find(a => a._id.equals(act.userId));
      const alias = amigo?.alias || '';
      const imagenPerfil = amigo?.imagenPerfil ? `data:image/jpeg;base64,${amigo.imagenPerfil}` : '';

      // 🎖️ Si es una interacción de tipo insignia
      if (act.type === 'badge') {
        const badge = await Badge.findById(act.badgeId);
        return {
          ...act,
          alias,
          imagenPerfil,
          badge: badge ? {
            nombre: badge.nombre,
            descripcion: badge.descripcion,
            imagen: badge.imagen,
            id: badge.id
          } : null
        };
      }

      // 🎬 Si es una interacción de película
      const movie = await Movie.findOne({ imdbID: act.imdbID });

      return {
        ...act,
        title: movie?.title || '',
        poster: movie?.poster || '',
        year: movie?.year || '',
        genre: movie?.genre || [],
        alias,
        imagenPerfil
      };
    }));

    res.json(enriched);
  } catch (err) {
    console.error('❌ Error al obtener actividad de amigos:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};


// 👍 Like
const likeInteraction = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user?._id;

  if (!userId) return res.status(401).json({ message: 'No autenticado' });

  try {
    const interaction = await Interaction.findByIdAndUpdate(
      id,
      { $addToSet: { likes: userId } },
      { new: true }
    );

    if (!interaction) return res.status(404).json({ message: 'Interacción no encontrada' });

    if (interaction.userId.toString() !== userId.toString()) {
      const movie = await Movie.findOne({ imdbID: interaction.imdbID });

      await Notification.create({
        userId: interaction.userId,
        type: 'like',
        interactionId: interaction._id,
        fromUserId: req.session.user._id,
        title: movie?.title || '',
        year: movie?.year || '',
        actionType: interaction.type
      });
    }

    res.status(200).json({ message: 'Like añadido' });
  } catch (err) {
    console.error('❌ Error al dar like:', err);
    res.status(500).json({ message: 'Error al dar like' });
  }
};

// 👎 Unlike (no es dislike, porque claro no es voto negativo solo te lo quito)
const unlikeInteraction = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user?._id;

  if (!userId) return res.status(401).json({ message: 'No autenticado' });

  try {
    await Interaction.findByIdAndUpdate(id, {
      $pull: { likes: userId }
    });

    res.status(200).json({ message: 'Like eliminado' });
  } catch (err) {
    console.error('❌ Error al quitar like:', err);
    res.status(500).json({ message: 'Error al quitar like' });
  }
};

// 💬 Comentar
const commentOnInteraction = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.session.user?._id;

  if (!userId || !text) return res.status(400).json({ message: 'Datos inválidos' });

  try {
    const user = await User.findById(userId);
    const comment = {
      userId,
      alias: user.alias,
      imagenPerfil: user.imagenPerfil || '',
      text,
      date: new Date()
    };

    const interaction = await Interaction.findByIdAndUpdate(
      id,
      { $push: { comments: comment } },
      { new: true }
    );

    if (!interaction) return res.status(404).json({ message: 'Interacción no encontrada' });

    if (interaction.userId.toString() !== userId.toString()) {
      const movie = await Movie.findOne({ imdbID: interaction.imdbID });

      await Notification.create({
        userId: interaction.userId,
        type: 'comment',
        interactionId: interaction._id,
        fromUserId: req.session.user._id,
        text,
        title: movie?.title || '',
        year: movie?.year || '',
        actionType: interaction.type
      });
    }

    res.status(200).json({ message: 'Comentario añadido', comment });
  } catch (err) {
    console.error('❌ Error al comentar:', err);
    res.status(500).json({ message: 'Error al comentar' });
  }
};

// 💬 Borrar Comentario
const deleteCommentFromInteraction = async (req, res) => {
  const { interactionId, commentId } = req.params;
  const userId = req.session?.user?._id;

  if (!userId) return res.status(401).json({ message: 'No autenticado' });

  try {
    const interaction = await Interaction.findById(interactionId);
    if (!interaction) return res.status(404).json({ message: 'Interacción no encontrada' });

    const comment = interaction.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({ message: 'No tienes permiso para borrar este comentario' });
    }

    interaction.comments = interaction.comments.filter(c => c._id.toString() !== commentId);
    await interaction.save();

    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (err) {
    console.error('❌ Error al eliminar comentario:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// 🗑️ Eliminar notificación
const deleteNotification = async (req, res) => {
  const { id } = req.params;
  const userId = req.session?.user?._id;

  if (!userId) return res.status(401).json({ message: 'No autenticado' });

  try {
    const notification = await Notification.findById(id);
    if (!notification) return res.status(404).json({ message: 'Notificación no encontrada' });

    if (notification.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para borrar esta notificación' });
    }

    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: 'Notificación eliminada' });
  } catch (err) {
    console.error('❌ Error al eliminar notificación:', err);
    res.status(500).json({ message: 'Error al eliminar notificación' });
  }
};

// ✅ Marcar notificaciones como leídas
const markNotificationsAsRead = async (req, res) => {
  const userId = req.session?.user?._id;
  const { ids } = req.body;

  if (!userId) return res.status(401).json({ message: 'No autenticado' });

  try {
    await Notification.updateMany(
      { _id: { $in: ids }, userId },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: 'Notificaciones marcadas como leídas' });
  } catch (err) {
    console.error('❌ Error al marcar notificaciones como leídas:', err);
    res.status(500).json({ message: 'Error al marcar notificaciones como leídas' });
  }
};



module.exports = {
    isFriend,
    getFriends,
    removeFriend,
    addFriend,
    getFriendActivity,
    commentOnInteraction,
    unlikeInteraction,
    likeInteraction,
    deleteCommentFromInteraction,
    getNotifications,
    deleteNotification,
    markNotificationsAsRead
};
