import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserHistoryComponent from './UserHistoryComponent';
import UserBadgesComponent from './UserBadgesComponent';
import Swal from 'sweetalert2';
import '../styles/UserPageComponent.css';

const UserPageComponent = () => {
    const [userData, setUserData] = useState(null);
    const [history, setHistory] = useState({
        coleccion: [],
        peliculasVistas: [],
        watchlist: []
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get('http://localhost:3000/user/history', {
                    withCredentials: true
                });
                setHistory(res.data);
            } catch (err) {
                console.error('Error al obtener el historial del usuario:', err.message);
            }
        };

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

        fetchUserData();
        fetchSessionUser();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1];

            try {
                await axios.put('http://localhost:3000/user/profile-image', {
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
                    'http://localhost:3000/user/update-alias',
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
        <div className="user-page-container">
            {userData && (
                <div className="user-header">
                    <div className="user-profile-img-container">
                        <img
                            src={`data:image/jpeg;base64,${userData.imagenPerfil}`}
                            alt="Perfil"
                            className="user-profile-img"
                        />
                        <label htmlFor="upload-image" className="image-overlay">
                            <svg  version="1.0" viewBox="0 0 256.000000 256.000000"  xmlns="http://www.w3.org/2000/svg"><g stroke="none" transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"><path d="M2016 2465 c-22 -8 -53 -24 -70 -36 -35 -25 -175 -171 -345 -359 -320 -352 -690 -719 -1088 -1078 l-190 -170 -41 -105 c-66 -169 -203 -587 -200 -610 2 -13 11 -23 24 -25 21 -3 316 96 559 188 162 62 138 42 400 335 319 356 648 680 1090 1071 283 252 325 307 325 428 -1 68 -31 115 -156 237 -91 89 -128 119 -159 128 -53 14 -101 13 -149 -4z m117 -159 c46 -19 173 -154 181 -193 4 -17 2 -50 -4 -72 -12 -47 -56 -90 -420 -422 -390 -355 -503 -467 -1021 -1009 l-187 -195 -78 -29 c-44 -16 -84 -31 -91 -33 -6 -3 -14 6 -18 18 -11 32 -81 105 -116 119 -36 15 -35 23 12 135 28 67 38 79 251 280 351 332 706 689 954 960 331 362 392 423 439 440 51 18 59 18 98 1z"/></g></svg>
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
                            <button
                                className="edit-alias-btn"
                                title="Editar alias"
                                onClick={handleChangeAlias}
                            >
                                ...
                            </button>
                        </div>

                        <div className="user-stats">
                            🎬 <strong>Colección:</strong> {history.coleccion.length} &nbsp;&nbsp;
                            👁️ <strong>Vistas:</strong> {history.peliculasVistas.length}
                        </div>
                    </div>
                </div>
            )}

            <UserBadgesComponent />

            <h2>📚 Historial de actividad</h2>
            
            <UserHistoryComponent
                coleccion={history.coleccion}
                peliculasVistas={history.peliculasVistas}
                watchlist={history.watchlist}
            />
        </div>
    );
};

export default UserPageComponent;
