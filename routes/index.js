var express = require('express');
var router = express.Router();
const { getMovies, getMovieById } = require("../controllers/movieController");
const { login, logout, register, checkSession } = require("../controllers/authController")
const { 
  getUserCollectionByMovie, addCopyToCollection, deleteCopyFromCollection, updateCopyFromCollection, 
  addRating, toggleWatchlist, getUserRatingForMovie,
  getUserHistory, updateProfileImage, getUserBadges, updateAlias, searchUsers, getUserProfileById,
  getUserHistoryById, getUserBadgesById, getUserWatchlist
} = require('../controllers/userController');

const {
  addFriend,
  removeFriend,
  getFriends,
  isFriend,
  getFriendActivity,
  likeInteraction,
  unlikeInteraction,
  commentOnInteraction,
  deleteCommentFromInteraction,
  getNotifications,
  deleteNotification,
  markNotificationsAsRead
} = require('../controllers/socialController');
const { getAllBadges, getMonthlyBadgeProgress  } = require('../controllers/badgeController');
const { sendMail, requestPasswordReset, resetPassword } = require('../controllers/mailController');


/* ESTAS DOS LINEAS SE CREARON/EJECUTARON PARA LA MIGRACIÓN DE DATOS A LA BBDD */
/* const { migrateInteractions } = require("../controllers/vault/migrateInteractions") */
/*router.get('/dev/migrar-interacciones', migrateInteractions); */

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



// Rutas para la busqueda de peliculas
router.post('/movies', getMovies);

// Ruta para la pagina de información de una pelicula concreta
router.get('/movies/:imdbID', getMovieById);


  //Ruta para obtener la colección de un usuario para una pelicula concreta
  router.get('/user/coleccion/:imdbID', getUserCollectionByMovie);

  //Ruta para ➕AÑADIR una copia a la colección del usuario
  router.post('/user/coleccion', addCopyToCollection);

  //Ruta para ❌BORRAR una copia de la colección del usuario
  router.delete('/user/coleccion/:idCopia', deleteCopyFromCollection);

  //Ruta para 🖊️EDITAR una copia de la colección del usuario
  router.put('/user/coleccion/:idCopia', updateCopyFromCollection);


//Rutas de interacción
router.post('/user/rating', addRating);
router.get('/user/rating/:imdbID', getUserRatingForMovie);
router.get('/user/getwatchlist', getUserWatchlist);
router.post('/user/watchlist', toggleWatchlist);
router.put('/user/update-alias', updateAlias);

//Rutas de Perfil del usuario
router.get('/user/history', getUserHistory);
router.get('/user/history/:userId', getUserHistoryById); // otro usuario
router.put('/user/profile-image', updateProfileImage);
router.get('/user/badges', getUserBadges);
router.get('/user/badges/:userId', getUserBadgesById);   // Para otros usuarios


// Rutas para Inicio de sesion, Cerrar Sesión y Registro
router.post('/login', login);
router.post('/logout', logout);
router.post('/register', register);

//Ruta que comprueba si el usuario está loggeado o no
router.get('/auth/check-session', checkSession);

//RUTAS PARA FUNCIONES SOCIALES

router.post('/add/:friendId', addFriend);
router.delete('/remove/:friendId', removeFriend);
router.get('/list', getFriends);
router.get('/is-friend/:friendId', isFriend);

router.post('/user/search-users', searchUsers);
router.get('/user/profile/:userId', getUserProfileById);

router.get('/friend-activity', getFriendActivity);

router.post('/interactions/:id/like', likeInteraction);
router.post('/interactions/:id/unlike', unlikeInteraction);
router.post('/interactions/:id/comment', commentOnInteraction);
router.delete('/interactions/:interactionId/comment/:commentId', deleteCommentFromInteraction);

router.get('/notifications', getNotifications);
router.post('/notifications/mark-read', markNotificationsAsRead);
router.delete('/notifications/:id', deleteNotification);

// Ruta para enviar correo desde la página de contacto
router.post('/contact/send', sendMail);
router.post('/auth/request-password-reset', requestPasswordReset);
router.post('/auth/reset-password', resetPassword);


router.get('/badges/all', getAllBadges);
router.get('/badge/monthly', getMonthlyBadgeProgress);


module.exports = router;
