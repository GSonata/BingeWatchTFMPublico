import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "../styles/UserHistoryComponent.css";

const UserHistoryComponent = ({ coleccion, peliculasVistas, watchlist }) => {
    const [postersMap, setPostersMap] = useState({});
    const [activeTab, setActiveTab] = useState('coleccion');

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
                        const res = await axios.get(`http://localhost:3000/movies/${id}`);
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
    }, [peliculasVistas, watchlist]);

    const renderVistasGrid = () => (
        <div className="movie-grid">
            {peliculasVistas.map((vista, idx) => {
                const data = postersMap[vista.imdbID];
                const estrellas = '⭐'.repeat(Math.round(vista.nota)); 
                return data ? (
                    <Link to={`/movies/${vista.imdbID}`} key={vista.imdbID} className="movie-card">
                        <img src={data.poster} alt={data.title} />
                        <h4>{vista.title} ({vista.año})</h4>
                        <p>{estrellas}</p>
                        <p>{new Date(vista.fechaVisualizacion).toLocaleDateString()}</p>                    </Link>
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
