import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserMovieTabs from './UserMovieTabs';
import FilterComponent from './FilterComponent';
import "../styles/UserCollectionPages.scss";
import BannerComponent from './Subcomponentes/BannerComponent';
import FooterComponent from './Subcomponentes/FooterComponent';

const UserCollectionPage = () => {
    const [history, setHistory] = useState({
        coleccion: [],
        peliculasVistas: [],
        watchlist: []
    });

    const [filters, setFilters] = useState({
        nombre: '',
        estado: 'Todos',
        plataforma: 'Todas',
        genero: 'Todos',
        anoPelicula: 'Todos',
        orden: 'fecha_asc'
    });

    const [availableGenres, setAvailableGenres] = useState([]);
    const [availableEstados, setAvailableEstados] = useState([]);
    const [availableSoportes, setAvailableSoportes] = useState([]);

    const [filteredCollection, setFilteredCollection] = useState([]);
    const [filteredVistas, setFilteredVistas] = useState([]);
    const [filteredWatchlist, setFilteredWatchlist] = useState([]);

    const [activeTab, setActiveTab] = useState('coleccion');

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${baseUrl}/user/history`, {
                    withCredentials: true
                });

                if (res.data) {
                    const { coleccion = [], peliculasVistas = [], watchlist = [] } = res.data;
                    setHistory({ coleccion, peliculasVistas, watchlist });
                }
            } catch (err) {
                console.error('❌ Error al obtener el historial del usuario:', err.message);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        const source =
            activeTab === 'coleccion'
                ? history.coleccion
                : activeTab === 'vistas'
                    ? history.peliculasVistas
                    : history.watchlist;

        const generosUnicos = [...new Set(
            source
                .flatMap(p => p.genre || [])
                .filter(Boolean)
        )].sort();

        setAvailableGenres(generosUnicos);

        if (activeTab === 'coleccion') {
            const estadosUnicos = [...new Set(source.map(p => p.estado).filter(Boolean))].sort();
            const soportesUnicos = [...new Set(source.map(p => p.soporte).filter(Boolean))].sort();
            setAvailableEstados(estadosUnicos);
            setAvailableSoportes(soportesUnicos);
        } else {
            setAvailableEstados([]);
            setAvailableSoportes([]);
        }
    }, [history, activeTab]);

    useEffect(() => {
        const applyFilters = (movies) => {
            const filtradas = movies
                .filter(movie =>
                    !filters.nombre || movie.title?.toLowerCase().includes(filters.nombre.toLowerCase())
                )
                .filter(movie =>
                    filters.estado === 'Todos' || movie.estado === filters.estado
                )
                .filter(movie =>
                    filters.plataforma === 'Todas' || movie.soporte === filters.plataforma
                )
                .filter(movie =>
                    filters.genero === 'Todos' || (Array.isArray(movie.genre) && movie.genre.includes(filters.genero))
                )
                .filter(movie =>
                    filters.anoPelicula === 'Todos' || movie.año === parseInt(filters.anoPelicula)
                );

            const ordenadas = [...filtradas];

            const [tipoOrden, direccion] = (filters.orden || 'fecha_asc').split('_');

            ordenadas.sort((a, b) => {
                let valorA, valorB;

                if (tipoOrden === 'fecha') {
                    valorA = new Date(a.fechaAñadida || a.fechaVisualizacion || 0);
                    valorB = new Date(b.fechaAñadida || b.fechaVisualizacion || 0);
                } else {
                    valorA = a.año || 0;
                    valorB = b.año || 0;
                }

                return direccion === 'asc' ? valorA - valorB : valorB - valorA;
            });

            return ordenadas;
        };

        if (activeTab === 'coleccion') {
            setFilteredCollection(applyFilters(history.coleccion));
        } else if (activeTab === 'vistas') {
            setFilteredVistas(applyFilters(history.peliculasVistas));
        } else if (activeTab === 'watchlist') {
            setFilteredWatchlist(applyFilters(history.watchlist));
        }
    }, [history, filters, activeTab]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: name === 'orden' ? (value || 'fecha_asc') : value
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            nombre: '',
            estado: 'Todos',
            plataforma: 'Todas',
            genero: 'Todos',
            anoPelicula: 'Todos',
            orden: 'fecha_asc'
        });
    };

    const prettyOrdenLabels = {
        'fecha_asc': 'Fecha de adición ↑',
        'fecha_desc': 'Fecha de adición ↓',
        'año_asc': 'Año de la película ↑',
        'año_desc': 'Año de la película ↓'
    };

    return (
        <>
            <BannerComponent />
            <div className="user-collection-page">
                <FilterComponent
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    availableGenres={availableGenres}
                    availableEstados={availableEstados}
                    availableSoportes={availableSoportes}
                    activeTab={activeTab}
                    prettyOrdenLabels={prettyOrdenLabels}
                />

                <main className="content-panel">
                    <h1>Tu colección</h1>
                    <UserMovieTabs
                        coleccion={filteredCollection}
                        peliculasVistas={filteredVistas}
                        watchlist={filteredWatchlist}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                    />
                </main>
            </div>
            <FooterComponent />
        </>
    );
};

export default UserCollectionPage;
