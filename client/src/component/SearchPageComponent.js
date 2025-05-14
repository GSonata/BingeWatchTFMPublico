import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faUser, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../styles/SearchPageComponent.scss';

import BannerComponent from "./Subcomponentes/BannerComponent";
import FooterComponent from "./Subcomponentes/FooterComponent";

const SearchPageComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('peliculas');
    const [isLoading, setIsLoading] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchTerm = params.get('query') || '';
        setQuery(searchTerm);

        if (searchTerm.trim()) {
            searchEverything(searchTerm);
        } else {
            setMovies([]);
            setUsers([]);
        }
    }, [location.search]);

    const searchEverything = async (term) => {
        setIsLoading(true);
        try {
            const [movieRes, userRes] = await Promise.all([
                axios.post(`${baseUrl}/movies`, { title: term }, { withCredentials: true }),
                axios.post(`${baseUrl}/user/search-users`, { query: term }, { withCredentials: true }),
            ]);

            setMovies(movieRes.data || []);
            setUsers(userRes.data || []);
        } catch (err) {
            console.error('❌ Error en la búsqueda:', err.message);
            setMovies([]);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMovieClick = (imdbID) => {
        navigate(`/movies/${imdbID}`);
    };

    const handleUserClick = (userId) => {
        navigate(`/friend/${userId}`);
    };

    return (
        <>
            <BannerComponent />
            {isLoading && (
                <div className="loading-modal">
                    <div className="spinner"></div>
                    <p>Cargando resultados...</p>
                </div>
            )}
            <div className="search-page">
                <h2>
                    <FontAwesomeIcon icon={faMagnifyingGlass} /> A ver que encontramos en: <em>{query}</em>
                </h2>
                <p>Recuerda, nuestra base de datos SOLO busca nombres de las películas en inglés por ahora.</p>
                <div className="tabs">
                    <button
                        className={activeTab === 'peliculas' ? 'active' : ''}
                        onClick={() => setActiveTab('peliculas')}
                    >
                        <FontAwesomeIcon icon={faFilm} /> Películas ({movies.length})
                    </button>

                    <button
                        className={activeTab === 'usuarios' ? 'active' : ''}
                        onClick={() => setActiveTab('usuarios')}
                    >
                        <FontAwesomeIcon icon={faUser} /> Usuarios ({users.length})
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'peliculas' && (
                        <div className="movie-results">
                            {movies.length === 0 && (
                                <div className="no-results">
                                    <img src="/images/no-find.png" alt="Sin resultados" className="no-results-logo" />
                                    <h3>Sin resultados</h3>
                                    <p>Recuerda, nuestra base de datos SOLO busca nombres de las películas en inglés por ahora.</p>
                                </div>
                            )}
                            {movies.map((movie) => (
                                <div
                                    key={movie.imdbID}
                                    className="search-card"
                                    onClick={() => handleMovieClick(movie.imdbID)}
                                >
                                    <img src={movie.poster} alt={movie.title} width="80" />
                                    <div>
                                        <h4>{movie.title} ({movie.year})</h4>
                                        <p>{movie.plot}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'usuarios' && (
                        <div className="user-results">
                            {users.length === 0 && <p>No se encontraron usuarios.</p>}
                            {users.map((user) => {
                                let imagenBase64 = null;

                                if (user.imagenPerfil) {
                                    imagenBase64 = user.imagenPerfil.startsWith('data:image')
                                        ? user.imagenPerfil
                                        : `data:image/jpeg;base64,${user.imagenPerfil}`;
                                }

                                return (
                                    <div
                                        key={user._id}
                                        className="search-card"
                                        onClick={() => handleUserClick(user._id)}
                                    >
                                        {imagenBase64 ? (
                                            <img
                                                src={imagenBase64}
                                                alt="perfil"
                                                width="60"
                                                height="60"
                                                style={{ borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    borderRadius: '50%',
                                                    backgroundColor: 'var(--gray-medium)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    color: 'var(--text-color)',
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faUser} />
                                            </div>
                                        )}
                                        <div>
                                            <h4>@{user.alias}</h4>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </>
    );
};

export default SearchPageComponent;
