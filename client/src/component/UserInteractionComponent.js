import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReactStars from 'react-stars';
import { Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const UserInteractionComponent = ({ imdbID }) => {
    const [rating, setRating] = useState(0);
    const [watchlisted, setWatchlisted] = useState(false);

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

    const handleRatingChange = async (newRating) => {
        const result = await Swal.fire({
            title: `Le vas a dar ${newRating} estrellas a la película`,
            text: '¿Estás seguro de guardar esta calificación?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                const res = await axios.post(
                    'http://localhost:3000/user/rating',
                    {
                        imdbID,
                        nota: newRating,
                        fecha: new Date().toISOString()
                    },
                    { withCredentials: true }
                );

                setRating(newRating);
                Swal.fire('¡Guardado!', 'Tu calificación ha sido registrada.', 'success');

                if (res.data.nuevasInsignias && res.data.nuevasInsignias.length > 0) {
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
                Swal.fire('❌ Error', 'No se pudo guardar la calificación.', 'error');
            }
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
        <div className="p-4 rounded-lg shadow-md border mt-4">
            <h2 className="text-xl font-semibold mb-2">Tu interacción</h2>

            <div className="mb-4">
                <p className="mb-1">¿Qué nota le das a esta película?</p>
                <ReactStars
                    count={5}
                    size={30}
                    value={rating}
                    onChange={handleRatingChange}
                    half={false}
                    color2={'#ffd700'}
                />
            </div>

            <div className="flex items-center cursor-pointer" onClick={toggleWatchlist}>
                {watchlisted ? <Eye className="text-green-600 mr-2" /> : <EyeOff className="text-gray-500 mr-2" />}
                <span>{watchlisted ? 'En tu watchlist' : 'Añadir a la watchlist'}</span>
            </div>
        </div>
    );
};

export default UserInteractionComponent;
