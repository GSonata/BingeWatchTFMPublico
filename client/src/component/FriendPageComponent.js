import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom';
import UserHistoryComponent from './UserHistoryComponent';
import UserBadgesComponent from './UserBadgesComponent';
import '../styles/UserPageComponent.css';

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

    useEffect(() => {
        const fetchFriendData = async () => {
            try {
                const [profileRes, historyRes, friendRes] = await Promise.all([
                    axios.get(`http://localhost:3000/user/profile/${userId}`, { withCredentials: true }),
                    axios.get(`http://localhost:3000/user/history/${userId}`, { withCredentials: true }),
                    axios.get(`http://localhost:3000/is-friend/${userId}`, { withCredentials: true })
                ]);

                setUserData(profileRes.data);
                setHistory(historyRes.data);
                setIsFriend(friendRes.data.isFriend);
            } catch (err) {
                console.error('❌ Error al obtener datos del amigo:', err.message);
            }
        };

        fetchFriendData();
    }, [userId]);

    const toggleFriend = async () => {
        try {
            if (isFriend) {
                await axios.delete(`http://localhost:3000/remove/${userId}`, { withCredentials: true });
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
                    showClass: {
                        popup: 'swal2-toast-show'
                    },
                    hideClass: {
                        popup: 'swal2-toast-hide'
                    },
                    customClass: {
                        popup: 'swal2-toast-custom red'
                    }
                });


            } else {
                await axios.post(`http://localhost:3000/add/${userId}`, {}, { withCredentials: true });
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
                    showClass: {
                        popup: 'swal2-toast-show'
                    },
                    hideClass: {
                        popup: 'swal2-toast-hide'
                    },
                    customClass: {
                        popup: 'swal2-toast-custom green'
                    }
                });

            }
        } catch (err) {
            console.error('❌ Error al modificar amistad:', err.message);
            Swal.fire({
                title: 'Error',
                text: 'Algo salió mal al modificar la amistad.',
                icon: 'error',
                background: '#1c1c1c',
                color: '#f5f5f5',
            });
        }
    };


    if (!userData) return <p>Cargando perfil...</p>;

    return (
        <div className="user-page-container">
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

                    <div className="user-stats">
                        🎬 <strong>Colección:</strong> {history.coleccion.length} &nbsp;&nbsp;
                        👁️ <strong>Vistas:</strong> {history.peliculasVistas.length}
                    </div>
                </div>
            </div>

            <UserBadgesComponent userId={userId} />
            <h2>📚 Historial de actividad</h2>

            <UserHistoryComponent
                coleccion={history.coleccion}
                peliculasVistas={history.peliculasVistas}
                watchlist={history.watchlist}
            />
        </div>
    );
};

export default FriendPageComponent;
