import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import CopiesTableComponent from './CopiesTableComponent';
import UserInteractionComponent from './UserInteractionComponent';

function MovieDetailComponent() {
    const { imdbID } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [coleccion, setColeccion] = useState([]);

    const fetchMovieDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/movies/${imdbID}`, {
                withCredentials: true
            });
            setMovie(res.data);
        } catch (err) {
            console.error('Error al obtener los detalles de la película:', err.message);
        }
    };

    const fetchColeccion = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/user/coleccion/${imdbID}`, {
                withCredentials: true
            });
            setColeccion(res.data);
        } catch (err) {
            console.error('Error al obtener la colección:', err.message);
        }
    };

    const handleDeleteCopy = async (idCopia) => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta copia será eliminada permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axios.delete(`http://localhost:3000/user/coleccion/${idCopia}`, {
                    withCredentials: true
                });

                Swal.fire('✅ Eliminada', 'La copia ha sido eliminada.', 'success');
                fetchColeccion();

                if (res.data.nuevasInsignias?.length >= 0) {
                    const idsActuales = (await axios.get('http://localhost:3000/user/badges', {
                        withCredentials: true
                    })).data.map(b => b.id);

                    const perdidas = res.data.perdidasInsignias?.filter(b => !idsActuales.includes(b.id)) || [];

                    if (perdidas.length > 0) {
                        perdidas.forEach(badge => {
                            Swal.fire({
                                title: `⚠️ Has perdido una insignia`,
                                text: `${badge.nombre}: ${badge.descripcion}`,
                                imageUrl: `/images/badges/${badge.id}.png`,
                                imageHeight: 100,
                                confirmButtonText: 'Vaya...'
                            });
                        });
                    }
                }
            } catch (err) {
                Swal.fire('❌ Error', 'No se pudo eliminar la copia.', 'error');
            }
        }
    };

    useEffect(() => {
        fetchMovieDetails();
        fetchColeccion();
    }, [imdbID]);

    const handleAddCopy = async () => {
        const { value: formValues } = await Swal.fire({
            title: 'Añadir una copia',
            html:
                `<label>Plataforma:</label><select id="swal-soporte" class="swal2-input">
                    <option value="DVD">DVD</option>
                    <option value="BluRay">BluRay</option>
                    <option value="VHS">VHS</option>
                    <option value="Digital">Digital</option>
                </select><br/>` +
                `<label>Estado:</label><select id="swal-estado" class="swal2-input">
                    <option value="Excelente">Excelente</option>
                    <option value="Bueno">Bueno</option>
                    <option value="Normal">Normal</option>
                    <option value="Malo">Malo</option>
                </select>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            preConfirm: () => {
                const soporte = document.getElementById('swal-soporte').value;
                const estado = document.getElementById('swal-estado').value;
                return { soporte, estado };
            }
        });

        if (formValues) {
            try {
                const res = await axios.post(
                    'http://localhost:3000/user/coleccion',
                    {
                        imdbID: movie.imdbID,
                        soporte: formValues.soporte,
                        estado: formValues.estado
                    },
                    { withCredentials: true }
                );

                Swal.fire('✅ Copia añadida correctamente');
                fetchColeccion();

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
                Swal.fire('❌ Error', err.message, 'error');
            }
        }
    };


    const handleEditCopy = async (copia) => {
        const { value: formValues } = await Swal.fire({
            title: 'Editar copia',
            html:
                `<label>Plataforma:</label><select id="swal-soporte" class="swal2-input">
                    <option value="DVD" ${copia.soporte === 'DVD' ? 'selected' : ''}>DVD</option>
                    <option value="BluRay" ${copia.soporte === 'BluRay' ? 'selected' : ''}>BluRay</option>
                    <option value="VHS" ${copia.soporte === 'VHS' ? 'selected' : ''}>VHS</option>
                    <option value="Digital" ${copia.soporte === 'Digital' ? 'selected' : ''}>Digital</option>
                </select><br/>` +
                `<label>Estado:</label><select id="swal-estado" class="swal2-input">
                    <option value="Excelente" ${copia.estado === 'Excelente' ? 'selected' : ''}>Excelente</option>
                    <option value="Bueno" ${copia.estado === 'Bueno' ? 'selected' : ''}>Bueno</option>
                    <option value="Normal" ${copia.estado === 'Normal' ? 'selected' : ''}>Normal</option>
                    <option value="Malo" ${copia.estado === 'Malo' ? 'selected' : ''}>Malo</option>
                </select>`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            preConfirm: () => {
                const soporte = document.getElementById('swal-soporte').value;
                const estado = document.getElementById('swal-estado').value;
                return { soporte, estado };
            }
        });

        if (formValues) {
            try {
                await axios.put(`http://localhost:3000/user/coleccion/${copia.idCopia}`, {
                    soporte: formValues.soporte,
                    estado: formValues.estado
                }, {
                    withCredentials: true
                });

                Swal.fire('✅ Copia actualizada correctamente');
                fetchColeccion();
            } catch (err) {
                Swal.fire('❌ Error', 'No se pudo actualizar la copia', 'error');
            }
        }
    };


    if (!movie) return <p>Cargando película...</p>;

    return (
        <div>
            <h2>{movie.title} ({movie.year})</h2>
            <p><strong>Duración:</strong> {movie.runtime}</p>
            <p><strong>Metascore:</strong> {movie.metascore}</p>
            <p><strong>Género:</strong> {movie.genre.join(', ')}</p>
            <p><strong>Director:</strong> {movie.director}</p>
            <p><strong>Actores:</strong> {movie.actors.join(', ')}</p>
            <p><strong>Sinopsis:</strong> {movie.plot}</p>
            {movie.poster && <img src={movie.poster} alt={movie.title} width="300" />}
            <br />
            <button onClick={() => navigate('/search')}>🔍 Volver a Buscar</button>

            <h3>🎞️ Copias físicas que tienes</h3>
            <CopiesTableComponent
                copias={coleccion}
                onAddCopy={handleAddCopy}
                onDeleteCopy={handleDeleteCopy}
                onEditCopy={handleEditCopy}
            />
            <UserInteractionComponent imdbID={movie.imdbID} />

        </div>
    );
}

export default MovieDetailComponent;
