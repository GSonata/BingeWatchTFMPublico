import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReactStars from 'react-stars';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import ConfirmRatingModal from './Subcomponentes/Modales/ConfirmRatingModal';

import "../styles/UserInteracion.scss"

const Toast = Swal.mixin({
    toast: true,
    position: 'bottom',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: '#2a2f36',
    color: '#ffffff'
  });
  

const UserInteractionComponent = ({ imdbID }) => {
    const [rating, setRating] = useState(0);
    const [watchlisted, setWatchlisted] = useState(false);
    const [pendingRating, setPendingRating] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/user/rating/${imdbID}`, {
                    withCredentials: true
                });
                if (res.data.nota) {
                    setRating(res.data.nota);
                }
            } catch (err) {
                console.error('Error al obtener calificación:', err.message);
            }
        };

        fetchRating();
    }, [imdbID]);

    const handleRatingChange = (newRating) => {
        setPendingRating(newRating);
        setIsConfirmModalOpen(true);
    };

    const handleConfirmRating = async (confirmedRating) => {
        try {
            const res = await axios.post(
                'http://localhost:3000/user/rating',
                {
                    imdbID,
                    nota: confirmedRating,
                    fecha: new Date().toISOString()
                },
                { withCredentials: true }
            );

            setRating(confirmedRating);
            setIsConfirmModalOpen(false);

            // Opcional: feedback visual
            Toast.fire({ icon: 'success', title: 'Calificación guardada' });

            if (res.data.nuevasInsignias?.length > 0) {
                res.data.nuevasInsignias.forEach((badge) => {
                    Swal.fire({
                        title: `🎉 ¡Nueva insignia desbloqueada!`,
                        text: `${badge.nombre}: ${badge.descripcion}`,
                        imageUrl: `/images/badges/${badge.id}.png`,
                        imageHeight: 100,
                        confirmButtonText: '¡Genial!'
                    });
                });
            }

        } catch (err) {
            Toast.fire({ icon: 'error', title: 'No se pudo guardar la calificación' });
        }
    };

    const toggleWatchlist = async () => {
        try {
          const res = await axios.post('http://localhost:3000/user/watchlist', {
            imdbID
          }, { withCredentials: true });
      
          setWatchlisted(res.data.watchlist.includes(imdbID));
        } catch (err) {
          console.error('Error al actualizar watchlist:', err);
        }
      };
      


    return (
        <div className="user-interaction-panel">
            <h2 className="interaction-title">Tu interacción</h2>

            <div className="interaction-block">
                <p className="interaction-label">¿Qué nota le das a esta película?</p>
                <div className="stars-container">
                    <ReactStars
                        count={5}
                        size={30}
                        value={rating}
                        onChange={handleRatingChange}
                        half={true}
                        color2={'#ffd700'}
                    />
                </div>
            </div>

            <div className="watchlist-toggle" onClick={toggleWatchlist}>
                {watchlisted ? (
                    <Eye className="icon eye" />
                ) : (
                    <EyeOff className="icon eye-off" />
                )}
                <span className="watchlist-text">
                    {watchlisted ? 'En tu watchlist' : 'Añadir a la watchlist'}
                </span>
            </div>

            <ConfirmRatingModal
                isOpen={isConfirmModalOpen}
                newRating={pendingRating}
                onConfirm={handleConfirmRating}
                onCancel={() => setIsConfirmModalOpen(false)}
            />

        </div>


    );
};

export default UserInteractionComponent;
