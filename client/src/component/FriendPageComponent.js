import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom';
import { FaBox, FaEye, FaBookOpen } from 'react-icons/fa';
import UserHistoryComponent from './UserHistoryComponent';
import UserBadgesComponent from './UserBadgesComponent';
import FooterComponent from './Subcomponentes/FooterComponent';
import BannerComponent from './Subcomponentes/BannerComponent';
import '../styles/UserPageComponent.scss';

const FriendPageComponent = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [history, setHistory] = useState({
        coleccion: [],
        peliculasVistas: [],
        watchlist: []
    });
    const [isFriend, setIsFriend] = useState(false);
    const [hover, setHover] = useState(false);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const [profileRes, historyRes, friendRes] = await Promise.all([
                    axios.get(`${baseUrl}/user/profile/${userId}`, { withCredentials: true }),
                    axios.get(`${baseUrl}/user/history/${userId}`, { withCredentials: true }),
                    axios.get(`${baseUrl}/is-friend/${userId}`, { withCredentials: true })
                ]);

                setUserData(profileRes.data);
                setHistory(historyRes.data);
                setIsFriend(friendRes.data.isFriend);
            } catch (err) {
                console.error('❌ Error al obtener datos del amigo:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriendData();
    }, [userId]);

    const toggleFriend = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL;
            if (isFriend) {
                await axios.delete(`${baseUrl}/remove/${userId}`, { withCredentials: true });
                setIsFriend(false);
                Swal.fire({
                    text: `Has dejado de seguir a @${userData.alias}`,
                    icon: 'error',
                    toast: true,
                    position: 'bottom',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    background: '#1c1c1c',
                    color: '#f5f5f5',
                });
            } else {
                await axios.post(`${baseUrl}/add/${userId}`, {}, { withCredentials: true });
                setIsFriend(true);
                Swal.fire({
                    text: `Ahora sigues a @${userData.alias}`,
                    icon: 'success',
                    toast: true,
                    position: 'bottom',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: false,
                    background: '#1c1c1c',
                    color: '#f5f5f5',
                });
            }
        } catch (err) {
            Swal.fire('❌ Error', 'No se pudo modificar la amistad.', 'error');
        }
    };

    return (
        <>
            {isLoading && (
                <div className="loading-modal">
                    <div className="spinner"></div>
                    <p>Cargando perfil...</p>
                </div>
            )}
            {!isLoading && (
                <>
                    <BannerComponent />
                    <div className="user-page-container">
                        <div className="user-top-section">
                            <div className="user-header">
                                <div className="user-profile-img-container">
                                    {userData.imagenPerfil && (
                                        <img
                                            src={`data:image/jpeg;base64,${userData.imagenPerfil}`}
                                            alt="Perfil"
                                            className="user-profile-img"
                                        />
                                    )}
                                </div>
                                <div className="user-info">
                                    <div className="user-info-header">
                                        <span className="username">@{userData.alias}</span>
                                        <button
                                            className={`friend-button ${isFriend ? 'added' : ''}`}
                                            onClick={toggleFriend}
                                            onMouseEnter={() => setHover(true)}
                                            onMouseLeave={() => setHover(false)}
                                        >
                                            {isFriend ? (hover ? 'Dejar de seguir' : 'Siguiendo') : '➕ Seguir'}
                                        </button>
                                    </div>
                                    <div className="user-stats-box">
                                        <div className="stat">
                                            <FaBox />
                                            <div className="label">Colección</div>
                                            <div className="value">{history.coleccion.length}</div>
                                        </div>
                                        <div className="divider"></div>
                                        <div className="stat">
                                            <FaEye />
                                            <div className="label">Vistas</div>
                                            <div className="value">{history.peliculasVistas.length}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <UserBadgesComponent userId={userId} />
                        </div>

                        <h2 className="history-title">
                            <FaBookOpen style={{ marginRight: '0.5rem' }} />
                            Historial de actividad
                        </h2>

                        <UserHistoryComponent
                            coleccion={history.coleccion}
                            peliculasVistas={history.peliculasVistas}
                            watchlist={history.watchlist}
                        />
                    </div>
                    <FooterComponent />
                </>
            )}
        </>
    );
};

export default FriendPageComponent;
