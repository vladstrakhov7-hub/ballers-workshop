import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChartLine, FaTrophy, FaFire, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

function ProfilePage({ user }) {
  const navigate = useNavigate();
  const [progressData, setProgressData] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [stats, setStats] = useState({
    totalTrainings: 0,
    completedTrainings: 0,
    streakDays: 0,
    totalMinutes: 0
  });

  // Данные для графика прогресса
  useEffect(() => {
    // Демо-данные прогресса по дням
    const demoProgress = [
      { day: 'Пн', progress: 45 },
      { day: 'Вт', progress: 52 },
      { day: 'Ср', progress: 48 },
      { day: 'Чт', progress: 65 },
      { day: 'Пт', progress: 73 },
      { day: 'Сб', progress: 82 },
      { day: 'Вс', progress: 78 }
    ];
    setProgressData(demoProgress);

    // Демо-статистика
    setStats({
      totalTrainings: 24,
      completedTrainings: 16,
      streakDays: 7,
      totalMinutes: 342
    });

    // Еженедельные челленджи
    const weeklyChallenges = [
      {
        id: 1,
        title: '🔥 1000 касаний мяча',
        description: 'Сделай 1000 касаний мяча за неделю',
        target: 1000,
        current: 680,
        reward: '🏆 +50 очков',
        daysLeft: 3
      },
      {
        id: 2,
        title: '⚡ Спринт-марафон',
        description: 'Пробеги 5 км за неделю',
        target: 5,
        current: 3.2,
        reward: '⚡ +30 очков',
        daysLeft: 4
      },
      {
        id: 3,
        title: '🎯 Точность паса',
        description: 'Сделай 200 точных пасов',
        target: 200,
        current: 145,
        reward: '🎯 +40 очков',
        daysLeft: 5
      }
    ];
    setChallenges(weeklyChallenges);
  }, []);

  const completionPercent = (stats.completedTrainings / stats.totalTrainings) * 100;

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <FaArrowLeft /> На главную
        </button>
        <h1 style={styles.title}>Личный кабинет</h1>
        <div style={styles.placeholder} />
      </div>

      {/* Инфо о пользователе */}
      <div style={styles.userCard}>
        <div style={styles.userAvatar}>⚽</div>
        <div style={styles.userInfo}>
          <h2 style={styles.userName}>{user?.username}</h2>
          <p style={styles.userEmail}>{user?.email || 'player@baller.com'}</p>
          <div style={styles.userBadge}>⭐ Уровень: Профи</div>
        </div>
      </div>

      {/* Статистика */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <FaChartLine style={styles.statIconRed} />
          <div>
            <div style={styles.statValue}>{stats.completedTrainings}/{stats.totalTrainings}</div>
            <div style={styles.statLabel}>тренировок</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaFire style={styles.statIconRed} />
          <div>
            <div style={styles.statValue}>{stats.streakDays}</div>
            <div style={styles.statLabel}>дней подряд</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaClock style={styles.statIconRed} />
          <div>
            <div style={styles.statValue}>{stats.totalMinutes}</div>
            <div style={styles.statLabel}>минут тренировок</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <FaTrophy style={styles.statIconRed} />
          <div>
            <div style={styles.statValue}>{Math.round(completionPercent)}%</div>
            <div style={styles.statLabel}>прогресс</div>
          </div>
        </div>
      </div>

      {/* График прогресса */}
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>📈 Прогресс за неделю</h3>
        <div style={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E31B23" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E31B23" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />
              <XAxis dataKey="day" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: 'white', borderRadius: '10px', border: '1px solid #E31B23' }}
                labelStyle={{ color: '#E31B23' }}
              />
              <Area type="monotone" dataKey="progress" stroke="#E31B23" fillOpacity={1} fill="url(#colorProgress)" />
              <Line type="monotone" dataKey="progress" stroke="#E31B23" strokeWidth={2} dot={{ fill: '#E31B23', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Челленджи */}
      <div style={styles.challengesSection}>
        <h3 style={styles.sectionTitle}>⚡ Еженедельные челленджи</h3>
        <div style={styles.challengesGrid}>
          {challenges.map(challenge => {
            const percent = (challenge.current / challenge.target) * 100;
            return (
              <div key={challenge.id} style={styles.challengeCard}>
                <div style={styles.challengeHeader}>
                  <span style={styles.challengeTitle}>{challenge.title}</span>
                  <span style={styles.daysLeft}>{challenge.daysLeft} дня осталось</span>
                </div>
                <p style={styles.challengeDesc}>{challenge.description}</p>
                <div style={styles.progressWrapper}>
                  <div style={styles.progressBarBg}>
                    <div style={{ ...styles.progressBarFill, width: `${percent}%` }} />
                  </div>
                  <div style={styles.progressText}>
                    {challenge.current} / {challenge.target}
                  </div>
                </div>
                <div style={styles.rewardBox}>
                  <span>🎁 Награда: {challenge.reward}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Достижения */}
      <div style={styles.achievementsSection}>
        <h3 style={styles.sectionTitle}>🏅 Достижения</h3>
        <div style={styles.achievementsGrid}>
          <div style={styles.achievementCard}>
            <div style={styles.achievementIcon}>🔥</div>
            <div>
              <div style={styles.achievementTitle}>Первая тренировка</div>
              <div style={styles.achievementDesc}>Завершил первую тренировку</div>
            </div>
          </div>
          <div style={styles.achievementCard}>
            <div style={styles.achievementIcon}>⭐</div>
            <div>
              <div style={styles.achievementTitle}>5 дней подряд</div>
              <div style={styles.achievementDesc}>Тренировался 5 дней без пропусков</div>
            </div>
          </div>
          <div style={styles.achievementCard}>
            <div style={styles.achievementIcon}>🏆</div>
            <div>
              <div style={styles.achievementTitle}>Мастер дриблинга</div>
              <div style={styles.achievementDesc}>Освоил технику Ямаля</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
    background: '#FFFFFF',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: 'none',
    border: '1px solid #E0E0E0',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    color: '#1A1A1A',
    cursor: 'pointer',
  },
  title: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1A1A1A',
  },
  placeholder: {
    width: '100px',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    background: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '1.5rem',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  userAvatar: {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #E31B23, #B8121A)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: '1.5rem',
    marginBottom: '0.25rem',
  },
  userEmail: {
    color: '#666',
    marginBottom: '0.5rem',
  },
  userBadge: {
    display: 'inline-block',
    background: '#FFF0F0',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.8rem',
    color: '#E31B23',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: '#F9FAFB',
    padding: '1rem',
    borderRadius: '1rem',
    border: '1px solid #F0F0F0',
  },
  statIconRed: {
    fontSize: '2rem',
    color: '#E31B23',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#888',
  },
  chartSection: {
    marginBottom: '2rem',
    background: '#F9FAFB',
    borderRadius: '1rem',
    padding: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.2rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1A1A1A',
  },
  chartContainer: {
    width: '100%',
    height: '250px',
  },
  challengesSection: {
    marginBottom: '2rem',
  },
  challengesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1rem',
  },
  challengeCard: {
    background: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '1rem',
    padding: '1rem',
  },
  challengeHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  challengeTitle: {
    fontWeight: '600',
    color: '#E31B23',
  },
  daysLeft: {
    fontSize: '0.7rem',
    background: '#FFF0F0',
    padding: '0.2rem 0.5rem',
    borderRadius: '1rem',
    color: '#E31B23',
  },
  challengeDesc: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '0.75rem',
  },
  progressWrapper: {
    marginBottom: '0.75rem',
  },
  progressBarBg: {
    height: '8px',
    background: '#F0F0F0',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: '#E31B23',
    borderRadius: '4px',
  },
  progressText: {
    fontSize: '0.7rem',
    color: '#888',
    marginTop: '0.25rem',
  },
  rewardBox: {
    background: '#FFF8E1',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    fontSize: '0.8rem',
    color: '#E31B23',
  },
  achievementsSection: {
    marginBottom: '2rem',
  },
  achievementsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  achievementCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background: '#F9FAFB',
    padding: '1rem',
    borderRadius: '1rem',
  },
  achievementIcon: {
    fontSize: '2rem',
  },
  achievementTitle: {
    fontWeight: '600',
    fontSize: '0.9rem',
  },
  achievementDesc: {
    fontSize: '0.7rem',
    color: '#888',
  },
};

export default ProfilePage;