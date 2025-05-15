import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { animate } from 'animejs';
import {
    FaStar,
    FaStarHalfAlt,
    FaFilm,
    FaEye,
    FaBookmark,
    FaCompactDisc
} from 'react-icons/fa';

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

    const renderStars = (nota) => {
        const stars = [];
        const fullStars = Math.floor(nota);
        const hasHalfStar = nota % 1 >= 0.25 && nota % 1 < 0.75;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-${i}`} color="#3b9ded" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="star-half" color="#3b9ded" />);
        }

        return <div className="stars">{stars}</div>;
    };

    const renderPlaceholder = (message) => (
        <div className="empty-placeholder">
            <img src="/images/bw-logo-white.png" alt="Vacío" />
            <p>{message}</p>
        </div>
    );

    const renderColeccion = () => (
        <div className="collection-wrapper">
            {coleccion.length === 0 && renderPlaceholder("Aún no tienes ninguna película en tu colección.")}
            <div className="cards-grid">
                {coleccion.map((pelicula) => (
                    <Link to={`/movies/${pelicula.imdbID}`} key={pelicula.imdbID} className="card" onClick={handleBounce}>
                        <img src={pelicula.poster} alt={pelicula.title} className="poster" />
                        <div className="title">{pelicula.title} ({pelicula.año})</div>
                        <div className="copias">
                            <FaCompactDisc style={{ marginRight: '0.3rem' }} />
                            {pelicula.numCopias} copia{pelicula.numCopias > 1 ? 's' : ''}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

    const renderVistas = () => (
        <div className="collection-wrapper">
            {peliculasVistas.length === 0 && renderPlaceholder("Todavía no has marcado ninguna película como vista.")}
            <div className="cards-grid">
                {peliculasVistas.map((vista) => (
                    <Link to={`/movies/${vista.imdbID}`} key={vista.imdbID} className="card" onClick={handleBounce}>
                        <img src={vista.poster} alt={vista.title} className="poster" />
                        <div className="title">{vista.title} ({vista.año})</div>
                        <div className="vistas-info">
                            {renderStars(vista.nota)}
                            <span className='fechaVisualizacion'>{new Date(vista.fechaVisualizacion).toLocaleDateString()}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );

    const renderWatchlist = () => (
        <div className="collection-wrapper">
            {watchlist.length === 0 && renderPlaceholder("Tu lista de películas por ver está vacía.")}
            <div className="cards-grid">
                {watchlist.map((peli) => (
                    <Link to={`/movies/${peli.imdbID}`} key={peli.imdbID} className="card" onClick={handleBounce}>
                        <img src={peli.poster} alt={peli.title} className="poster" />
                        <div className="title">{peli.title} ({peli.año})</div>
                        <div className="copias">En tu lista</div>
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <div className="tabCollect">
                <button
                    className={activeTab === 'coleccion' ? 'active' : ''}
                    onClick={() => setActiveTab('coleccion')}
                >
                    <FaFilm /> Colección
                </button>
                <button
                    className={activeTab === 'vistas' ? 'active' : ''}
                    onClick={() => setActiveTab('vistas')}
                >
                    <FaEye /> Vistas
                </button>
                <button
                    className={activeTab === 'watchlist' ? 'active' : ''}
                    onClick={() => setActiveTab('watchlist')}
                >
                    <FaBookmark /> Watchlist
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
