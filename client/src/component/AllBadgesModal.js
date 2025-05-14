import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import '../styles/AllBadgesModal.scss';

const AllBadgesModal = ({ onClose }) => {
    const [allBadges, setAllBadges] = useState([]);
    const [userBadges, setUserBadges] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        const fetchBadges = async () => {
            try {
                
                const resAll = await fetch(`${baseUrl}/badges/all`);
                const resUser = await fetch(`${baseUrl}/user/badges`, {
                    credentials: 'include'
                });

                const all = await resAll.json();
                const user = await resUser.json();

                setAllBadges(all);
                setUserBadges(user);

            } catch (err) {
                console.error('Error al cargar insignias:', err);
            }
        };

        fetchBadges();
    }, []);

    const isUnlocked = (id) => userBadges.some(b => b.id === id);
    const getBadgeData = (id) => userBadges.find(b => b.id === id);

    const sortedBadges = [...allBadges]
        .filter(badge => badge.id !== 'Insignia_Mes')
        .sort((a, b) => {
            const aUnlocked = isUnlocked(a.id);
            const bUnlocked = isUnlocked(b.id);
            return aUnlocked === bUnlocked ? 0 : aUnlocked ? -1 : 1;
        });

    return (
        <div className="allbadges-modal-overlay">
            <div className="allbadges-modal-content">
                <button className="allbadges-modal-close" onClick={onClose}>❌</button>
                <h2>🏅 Insignias disponibles</h2>
                <div className="allbadges-grid">
                    {sortedBadges.map((badge) => {
                        const unlocked = isUnlocked(badge.id);
                        const userBadge = getBadgeData(badge.id);

                        if (unlocked) {
                            console.log(`🏅 ${badge.nombre} → Fecha:`, userBadge?.fechaAdquisicion);
                        }

                        return (
                            <div key={badge.id} className={`allbadges-card ${unlocked ? 'unlocked' : 'locked'}`}>
                                <div className="allbadges-img-wrapper">
                                    <img
                                        src={`/${badge.imagen}`}
                                        alt={badge.nombre}
                                    />
                                    {!unlocked && <div className="allbadges-lock">🔒</div>}
                                </div>

                                <h4 className="allbadges-title">{badge.nombre}</h4>

                                {unlocked ? (
                                    <>
                                        <p className="allbadges-description">{badge.descripcion}</p>
                                        {userBadge?.fechaAdquisicion && (
                                            <p className="allbadges-date">
                                                Obtenida el {dayjs(userBadge.fechaAdquisicion).locale('es').format('D [de] MMMM [de] YYYY')}
                                            </p>
                                        )}
                                    </>
                                ) : (
                                    <p className="allbadges-condition">{badge.descripcion}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AllBadgesModal;
