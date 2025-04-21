import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../styles/NotificationsPanel.css';

const NotificationsPanelComponent = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [visible, setVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const panelRef = useRef(null);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      try {
        const res = await axios.get('http://localhost:3000/notifications', {
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
    if (visible) {
      const unread = notificaciones.filter(n => !n.isRead).map(n => n._id);
      if (unread.length > 0) {
        axios.post('http://localhost:3000/notifications/mark-read', { ids: unread }, { withCredentials: true })
          .then(() => {
            setNotificaciones(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
          })
          .catch(err => console.error('Error al marcar como leídas:', err));
      }
    }
  }, [visible]);

  const togglePanel = () => {
    setVisible(prev => !prev);
  };

  const handleDeleteNotification = async (notifId) => {
    try {
      await axios.delete(`http://localhost:3000/notifications/${notifId}`, {
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
    <>
      <button className="notification-bell" onClick={togglePanel}>
        🔔
        {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
      </button>

      {visible && (
        <div className="notifications-panel" ref={panelRef}>
          <button className="notif-close-button" onClick={() => setVisible(false)}>✕</button>
          <h2>Notificaciones recientes</h2>

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
                      <div className="notif-placeholder-avatar">👤</div>
                    )}
                  </div>
                  <div className="notif-content">
                    <Link to={`/friend/${notif.fromUserId._id}`} className="notif-alias">
                      @{notif.fromUserId?.alias}
                    </Link>{' '}
                    {isLike
                      ? isBadge
                        ? '❤️ dio like a una insignia que conseguiste'
                        : '❤️ dio like a'
                      : '💬 comentó en tu publicación'}

                    {/* 🎖️ Mostrar detalles si es una insignia */}
                    {isBadge && notif.title && (
                      <div className="notif-title badge-notif">
                        🏅 <strong>{notif.title}</strong>
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

                    {notif.text && (
                      <div className="notif-comment">"{notif.text}"</div>
                    )}

                    <div className="notif-date">
                      {new Date(notif.date).toLocaleString()}
                    </div>
                  </div>

                  <button
                    className="notif-delete-button"
                    onClick={() => handleDeleteNotification(notif._id)}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};

export default NotificationsPanelComponent;
