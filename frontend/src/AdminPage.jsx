import { useState, useEffect } from 'react';

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>👑 Админ-панель</h1>
      <p style={styles.p}>Список зарегистрированных пользователей</p>
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tr}>
              <th style={styles.th}>ID</th><th style={styles.th}>Имя</th><th style={styles.th}>Email</th><th style={styles.th}>Дата</th><th style={styles.th}>Прогресс</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.id}</td>
                <td style={styles.td}>{user.username}</td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.date}</td>
                <td style={styles.td}>{user.progress}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', padding: '2rem', background: 'linear-gradient(135deg, #0a0f1c 0%, #0f172a 50%, #1a2a3a 100%)', color: 'white' },
  h1: { fontSize: '2.5rem' },
  p: { marginBottom: '2rem', color: '#94a3b8' },
  tableContainer: { background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', padding: '1rem', overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(74,222,128,0.2)', color: '#4ade80' },
  td: { padding: '0.75rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  tr: { transition: 'background 0.2s' },
};

export default AdminPage;