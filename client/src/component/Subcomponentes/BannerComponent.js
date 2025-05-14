import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import SearchInputComponent from '../SearchInputComponent';
import '../../styles/Banner.scss';

const BannerComponent = () => {
    const {
        isAuthenticated,
        user,
        loading,
        logout,
        setIsAuthenticated
    } = useAuth();

    const [userData, setUserData] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessionUser = async () => {
            try {
                const res = await axios.get('http://localhost:3000/auth/check-session', {
                    withCredentials: true
                });
                if (res.data && res.data.user) {
                    setUserData(res.data.user);
                }
            } catch (err) {
                console.error('Error al obtener datos del usuario:', err.message);
            }
        };

        fetchSessionUser();
    }, []);

    const scrollToBanner = () => {
        const bannerElement = document.querySelector('.banner');
        if (bannerElement) {
            bannerElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
            logout();
            setIsAuthenticated(false);

            Swal.fire({
                title: '🚪 Sesión cerrada, ¡nos vemos pronto!',
                text: 'Has cerrado sesión correctamente.',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
            });

            navigate('/');
        } catch (err) {
            console.error('Error al cerrar sesión:', err.message);

            Swal.fire({
                icon: 'error',
                title: '🚫 Error',
                text: 'No se pudo cerrar sesión correctamente.',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
            });
        }
    };


    if (loading) return null;

    return (
        <>
            <header className="banner">
                <div className="banner-left">
                    <div className="banner-logo-group">
                        <Link to="/" className="banner-logo-link">
                            <img src="/images/bw-logo.png" alt="Logo" className="banner-logo" />
                            <h1 className="banner-title">
                                Binge<span className="banner-W">Watch</span>
                            </h1>
                        </Link>
                    </div>

                    {isAuthenticated && <SearchInputComponent />}
                </div>


                <div className="banner-right">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/">Volver a la página principal</Link>
                            <Link to="/login">Iniciar sesión</Link>
                        </>
                    ) : (
                        <>
                            <div className="banner-avatar-container" onClick={toggleMenu}>
                                {userData?.alias && <p className="banner-user-alias">@{userData.alias}</p>}
                                {userData?.imagenPerfil ? (
                                    <img
                                        src={`data:image/jpeg;base64,${userData.imagenPerfil}`}
                                        alt="Perfil"
                                        className="banner-avatar"
                                    />
                                ) : (
                                    <div className="default-avatar">👤</div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {isMenuOpen && (
                    <div className="profile-menu">
                        <ul>
                            <li><Link to="/user" onClick={closeMenu}>Mi Perfil</Link></li>
                            <li><Link to="/collection" onClick={closeMenu}>Mi Colección</Link></li>
                            <li><Link to="/friend-activity" onClick={closeMenu}>Actividad</Link></li>
                            <li>
                                <button className="logout-button" onClick={() => {
                                    closeMenu();
                                    handleLogout();
                                }}>
                                    Cerrar Sesión
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </header>

            <button className="scroll-to-banner-btn" onClick={scrollToBanner}>
                <img src="/images/iconos/flecha.svg" alt="scroll to banner" />
            </button>
        </>
    );
};

export default BannerComponent;
