import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { animate } from 'animejs';
import FeedPostComponent from './FeedPostComponent.js';
import NotificationsPanelComponent from './NotificationsPanelComponent';
import '../styles/FriendActivity.css';

const FriendActivityComponent = () => {
    const [activity, setActivity] = useState([]);
    const [visibleItems, setVisibleItems] = useState(30);
    const [likesMap, setLikesMap] = useState({});
    const [commentsMap, setCommentsMap] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const [userData, setUserData] = useState(null);
    const feedRef = useRef(null);

    useEffect(() => {
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

        fetchSessionUser();
    }, []);

    useEffect(() => {
        const fetchActivity = async () => {
            try {
                const res = await axios.get('http://localhost:3000/friend-activity', { withCredentials: true });
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


    return (
        <div className="friend-activity-container">

            <NotificationsPanelComponent />

            <div className="feed-column">
                <h1>¿Qué hacen tus amigos?</h1>

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
            </div>

            <div className="side-column">
                <div className="filter-panel">
                    Opciones de filtro {/* Por implementar */}
                </div>
                <div className="badge-info">
                    Información de Badges {/* Por implementar */}
                </div>
            </div>
        </div>
    );
};

export default FriendActivityComponent;
