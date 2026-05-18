import { useState, useEffect } from 'react';
import { FaBell, FaTimes } from 'react-icons/fa';

function Notifications() {
  const [show, setShow] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: '🔥 Новый челлендж: 1000 касаний!', read: false, time: '5 мин назад' },
    { id: 2, text: '🏆 Поздравляем! Вы выполнили тренировку недели', read: false, time: '2 часа назад' },
    { id: 3, text: '💪 Александр только что поделился успехом в ленте', read: true, time: 'вчера' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setShow(!show)} style={styles.bellBtn}>
        <FaBell size={20} />
        {unreadCount > 0 && <span style={styles.badge}>{unreadCount}</span>}
      </button>
      
      {show && (
        <div style={styles.dropdown}>
          <div style={styles.header}>
            <span>Уведомления</span>
            <button onClick={() => setShow(false)} style={styles.closeBtn}>
              <FaTimes size={14} />
            </button>
          </div>
          {notifications.length === 0 ? (
            <div style={styles.empty}>Нет уведомлений</div>
          ) : (
            notifications.map(n => (
              <div 
                key={n.id} 
                style={{ ...styles.notif, ...(!n.read ? styles.unread : {}) }}
                onClick={() => markAsRead(n.id)}
              >
                <div style={styles.notifText}>{n.text}</div>
                <div style={styles.notifTime}>{n.time}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  bellBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: '8px',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#E31B23',
    color: 'white',
    fontSize: '10px',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: '40px',
    right: '0',
    width: '320px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
    zIndex: 1000,
    border: '1px solid #E0E0E0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #F0F0F0',
    fontWeight: '600',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
  },
  notif: {
    padding: '12px 16px',
    borderBottom: '1px solid #F0F0F0',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  unread: {
    background: '#FFF5F5',
  },
  notifText: {
    fontSize: '14px',
    marginBottom: '4px',
  },
  notifTime: {
    fontSize: '11px',
    color: '#999',
  },
  empty: {
    padding: '20px',
    textAlign: 'center',
    color: '#999',
  },
};

export default Notifications;