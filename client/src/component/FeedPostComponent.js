import React from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const FeedPostComponent = ({
    item,
    userData,
    animate,
    commentsMap,
    setCommentsMap,
    commentInputs,
    setCommentInputs,
    setActivity
}) => {
    const comments = commentsMap[item._id] || [];
    const hasLiked = item.likes?.includes(userData?._id);
    const commentText = commentInputs[item._id] || '';

    const handleLike = async (e) => {
        e.preventDefault();
        try {
            const endpoint = `http://localhost:3000/interactions/${item._id}/${hasLiked ? 'unlike' : 'like'}`;
            await axios.post(endpoint, {}, { withCredentials: true });

            setActivity((prev) =>
                prev.map((act) => {
                    if (act._id === item._id) {
                        const newLikes = hasLiked
                            ? act.likes.filter((id) => id !== userData._id)
                            : [...act.likes, userData._id];

                        return {
                            ...act,
                            likes: newLikes
                        };
                    }
                    return act;
                })
            );
        } catch (err) {
            Swal.fire('Error', 'No se pudo procesar el like.', 'error');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        try {
            const res = await axios.post(
                `http://localhost:3000/interactions/${item._id}/comment`,
                { text: commentText },
                { withCredentials: true }
            );

            setCommentsMap(prev => ({
                ...prev,
                [item._id]: [...(prev[item._id] || []), res.data.comment]
            }));

            setCommentInputs(prev => ({ ...prev, [item._id]: '' }));
        } catch (err) {
            Swal.fire('Error', 'No se pudo enviar el comentario.', 'error');
        }
    };

    const handleDeleteComment = async (commentId, index) => {
        const confirmDelete = await Swal.fire({
            title: '¿Eliminar comentario?',
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1c1c1c',
            color: '#f5f5f5'
        });

        if (!confirmDelete.isConfirmed) return;

        try {
            await axios.delete(`http://localhost:3000/interactions/${item._id}/comment/${commentId}`, {
                withCredentials: true
            });
            setCommentsMap((prev) => ({
                ...prev,
                [item._id]: prev[item._id].filter((_, idx) => idx !== index)
            }));
        } catch (err) {
            Swal.fire('Error', 'No se pudo eliminar el comentario.', 'error');
        }
    };

    return (
        <div className="activity-block">
            {item.type === 'badge' && item.badge ? (
                <div
                    className="activity-card"
                    data-type="badge"
                    data-username={item.alias}
                    onMouseEnter={(e) => animate(e.currentTarget, {
                        scale: 1.01,
                        duration: 300,
                        easing: 'easeOutQuad'
                    })}
                    onMouseLeave={(e) => animate(e.currentTarget, {
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutQuad'
                    })}
                >
                    <img
                        src={item.imagenPerfil}
                        alt="perfil"
                        className="activity-avatar"
                    />
                    <div className="activity-content">
                        <p>
                            <strong>@{item.alias}</strong> ha conseguido una nueva insignia:
                        </p>
                        <div className="badge-earned">
                            <img
                                src={`/${item.badge.imagen}`}
                                alt={item.badge.nombre}
                                className="badge-image"
                            />
                            <div className="badge-texts">
                                <h4 className="badge-name">{item.badge.nombre}</h4>
                                <p className="badge-description">{item.badge.descripcion}</p>
                            </div>
                        </div>
                        <button
                            className={`like-button ${hasLiked ? 'liked' : ''}`}
                            onClick={handleLike}
                        >
                            ❤️ {item.likes?.length || 0}
                        </button>
                    </div>
                </div>
            ) : (
                // resto del render...

                <>
                    <div
                        className="activity-card"
                        data-type={item.type}
                        data-username={item.alias}
                        onMouseEnter={(e) => animate(e.currentTarget, {
                            scale: 1.0005,
                            duration: 300,
                            easing: 'easeOutQuad'
                        })}
                        onMouseLeave={(e) => animate(e.currentTarget, {
                            scale: 1,
                            duration: 300,
                            easing: 'easeOutQuad'
                        })}
                    >
                        {item.imagenPerfil?.startsWith('data:image') && (
                            <img src={item.imagenPerfil} alt="perfil" className="activity-avatar" />
                        )}

                        <div className="activity-content">
                            <Link to={`/movies/${item.imdbID}`} className="activity-link">
                                <p>
                                    <strong>@{item.alias}</strong>{' '}
                                    {item.type === 'vista'
                                        ? 'ha VISTO la película:'
                                        : item.type === 'coleccion'
                                            ? 'ha AÑADIDO a su colección:'
                                            : 'ha GUARDADO en su Watchlist:'}
                                </p>
                                <h3>
                                    {item.title} <span className="year">({item.year})</span>
                                </h3>
                                {item.nota !== null && item.type === 'vista' && (
                                    <h5 className="activity-rating">
                                        Y le ha dado: {'⭐'.repeat(Math.round(item.nota))} estrellas
                                    </h5>
                                )}
                                {(item.soporte || item.estado) && (
                                    <p className="activity-extra">
                                        {item.soporte && <span>🎞️ {item.soporte}</span>}
                                        {item.estado && <span> • 📦 {item.estado}</span>}
                                    </p>
                                )}
                            </Link>

                            <button
                                className={`like-button ${hasLiked ? 'liked' : ''}`}
                                onClick={handleLike}
                            >
                                ❤️ {item.likes?.length || 0}
                            </button>
                        </div>

                        <div
                            className="activity-poster"
                            style={{ backgroundImage: `url(${item.poster})` }}
                        ></div>
                    </div>
                </>
            )}

            <div className="comments-section">
                {comments.map((c, i) => (
                    <div key={i} className="comment">
                        <div className="comment-avatar-wrapper">
                            {c.imagenPerfil && (
                                <img
                                    src={`data:image/jpeg;base64,${c.imagenPerfil}`}
                                    alt="perfil"
                                    className="comment-avatar"
                                />
                            )}
                        </div>
                        <div className="comment-body">
                            @{c.alias}: {c.text}
                            {userData?._id === c.userId && (
                                <button
                                    className="delete-comment"
                                    onClick={() => handleDeleteComment(c._id, i)}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                <form onSubmit={handleComment} className="comment-form">
                    <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        value={commentText}
                        onChange={(e) =>
                            setCommentInputs((prev) => ({
                                ...prev,
                                [item._id]: e.target.value
                            }))
                        }
                    />
                    <button type="submit">💬</button>
                </form>
            </div>
        </div>
    );
};

export default FeedPostComponent;
