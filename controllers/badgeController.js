const User = require('../models/User');
const badgeChecks = require('../public/javascripts/badgeCheck');
const Badge = require('../models/Badge');
const Interaction = require('../models/Interactions');


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

module.exports = {
    checkAllBadges,
    getAllBadges
};
