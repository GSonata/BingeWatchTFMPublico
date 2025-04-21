module.exports = {
    // ✅ Ver 10 películas en marzo
    check_reto_marzo: (user) => {
        const now = new Date();
        console.log('🔎 Comprobando reto_marzo...');
        if (now.getMonth() !== 2) {
            console.log('❌ No es marzo, no se puede cumplir el reto.');
            return null;
        }

        const vistasMarzo = user.peliculasVistas.filter(peli => {
            const date = new Date(peli.fechaVisualizacion);
            return date.getMonth() === 2;
        });

        const alreadyHas = user.insignias.some(b => b.idInsignia === 'reto_marzo');
        if (vistasMarzo.length >= 1 && !alreadyHas) {
            console.log('✅ Usuario cumple para reto_marzo');
            return {
                idInsignia: 'reto_marzo',
                fechaAdquisicion: new Date()
            };
        }

        console.log('ℹ️ Usuario no cumple o ya tiene la insignia.');
        return null;
    },

    // ✅ Ver 10 películas en abril
    check_reto_abril: (user) => {
        const now = new Date();
        console.log('🔎 Comprobando reto_abril...');

        console.log(now.getMonth.toString);

        if (now.getMonth() !== 3) {
            console.log('❌ No es abril, no se puede cumplir el reto.');
            return null;
        }

        const vistasAbril = user.peliculasVistas.filter(peli => {
            const date = new Date(peli.fechaVisualizacion);
            return date.getMonth() === 3;
        });

        console.log(`🎬 Películas vistas en abril: ${vistasAbril.length}`);

        const alreadyHas = user.insignias.some(b => b.idInsignia === 'reto_abril');
        if (vistasAbril.length >= 1 && !alreadyHas) {
            console.log('✅ Usuario cumple para reto_abril');
            return {
                idInsignia: 'reto_abril',
                fechaAdquisicion: new Date()
            };
        }

        console.log('ℹ️ Usuario no cumple o ya tiene la insignia.');
        return null;
    },


    check_nota_perfecta: (user) => {
        console.log('🔎 Comprobando nota_perfecta...');
        const perfectRatings = user.peliculasVistas.filter(p => p.nota === 5);
        console.log(`⭐ Películas calificadas con 5 estrellas: ${perfectRatings.length}`);
        const alreadyHas = user.insignias.some(b => b.idInsignia === 'nota_perfecta');
        if (perfectRatings.length >= 5 && !alreadyHas) {
            console.log('✅ Usuario cumple para nota_perfecta');
            return { idInsignia: 'nota_perfecta', fechaAdquisicion: new Date() };
        }
        return null;
    },

    check_coleccionista: (user) => {
        console.log('🔎 Comprobando coleccionista...');
        console.log(`📀 Copias físicas: ${user.coleccion.length}`);
        const alreadyHas = user.insignias.some(b => b.idInsignia === 'coleccionista');
        if (user.coleccion.length >= 10 && !alreadyHas) {
            console.log('✅ Usuario cumple para coleccionista');
            return { idInsignia: 'coleccionista', fechaAdquisicion: new Date() };
        }
        return null;
    },

    check_revisionista: async (user) => {
        const Movie = require('../../models/Movie');
        let count = 0;
        console.log('🔎 Comprobando revisionista...');

        for (const vista of user.peliculasVistas) {
            const movie = await Movie.findOne({ imdbID: vista.imdbID });
            if (movie && parseInt(movie.year) < 1990) count++;
        }

        console.log(`📼 Películas antes de 1990 vistas: ${count}`);
        const alreadyHas = user.insignias.some(b => b.idInsignia === 'revisionista');
        if (count >= 20 && !alreadyHas) {
            console.log('✅ Usuario cumple para revisionista');
            return { idInsignia: 'revisionista', fechaAdquisicion: new Date() };
        }
        return null;
    },

    check_watcher: (user) => {
        console.log('🔎 Comprobando watcher...');
        const watchedFromWatchlist = user.peliculasVistas.filter(p =>
            user.watchlist.includes(p.imdbID)
        );
        console.log(`👁️ Películas vistas desde la watchlist: ${watchedFromWatchlist.length}`);
        const alreadyHas = user.insignias.some(b => b.idInsignia === 'watcher');
        if (watchedFromWatchlist.length >= 5 && !alreadyHas) {
            console.log('✅ Usuario cumple para watcher');
            return { idInsignia: 'watcher', fechaAdquisicion: new Date() };
        }
        return null;
    },

    check_binge_night: (user) => {
        console.log('🔎 Comprobando binge_night...');
        const fechas = {};

        user.peliculasVistas.forEach(p => {
            const date = new Date(p.fechaVisualizacion).toISOString().split('T')[0];
            fechas[date] = (fechas[date] || 0) + 1;
        });

        console.log('📅 Conteo de películas por día:', fechas);
        const hasBinge = Object.values(fechas).some(count => count >= 3);
        const alreadyHas = user.insignias.some(b => b.idInsignia === 'binge_night');
        if (hasBinge && !alreadyHas) {
            console.log('✅ Usuario cumple para binge_night');
            return { idInsignia: 'binge_night', fechaAdquisicion: new Date() };
        }
        return null;
    },

    check_reto_lowRate: async (user) => {
        const Movie = require('../../models/Movie');
        let count = 0;
        console.log('🔎 Comprobando reto_lowRate...');

        for (const vista of user.peliculasVistas) {
            const movie = await Movie.findOne({ imdbID: vista.imdbID });
            if (movie && parseInt(movie.metascore) < 40) count++;
        }

        console.log(`🎞️ Películas con Metascore < 40: ${count}`);
        const alreadyHas = user.insignias.some(b => b.idInsignia === 'reto_lowRate');
        if (count >= 20 && !alreadyHas) {
            console.log('✅ Usuario cumple para reto_lowRate');
            return { idInsignia: 'reto_lowRate', fechaAdquisicion: new Date() };
        }
        return null;
    }
};
