import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import "../styles/UserHistoryComponent.scss";

const UserHistoryComponent = ({ coleccion, peliculasVistas, watchlist }) => {
    const [postersMap, setPostersMap] = useState({});
    const [activeTab, setActiveTab] = useState('coleccion');
    const baseUrl = process.env.REACT_APP_API_URL;

    const renderStars = (nota) => {
        const stars = [];
        const fullStars = Math.floor(nota);
        const hasHalfStar = nota % 1 >= 0.25 && nota % 1 < 0.75;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`star-full-${i}`} color="#3b9ded" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="star-half" color="#3b9ded" />);
        }

        return <div className="stars">{stars}</div>;
    };

    useEffect(() => {
        const fetchPosters = async () => {
            const imdbIDs = [
                ...new Set([
                    ...peliculasVistas.map(p => p.imdbID),
                    ...watchlist.map(w => w.imdbID)
                ])
            ];

            try {
                const posters = await Promise.all(
                    imdbIDs.map(async id => {
                        const res = await axios.get(`${baseUrl}/movies/${id}`);
                        return { imdbID: id, poster: res.data.poster, title: res.data.title };
                    })
                );

                const map = {};
                posters.forEach(p => {
                    map[p.imdbID] = { poster: p.poster, title: p.title };
                });

                setPostersMap(map);
            } catch (err) {
                console.error("Error al obtener posters:", err.message);
            }
        };

        fetchPosters();
    }, [peliculasVistas, watchlist, baseUrl]);

    const renderVistasGrid = () => (
        <div className="movie-grid">
            {peliculasVistas.map((vista) => {
                const data = postersMap[vista.imdbID];
                return data ? (
                    <Link to={`/movies/${vista.imdbID}`} key={vista.imdbID} className="movie-card">
                        <img src={data.poster} alt={data.title} />
                        <h4>{vista.title} ({vista.año})</h4>
                        {renderStars(vista.nota)}
                        <p>{new Date(vista.fechaVisualizacion).toLocaleDateString()}</p>
                    </Link>
                ) : null;
            })}
        </div>
    );

    const renderWatchlistGrid = () => (
        <div className="movie-grid">
            {watchlist.map((movie) => {
                const data = postersMap[movie.imdbID];
                return data ? (
                    <Link to={`/movies/${movie.imdbID}`} key={movie.imdbID} className="movie-card">
                        <img src={data.poster} alt={movie.title} />
                        <h4>{movie.title} ({movie.año})</h4>
                    </Link>
                ) : null;
            })}
        </div>
    );

    return (
        <div className="user-history-tabs">
            <div className="tabs">
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

            <div className="tab-content">
                {activeTab === 'coleccion' && (
                    <div className="movie-grid">
                        {coleccion.map((pelicula) => (
                            <Link to={`/movies/${pelicula.imdbID}`} key={pelicula.imdbID} className="movie-card">
                                <img src={pelicula.poster} alt={pelicula.title} />
                                <h4>{pelicula.title} ({pelicula.año})</h4>
                                <p>🎞️ {pelicula.numCopias} copia{pelicula.numCopias > 1 ? 's' : ''}</p>
                            </Link>
                        ))}
                    </div>
                )}
                {activeTab === 'vistas' && renderVistasGrid()}
                {activeTab === 'watchlist' && renderWatchlistGrid()}
            </div>
        </div>
    );
};

export default UserHistoryComponent;
