import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faMedal, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../styles/NotificationsPanel.scss';

const NotificationsPanelComponent = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await axios.get(`${baseUrl}/notifications`, {
          withCredentials: true
        });
        setNotificaciones(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      } catch (err) {
        console.error('Error al cargar notificaciones:', err);
      }
    };

    fetchNotificaciones();
  }, []);

  useEffect(() => {
    if (isExpanded) {
      const unread = notificaciones.filter(n => !n.isRead).map(n => n._id);
      if (unread.length > 0) {
        axios.post(`${baseUrl}/notifications/mark-read`, { ids: unread }, { withCredentials: true })
          .then(() => {
            setNotificaciones(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
          })
          .catch(err => console.error('Error al marcar como leídas:', err));
      }
    }
  }, [isExpanded]);

  const handleDeleteNotification = async (notifId) => {
    try {
      await axios.delete(`${baseUrl}/notifications/${notifId}`, {
        withCredentials: true
      });
      setNotificaciones((prev) => prev.filter(n => n._id !== notifId));
    } catch (err) {
      console.error('Error al eliminar notificación:', err);
    }
  };

  const getActionDescription = (type) => {
    if (type === 'vista') return 'He visto...';
    if (type === 'coleccion') return 'He añadido a mi colección...';
    if (type === 'watchlist') return 'Quiero ver...';
    if (type === 'badge') return 'una insignia que conseguiste';
    return '';
  };

  return (
    <div className="notifications-panel-wrapper">
      <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
        Notificaciones recientes
        {unreadCount > 0 && <span className="notif-count-bubble">{unreadCount}</span>}
        <span>{isExpanded ? '▲' : '▼'}</span>
      </div>

      <div className={`accordion-content ${isExpanded ? 'active' : ''}`}>
        {notificaciones.length === 0 ? (
          <p>No tienes notificaciones nuevas.</p>
        ) : (
          notificaciones.map((notif) => {
            const isLike = notif.type === 'like';
            const isComment = notif.type === 'comment';
            const isBadge = notif.actionType === 'badge';

            return (
              <div key={notif._id} className={`notif-item ${isLike ? 'like' : 'comment'}`}>
                <div className="notif-avatar">
                  {notif.fromUserId?.imagenPerfil ? (
                    <img
                      src={`data:image/jpeg;base64,${notif.fromUserId.imagenPerfil}`}
                      alt="avatar"
                    />
                  ) : (
                    <div className="notif-placeholder-avatar">
                      <FontAwesomeIcon icon={faComment} />
                    </div>
                  )}
                </div>
                <div className="notif-content">
                  <Link to={`/friend/${notif.fromUserId._id}`} className="notif-alias">
                    @{notif.fromUserId?.alias}
                  </Link>{' '}
                  {isLike
                    ? isBadge
                      ? <><FontAwesomeIcon icon={faHeart} /> dio like a una insignia que conseguiste</>
                      : <><FontAwesomeIcon icon={faHeart} /> dio like a</>
                    : <><FontAwesomeIcon icon={faComment} /> comentó en tu publicación</>}

                  {isBadge && notif.title && (
                    <div className="notif-title badge-notif">
                      <FontAwesomeIcon icon={faMedal} /> <strong>{notif.title}</strong>
                    </div>
                  )}

                  {!isBadge && (
                    <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {notif.actionType && (
                        <div className="notif-action">{getActionDescription(notif.actionType)}</div>
                      )}
                      {notif.title && (
                        <div className="notif-title">
                          {notif.title} {notif.year && `(${notif.year})`}
                        </div>
                      )}
                    </div>
                  )}

                  {notif.text && <div className="notif-comment">"{notif.text}"</div>}
                  <div className="notif-date">{new Date(notif.date).toLocaleString()}</div>
                </div>

                <button
                  className="notif-delete-button"
                  onClick={() => handleDeleteNotification(notif._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default NotificationsPanelComponent;
