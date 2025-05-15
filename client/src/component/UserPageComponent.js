import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaBox, FaEye, FaBookOpen } from 'react-icons/fa';
import UserHistoryComponent from './UserHistoryComponent';
import UserBadgesComponent from './UserBadgesComponent';
import FooterComponent from './Subcomponentes/FooterComponent';
import BannerComponent from './Subcomponentes/BannerComponent';
import '../styles/UserPageComponent.scss';

const UserPageComponent = () => {
    const [userData, setUserData] = useState(null);
    const [history, setHistory] = useState({
        coleccion: [],
        peliculasVistas: [],
        watchlist: []
    });
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const [historyRes, sessionRes] = await Promise.all([
                    axios.get(`${baseUrl}/user/history`, {
                        withCredentials: true
                    }),
                    axios.get(`${baseUrl}/auth/check-session`, {
                        withCredentials: true
                    })
                ]);

                setHistory(historyRes.data);
                if (sessionRes.data?.user) {
                    setUserData(sessionRes.data.user);
                }
            } catch (err) {
                console.error('Error al obtener los datos del usuario:', err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];
            try {
                await axios.put(`${baseUrl}/user/profile-image`, {
                    base64Image
                }, { withCredentials: true });

                setUserData((prev) => ({
                    ...prev,
                    imagenPerfil: base64Image
                }));

                Swal.fire('✅ Imagen actualizada', '', 'success');
            } catch (err) {
                Swal.fire('❌ Error', 'No se pudo actualizar la imagen', 'error');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleChangeAlias = async () => {
        const { value: newAlias } = await Swal.fire({
            title: 'Cambiar alias',
            input: 'text',
            inputLabel: 'Nuevo alias',
            inputValue: userData.alias,
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
        });

        if (newAlias && newAlias !== userData.alias) {
            try {
                await axios.put(
                    `${baseUrl}/user/update-alias`,
                    { newAlias },
                    { withCredentials: true }
                );
                setUserData((prev) => ({
                    ...prev,
                    alias: newAlias
                }));
                Swal.fire('✅ Alias actualizado', '', 'success');
            } catch (err) {
                Swal.fire('❌ Error', 'No se pudo actualizar el alias', 'error');
            }
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
                        {userData && (
                            <div className="user-top-section">
                                <div className="user-header">
                                    <div className="user-profile-img-container">
                                        <img
                                            src={`data:image/jpeg;base64,${userData.imagenPerfil}`}
                                            alt="Perfil"
                                            className="user-profile-img"
                                        />
                                        <label htmlFor="upload-image" className="image-overlay">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z" /></svg>
                                        </label>
                                        <input
                                            type="file"
                                            id="upload-image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{ display: 'none' }}
                                        />
                                    </div>
                                    <div className="user-info">
                                        <div className="user-info-header">
                                            <span className="username">@{userData.alias}</span>
                                            <button className="edit-alias-btn" title="Editar alias" onClick={handleChangeAlias}>...</button>
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
                                <UserBadgesComponent />
                            </div>
                        )}

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

export default UserPageComponent;
