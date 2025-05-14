const User = require('../models/User');
const badgeChecks = require('../public/javascripts/badgeCheck');
const Badge = require('../models/Badge');
const Interaction = require('../models/Interactions');
const dayjs = require('dayjs');
require('dayjs/locale/es');
dayjs.locale('es');

const checkAllBadges = async (userId) => {
  console.log('🔍 Ejecutando checkAllBadges para usuario:', userId);

  let user = await User.findById(userId);
  if (!user) {
    console.log('❌ Usuario no encontrado');
    return [];
  }

  const allBadges = await Badge.find({});
  let nuevasInsignias = [];

  for (const badge of allBadges) {
    const checkFn = badgeChecks[`check_${badge.id}`];
    if (!checkFn) continue;

    const alreadyHas = user.insignias.some(b => b.idInsignia === badge.id);

    if (!alreadyHas) {
      const result = await checkFn(user);
      if (result) {
        console.log(`🏅 Nueva insignia obtenida: ${badge.id}`);

        // Añadir la insignia al usuario
        user.insignias.push(result);
        nuevasInsignias.push(badge);

        // 💬 Crear una nueva interacción en el feed
        await Interaction.create({
          type: 'badge',
          userId: user._id,
          badgeId: badge._id,
          date: new Date(),
          likes: [],
          comments: []
        });
      }

    }
  }

  await user.save();
  console.log('✅ Insignias actualizadas. Nuevas:', nuevasInsignias.map(b => b.id));
  console.log('🎖️ Insignias actuales del usuario:', user.insignias.map(b => b.idInsignia));
  return nuevasInsignias;
};

const getAllBadges = async (req, res) => {
  try {
    const badges = await Badge.find();
    res.json(badges);
  } catch (err) {
    res.status(500).json({ error: 'Error al cargar todas las insignias' });
  }
};

const getMonthlyBadgeProgress = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const userId = req.session.user._id;

    const now = dayjs();
    const currentMonth = now.month() + 1;
    const currentYear = now.year();

    const badge = await Badge.findOne({
      esMensual: true,
      mes: currentMonth,
      año: currentYear
    });

    if (!badge) return res.json(null);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    let actividades = [];
    if (badge.tipo === 'vista') actividades = user.peliculasVistas;
    else if (badge.tipo === 'coleccion') actividades = user.coleccion;
    else if (badge.tipo === 'watchlist') actividades = user.watchlist;

    const total = actividades.filter(item => {
      const fecha = dayjs(item.fechaVisualizacion || item.fechaAñadida);
      return fecha.month() + 1 === currentMonth && fecha.year() === currentYear;
    }).length;

    const progreso = Math.min((total / badge.objetivo) * 100, 100);

    res.json({
      ...badge._doc,
      progreso: Math.round(progreso),
      completado: progreso >= 100
    });
  } catch (err) {
    console.error('❌ Error al obtener progreso mensual:', err);
    res.status(500).json({ message: 'Error al obtener la insignia mensual' });
  }
};


module.exports = {
  checkAllBadges,
  getAllBadges,
  getMonthlyBadgeProgress
};
