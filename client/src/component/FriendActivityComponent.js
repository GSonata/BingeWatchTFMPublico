import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { animate } from 'animejs';
import FeedPostComponent from './FeedPostComponent.js';
import NotificationsPanelComponent from './NotificationsPanelComponent';
import BannerComponent from "./Subcomponentes/BannerComponent.js"
import FooterComponent from "./Subcomponentes/FooterComponent.js"

import '../styles/FriendActivity.scss';

const FriendActivityComponent = () => {
    const [activity, setActivity] = useState([]);
    const [visibleItems, setVisibleItems] = useState(30);
    const [likesMap, setLikesMap] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [userData, setUserData] = useState(null);
    const [monthlyBadge, setMonthlyBadge] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const feedRef = useRef(null);

    useEffect(() => {
        const fetchSessionUser = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const res = await axios.get(`${baseUrl}/auth/check-session`, {
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

    useEffect(() => {
        const fetchActivity = async () => {
            setIsLoading(true);
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const res = await axios.get(`${baseUrl}/friend-activity`, { withCredentials: true });
                setActivity(res.data);

                const initialLikes = {};
                const initialComments = {};
                const initialInputs = {};

                res.data.forEach((item) => {
                    initialLikes[item._id] = item.likes?.length || 0;
                    initialComments[item._id] = item.comments || [];
                    initialInputs[item._id] = '';
                });

                setLikesMap(initialLikes);
                setCommentsMap(initialComments);
                setCommentInputs(initialInputs);
            } catch (err) {
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo cargar la actividad de tus amigos.',
                    icon: 'error',
                    background: '#1c1c1c',
                    color: '#f5f5f5',
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: false
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchActivity();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && visibleItems < activity.length) {
                setVisibleItems(prev => prev + 30);
            }
        });

        const feed = feedRef.current;
        if (feed) observer.observe(feed);

        return () => {
            if (feed) observer.unobserve(feed);
        };
    }, [activity, visibleItems]);

    useEffect(() => {
        const fetchMonthlyBadge = async () => {
            try {
                const baseUrl = process.env.REACT_APP_API_URL;
                const res = await axios.get(`${baseUrl}/badge/monthly`, {
                    withCredentials: true
                });
                if (res.data) setMonthlyBadge(res.data);
            } catch (err) {
                console.error('❌ Error al cargar la insignia del mes:', err.message);
            }
        };

        fetchMonthlyBadge();
    }, []);

    return (
        <>
            <BannerComponent />
            {isLoading ? (
                <div className="loading-modal">
                    <div className="spinner"></div>
                    <p>Cargando actividad...</p>
                </div>
            ) : (
                <div className="friend-activity-container">
                    <div className="feed-column">
                        <h1>¿Qué hacen tus amigos?</h1>

                        {activity.length === 0 ? (
                            <div className="empty-activity-placeholder">
                                <img src="/images/no-friends.gif" alt="Sin resultados" className="no-friends-image" />
                                <p>¡Agrega a gente, ve lo que tus amigos descubren!</p>
                            </div>
                        ) : (
                            <>
                                {activity.slice(0, visibleItems).map((item) => (
                                    <FeedPostComponent
                                        key={`${item.userId}-${item.imdbID}-${item.date}`}
                                        item={item}
                                        userData={userData}
                                        animate={animate}
                                        commentsMap={commentsMap}
                                        setCommentsMap={setCommentsMap}
                                        commentInputs={commentInputs}
                                        setCommentInputs={setCommentInputs}
                                        setActivity={setActivity}
                                    />
                                ))}
                                <div ref={feedRef} className="scroll-sentinel" />
                            </>
                        )}
                    </div>

                    <div className="side-column">
                        <NotificationsPanelComponent />

                        {monthlyBadge && (
                            <div className="badge-monthly-progress">
                                <div className="badge-monthly-title">Progreso de la insignia del mes</div>
                                <div className="badge-progress-bar">
                                    <div
                                        className="badge-progress-fill"
                                        style={{ width: `${monthlyBadge.progreso}%` }}
                                    ></div>
                                </div>
                                <div className="badge-monthly-stats">
                                    Has visto {Math.min(Math.round((monthlyBadge.progreso / 100) * monthlyBadge.objetivo), monthlyBadge.objetivo)} de {monthlyBadge.objetivo} películas este mes
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <FooterComponent />
        </>
    );
};

export default FriendActivityComponent;
