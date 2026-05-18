import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import AdminPage from './AdminPage';
import FeedPage from './components/FeedPage';
import TrainingDetail from './components/TrainingDetail';
import ProfilePage from './components/ProfilePage';
import Notifications from './components/Notifications';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

function HomePage({ user, onLogout }) {
  const [aspects, setAspects] = useState([]);
  const [selectedAspect, setSelectedAspect] = useState(null);
  const [selectedAspectData, setSelectedAspectData] = useState(null);
  const [trainings, setTrainings] = useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    fetch('https://ballers-workshop.onrender.com/api/aspects')
      .then(res => res.json())
      .then(data => setAspects(data));
  }, []);

  const selectAspect = async (id) => {
    const aspect = aspects.find(a => a.id === id);
    setSelectedAspectData(aspect);
    const res = await fetch(`https://ballers-workshop.onrender.com/api/aspect/${id}/trainings`);
    const data = await res.json();
    setTrainings(data);
    setSelectedAspect(id);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  if (selectedAspect) {
    return (
      <TrainingDetail 
        aspect={selectedAspectData}
        trainings={trainings}
        onBack={() => setSelectedAspect(null)}
      />
    );
  }

  return (
    <div className="main-page">
      {/* ШАПКА */}
      <div className="header">
        <div className="header-top">
          <div className="logo">BALLER'S <span>WORKSHOP</span></div>
          <div className="user-info">
            <Notifications />
            <span className="username">👋 {user?.username}</span>
            <Link to="/profile" className="nav-link">👤 Профиль</Link>
            <Link to="/feed" className="nav-link">📸 Лента</Link>
            {user?.is_admin === 1 && <Link to="/admin" className="nav-link admin">👑 Админ</Link>}
            <button onClick={handleLogoutClick} className="logout-btn">Выйти</button>
          </div>
        </div>
        <h1 className="main-title">Мастерская футболистов</h1>
        <p className="subtitle">Выбери своего игрока и прокачай навыки до уровня профи</p>
      </div>

      {/* СТАТИСТИКА */}
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">500+</div>
          <div className="stat-label">активных игроков</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24</div>
          <div className="stat-label">программы тренировок</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">98%</div>
          <div className="stat-label">видят прогресс</div>
        </div>
      </div>

      {/* ПОПУЛЯРНЫЕ ТРЕНИРОВКИ */}
      <div className="trainings-section">
        <h2 className="section-title">🔥 Популярные <span className="red-text">тренировки</span></h2>
        <div className="trainings-grid">
          {aspects.map((a, index) => (
            <div 
              key={a.id} 
              className="training-card-simple fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => selectAspect(a.id)}
            >
              <div className="card-image">
                <img src={a.player_image} alt={a.player_name} />
                <div className="difficulty-badge">{a.difficulty}</div>
              </div>
              <div className="card-content">
                <div className="player-icon">{a.icon}</div>
                <h3>{a.name}</h3>
                <p className="player-fullname">{a.player_name}</p>
                <button className="start-training-btn">Начать тренировку →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ПОЧЕМУ МЫ? */}
      <div className="why-section">
        <h2 className="section-title">Почему <span className="red-text">Baller's Workshop?</span></h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h4>Методика профи</h4>
            <p>Программы от профессиональных тренеров и топ-игроков</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>Удобный формат</h4>
            <p>Тренируйся где угодно, следуй плану на телефоне</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h4>Отслеживай прогресс</h4>
            <p>Статистика и достижения мотивируют расти</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h4>Сообщество</h4>
            <p>Делись успехами и вдохновляй других</p>
          </div>
        </div>
      </div>

      {/* ТОП НЕДЕЛИ */}
      <div className="top-week-section">
        <h2 className="section-title">⭐ Топ тренировки <span className="red-text">недели</span></h2>
        <div className="top-week-grid">
          {aspects.slice(0, 3).map((a, i) => (
            <div key={a.id} className="top-week-card" onClick={() => selectAspect(a.id)}>
              <div className="top-rank">#{i + 1}</div>
              <div className="top-icon">{a.icon}</div>
              <div className="top-info">
                <h4>{a.name}</h4>
                <p>{a.player_name}</p>
              </div>
              <div className="top-stats">
                <span>🔥 {Math.floor(Math.random() * 200 + 50)} тренировок</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ОТЗЫВЫ */}
      <div className="reviews-section">
        <h2 className="section-title">❤️ Что говорят <span className="red-text">игроки</span></h2>
        <div className="reviews-grid">
          <div className="review-card">
            <div className="review-avatar">⚽</div>
            <p>"За месяц поднял дриблинг на новый уровень! Спасибо, Baller's Workshop!"</p>
            <div className="review-author">— Александр, 24 года</div>
          </div>
          <div className="review-card">
            <div className="review-avatar">🏆</div>
            <p>"Лучшие тренировки, которые я пробовал. Виден реальный прогресс за 2 недели"</p>
            <div className="review-author">— Дмитрий, 19 лет</div>
          </div>
          <div className="review-card">
            <div className="review-avatar">🔥</div>
            <p>"Очень удобно, что можно отслеживать прогресс и делиться достижениями с друзьями"</p>
            <div className="review-author">— Максим, 21 год</div>
          </div>
        </div>
      </div>

      {/* CTA СЕКЦИЯ */}
      <div className="cta-section">
        <h2>Готов стать лучше? 🔥</h2>
        <p>Присоединяйся к сообществу футболистов и делись своими успехами</p>
        <Link to="/feed" className="cta-btn">📸 Смотреть ленту достижений</Link>
      </div>

      {/* МОДАЛЬНОЕ ОКНО ПОДТВЕРЖДЕНИЯ ВЫХОДА */}
      {showLogoutConfirm && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <h3>Выйти из аккаунта?</h3>
            <p>Вы уверены, что хотите выйти?</p>
            <div className="logout-modal-buttons">
              <button className="logout-cancel-btn" onClick={() => setShowLogoutConfirm(false)}>
                Отмена
              </button>
              <button className="logout-confirm-btn" onClick={handleLogoutConfirm}>
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} onLogout={handleLogout} />} />
      <Route path="/profile" element={<ProfilePage user={user} />} />
      <Route path="/feed" element={<FeedPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

function WrappedApp() {
  return (
    <BrowserRouter>
  <ScrollToTop />
  <App />
</BrowserRouter>
  );
}

export default WrappedApp;