import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { animate } from 'animejs';
import { FaTrophy } from 'react-icons/fa';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import '../styles/UserBadgesComponent.scss';
import AllBadgesModal from './AllBadgesModal';

const UserBadgesComponent = ({ userId }) => {
    const [badges, setBadges] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const tooltipsRef = useRef([]);

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const url = userId
                    ? `${baseUrl}/user/badges/${userId}`
                    : `${baseUrl}/user/badges`;

                const res = await axios.get(url, { withCredentials: true });
                setBadges(res.data || []);
            } catch (err) {
                console.error('Error al obtener insignias:', err.message);
            }
        };

        fetchBadges();
    }, [userId]);

    const handleMouseEnter = (index) => {
        const tooltip = tooltipsRef.current[index];
        if (!tooltip) return;

        tooltip.style.visibility = 'visible';
        animate(tooltip, {
            opacity: [0, 1],
            scale: [0.8, 1],
            easing: 'easeOutBack',
            duration: 300
        });
    };

    const handleMouseLeave = (index) => {
        const tooltip = tooltipsRef.current[index];
        if (!tooltip) return;

        animate(tooltip, {
            opacity: [1, 0],
            scale: [1, 0.8],
            easing: 'easeInBack',
            duration: 200,
            complete: () => {
                tooltip.style.visibility = 'hidden';
            }
        });
    };

    return (
        <div className="badges-container">
            <div className='badges-info'>
                <h3><FaTrophy style={{ marginRight: '0.5rem' }} /> Insignias obtenidas</h3>
                {!userId && (
                    <button onClick={() => setShowModal(true)} className="view-all-badges-btn">
                        Ver todas las insignias
                    </button>
                )}
            </div>

            {showModal && <AllBadgesModal onClose={() => setShowModal(false)} />}

            <div className="badges-bar">
                {badges.length === 0 && (
                    <p className="no-badges-msg">¡Empieza a coleccionar!</p>
                )}

                {badges.map((badge, index) => (
                    <div
                        key={badge.id || index}
                        className="badge-card"
                        onMouseEnter={() => handleMouseEnter(index)}
                        onMouseLeave={() => handleMouseLeave(index)}
                    >
                        {badge.imagen ? (
                            <img src={`/${badge.imagen}`} alt={badge.nombre || 'Insignia'} />
                        ) : (
                            <div
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--gray-medium)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem',
                                    color: 'var(--text-color)',
                                }}
                            >
                                ❔
                            </div>
                        )}
                        <div
                            className="tooltip"
                            ref={(el) => (tooltipsRef.current[index] = el)}
                        >
                            <strong>{badge.nombre}</strong><br />
                            {badge.descripcion}<br />
                            <em>
                                {badge.fechaAdquisicion
                                    ? `Obtenida el ${dayjs(badge.fechaAdquisicion).locale('es').format('D [de] MMMM [de] YYYY')}`
                                    : 'Fecha no disponible'}
                            </em>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserBadgesComponent;
