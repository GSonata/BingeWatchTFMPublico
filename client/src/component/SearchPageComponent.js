import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchInputComponent from './SearchInputComponent';
import '../styles/SearchPageComponent.css';

const SearchPageComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('peliculas');

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
        try {
            const [movieRes, userRes] = await Promise.all([
                axios.post('http://localhost:3000/movies', { title: term }, { withCredentials: true }),
                axios.post('http://localhost:3000/user/search-users', { query: term }, { withCredentials: true }),
            ]);

            setMovies(movieRes.data || []);
            setUsers(userRes.data || []);
        } catch (err) {
            console.error('❌ Error en la búsqueda:', err.message);
            setMovies([]);
            setUsers([]);
        }
    };

    const handleMovieClick = (imdbID) => {
        navigate(`/movies/${imdbID}`);
    };

    const handleUserClick = (userId) => {
        navigate(`/friend/${userId}`);
    };
    

    return (
        <div className="search-page">
            <div className="search-input-wrapper">
                <SearchInputComponent />
            </div>

            <h2>🔍 A ver que encontramos en: <em>{query}</em></h2>

            <div className="tabs">
                <button
                    className={activeTab === 'peliculas' ? 'active' : ''}
                    onClick={() => setActiveTab('peliculas')}
                >
                    🎬 Películas ({movies.length})
                </button>
                <button
                    className={activeTab === 'usuarios' ? 'active' : ''}
                    onClick={() => setActiveTab('usuarios')}
                >
                    👤 Usuarios ({users.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'peliculas' && (
                    <div className="movie-results">
                        {movies.length === 0 && <p>No se encontraron películas.</p>}
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
                        {users.map((user) => (
                            <div
                                key={user._id}
                                className="search-card"
                                onClick={() => handleUserClick(user._id)}
                            >
                                {user.imagenPerfil && user.imagenPerfil.startsWith('data:image') ? (
                                    <img
                                        src={user.imagenPerfil}
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
                                        👤
                                    </div>
                                )}
                                <div>
                                    <h4>@{user.alias}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPageComponent;
