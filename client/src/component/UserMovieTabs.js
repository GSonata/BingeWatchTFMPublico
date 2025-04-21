import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animate } from 'animejs';

const UserMovieTabs = ({ coleccion, peliculasVistas, watchlist, activeTab, setActiveTab }) => {
    useEffect(() => {
        const cards = document.querySelectorAll('.card');

        cards.forEach(card => {
            card.style.opacity = 0;
            card.style.transform = 'scale(1.05) translateY(10px)';
        });

        requestAnimationFrame(() => {
            animate(cards, {
                opacity: [0, 1],
                scale: [1.05, 1],
                translateY: [10, 0],
                duration: 400,
                easing: 'easeOutExpo'
            });
        });
    }, [coleccion, peliculasVistas, watchlist, activeTab]);

    const handleBounce = (e) => {
        animate(e.currentTarget, {
            y: [0, -3, 0],
            duration: 250,
            easing: 'easeOutQuad'
        });
    };

    const renderColeccion = () => (
        <div className="cards-grid">
            {coleccion.map((pelicula) => (
                <Link to={`/movies/${pelicula.imdbID}`} key={pelicula.imdbID} className="card" onClick={handleBounce}>
                    <img
                        src={pelicula.poster}
                        alt={pelicula.title}
                        className="poster"
                    />
                    <div className="title">{pelicula.title} ({pelicula.año})</div>
                    <p>🎞️ {pelicula.numCopias} copia{pelicula.numCopias > 1 ? 's' : ''}</p>
                </Link>
            ))}
        </div>
    );
    
    const renderVistas = () => (
        <div className="cards-grid">
            {peliculasVistas.map((vista, idx) => (
                <Link to={`/movies/${vista.imdbID}`} key={idx} className="card" onClick={handleBounce}>
                    <img src={vista.poster} alt={vista.title} className="poster" />
                    <div className="title">{vista.title} ({vista.año})</div>
                    <p>⭐ {vista.nota} - {new Date(vista.fechaVisualizacion).toLocaleDateString()}</p>
                </Link>
            ))}
        </div>
    );

    const renderWatchlist = () => (
        <div className="cards-grid">
            {watchlist.map((peli) => (
                <Link to={`/movies/${peli.imdbID}`} key={peli.imdbID} className="card" onClick={handleBounce}>
                    <img src={peli.poster} alt={peli.title} className="poster" />
                    <div className="title">{peli.title} ({peli.año})</div>
                </Link>
            ))}
        </div>
    );

    return (
        <>
            <div className="tabCollect">
                <button
                    className={activeTab === 'coleccion' ? 'active' : ''}
                    onClick={() => setActiveTab('coleccion')}
                >
                    🎬 Colección
                </button>
                <button
                    className={activeTab === 'vistas' ? 'active' : ''}
                    onClick={() => setActiveTab('vistas')}
                >
                    👁️ Vistas
                </button>
                <button
                    className={activeTab === 'watchlist' ? 'active' : ''}
                    onClick={() => setActiveTab('watchlist')}
                >
                    📌 Watchlist
                </button>
            </div>

            <div className="tab-content-collection">
                {activeTab === 'coleccion' && renderColeccion()}
                {activeTab === 'vistas' && renderVistas()}
                {activeTab === 'watchlist' && renderWatchlist()}
            </div>
        </>
    );
};

export default UserMovieTabs;
