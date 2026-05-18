import { useState } from 'react';

function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/login' : '/api/register';
    const body = isLogin ? { username, password } : { username, password, email };
    
    try {
      const res = await fetch(`https://ballers-workshop.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage('Ошибка сервера');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>⚽</div>
        <h2 style={styles.title}>{isLogin ? 'Вход' : 'Регистрация'}</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          )}
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            {isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        <p onClick={() => setIsLogin(!isLogin)} style={styles.switch}>
          {isLogin ? 'Нет аккаунта? Зарегистрируйся' : 'Уже есть аккаунт? Войди'}
        </p>
        {message && <div style={styles.message}>{message}</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #0a0f1c 0%, #0f172a 50%, #1a2a3a 100%)',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '2rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  logo: { fontSize: '4rem', marginBottom: '1rem' },
  title: { fontSize: '2rem', marginBottom: '1.5rem', color: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  input: {
    padding: '0.75rem',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
    border: 'none',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  switch: { marginTop: '1rem', color: '#94a3b8', cursor: 'pointer' },
  message: { marginTop: '1rem', padding: '0.5rem', background: 'rgba(239,68,68,0.2)', borderRadius: '0.5rem', color: '#f87171' },
};

export default LoginPage;