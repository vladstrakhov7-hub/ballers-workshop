import { useState, useEffect } from 'react';
import { FaCheck, FaPlay, FaArrowLeft, FaClock, FaFire, FaTrophy, FaShare, FaHeart } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function TrainingDetail({ aspect, trainings, onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [liked, setLiked] = useState(false);

  // Сохранение прогресса на сервер
  const saveProgressToServer = async (steps) => {
    try {
      await fetch('http://localhost:5000/api/save_progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          aspect_id: aspect.id,
          completed_steps: steps
        })
      });
    } catch (err) {
      console.error('Ошибка сохранения:', err);
    }
  };

  // Переключение шага
  const toggleStep = (step) => {
    const newCompleted = { ...completedSteps, [step]: !completedSteps[step] };
    setCompletedSteps(newCompleted);
    saveProgressToServer(newCompleted);
  };

  // Загрузка прогресса при монтировании
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/get_progress?aspect_id=${aspect.id}`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.progress) {
          setCompletedSteps(data.progress);
        }
      } catch (err) {
        console.error('Ошибка загрузки прогресса:', err);
      }
    };
    loadProgress();
  }, [aspect.id]);

  const progress = trainings.length > 0 
    ? (Object.values(completedSteps).filter(v => v === true).length / trainings.length) * 100 
    : 0;

  const currentTraining = trainings[currentStep];
  const totalDuration = trainings.reduce((sum, t) => sum + parseInt(t.duration), 0);

  if (!currentTraining) {
    return <div style={styles.loading}>Загрузка...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Шапка */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={onBack}>
          <FaArrowLeft /> Все тренировки
        </button>
        <div style={styles.headerRight}>
          <button style={styles.likeBtn} onClick={() => setLiked(!liked)}>
            <FaHeart color={liked ? '#E31B23' : '#999'} />
          </button>
          <button style={styles.shareBtn}>
            <FaShare /> Поделиться
          </button>
        </div>
      </div>

      {/* Игрок и прогресс */}
      <div style={styles.playerSection}>
        <div style={styles.playerCard}>
          <div style={styles.playerIconLarge}>{aspect.icon}</div>
          <div style={styles.playerInfo}>
            <h1 style={styles.playerTitle}>{aspect.name}</h1>
            <p style={styles.playerName}>{aspect.player_name}</p>
            <div style={styles.difficultyBadge}>{aspect.difficulty}</div>
          </div>
        </div>
        
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <FaClock style={styles.statIcon} />
            <div>
              <div style={styles.statValue}>{totalDuration} мин</div>
              <div style={styles.statLabel}>всего времени</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <FaFire style={styles.statIcon} />
            <div>
              <div style={styles.statValue}>{trainings.length}</div>
              <div style={styles.statLabel}>упражнений</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <FaTrophy style={styles.statIcon} />
            <div>
              <div style={styles.statValue}>{Math.round(progress)}%</div>
              <div style={styles.statLabel}>прогресс</div>
            </div>
          </div>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div style={styles.progressWrapper}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <div style={styles.progressSteps}>
          {trainings.map((t, idx) => (
            <div
              key={t.step}
              style={{
                ...styles.progressStep,
                ...(idx <= currentStep ? styles.progressStepActive : {}),
                ...(completedSteps[t.step] ? styles.progressStepCompleted : {})
              }}
              onClick={() => setCurrentStep(idx)}
            >
              {completedSteps[t.step] ? '✓' : t.step}
            </div>
          ))}
        </div>
      </div>

      {/* Основной контент тренировки */}
      <div style={styles.trainingMain}>
        <div style={styles.exerciseVisual}>
          <div style={styles.exerciseImage}>
            <div style={styles.imagePlaceholder}>
              <div style={styles.trainingAnimation}>
                <div style={styles.playerIconAnimate}>🏃‍♂️</div>
                <div style={styles.trainingPath}>
                  <span>🚧</span>
                  <span>→</span>
                  <span>🚧</span>
                  <span>→</span>
                  <span>🚧</span>
                  <span>→</span>
                  <span>⚽</span>
                </div>
              </div>
            </div>
            <button style={styles.videoBtn}>
              <FaPlay /> Смотреть видеоурок
            </button>
          </div>
          
          <div style={styles.exerciseInfo}>
            <div style={styles.stepBadge}>Упражнение {currentStep + 1} из {trainings.length}</div>
            <h2 style={styles.exerciseTitle}>{currentTraining.exercise}</h2>
            <div style={styles.durationChip}>⏱ {currentTraining.duration} минут</div>
            <p style={styles.description}>{currentTraining.description}</p>
            
            <div style={styles.tipsBox}>
              <div style={styles.tipsTitle}>💡 Совет тренера</div>
              <p>Следи за техникой, а не за скоростью. Качество важнее количества повторений!</p>
            </div>
          </div>
        </div>

        {/* Схема выполнения */}
        <div style={styles.schemaSection}>
          <h3 style={styles.schemaTitle}>📐 Схема выполнения</h3>
          <div style={styles.schemaGrid}>
            <div style={styles.schemaStep}>
              <div style={styles.schemaNumber}>1</div>
              <div>Исходная позиция</div>
            </div>
            <div style={styles.schemaArrow}>→</div>
            <div style={styles.schemaStep}>
              <div style={styles.schemaNumber}>2</div>
              <div>Техника движения</div>
            </div>
            <div style={styles.schemaArrow}>→</div>
            <div style={styles.schemaStep}>
              <div style={styles.schemaNumber}>3</div>
              <div>Завершающая фаза</div>
            </div>
          </div>
        </div>

        {/* Кнопки навигации */}
        <div style={styles.navigation}>
          <button 
            style={styles.navBtnPrev}
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            ← Предыдущее
          </button>
          
          <button 
            style={{
              ...styles.completeBtn,
              ...(completedSteps[currentTraining.step] ? styles.completed : {})
            }}
            onClick={() => toggleStep(currentTraining.step)}
          >
            <FaCheck /> 
            {completedSteps[currentTraining.step] ? 'Выполнено!' : 'Отметить выполненным'}
          </button>
          
          <button 
            style={styles.navBtnNext}
            disabled={currentStep === trainings.length - 1}
            onClick={() => setCurrentStep(prev => prev + 1)}
          >
            Следующее →
          </button>
        </div>
      </div>

      {/* Поздравление */}
      <AnimatePresence>
        {progress === 100 && (
          <motion.div 
            style={styles.congratsModal}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div style={styles.congratsIcon}>🏆🔥</div>
            <h3 style={styles.congratsTitle}>Поздравляем!</h3>
            <p>Ты полностью освоил технику {aspect.name}!</p>
            <button style={styles.congratsBtn} onClick={onBack}>
              К другим тренировкам
            </button>
          </motion.div>
        )}
      </AnimatePresence>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
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
    transition: 'all 0.2s',
  },
  headerRight: {
    display: 'flex',
    gap: '0.5rem',
  },
  likeBtn: {
    background: 'none',
    border: '1px solid #E0E0E0',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    cursor: 'pointer',
  },
  shareBtn: {
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
  playerSection: {
    background: 'linear-gradient(135deg, #E31B23 0%, #B8121A 100%)',
    borderRadius: '2rem',
    padding: '2rem',
    marginBottom: '2rem',
    color: 'white',
  },
  playerCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },
  playerIconLarge: {
    fontSize: '4rem',
    background: 'rgba(255,255,255,0.2)',
    width: '90px',
    height: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  playerInfo: {
    flex: 1,
  },
  playerTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    marginBottom: '0.25rem',
  },
  playerName: {
    fontSize: '1rem',
    opacity: 0.9,
    marginBottom: '0.5rem',
  },
  difficultyBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.2)',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.8rem',
  },
  statsRow: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.15)',
    padding: '0.75rem 1.25rem',
    borderRadius: '1rem',
  },
  statIcon: {
    fontSize: '1.5rem',
  },
  statValue: {
    fontSize: '1.25rem',
    fontWeight: '700',
  },
  statLabel: {
    fontSize: '0.7rem',
    opacity: 0.8,
  },
  progressWrapper: {
    marginBottom: '2rem',
  },
  progressBar: {
    height: '8px',
    background: '#F0F0F0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  progressFill: {
    height: '100%',
    background: '#E31B23',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  progressSteps: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  progressStep: {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F5F5F5',
    borderRadius: '50%',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  progressStepActive: {
    background: '#E31B23',
    color: 'white',
  },
  progressStepCompleted: {
    background: '#10B981',
    color: 'white',
  },
  trainingMain: {
    background: '#F9FAFB',
    borderRadius: '1.5rem',
    padding: '1.5rem',
  },
  exerciseVisual: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.5rem',
    marginBottom: '1.5rem',
  },
  exerciseImage: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1rem',
    textAlign: 'center',
    border: '1px solid #E5E7EB',
  },
  imagePlaceholder: {
    background: '#F3F4F6',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1rem',
    minHeight: '200px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainingAnimation: {
    textAlign: 'center',
  },
  playerIconAnimate: {
    fontSize: '3rem',
    animation: 'bounce 1s infinite',
  },
  trainingPath: {
    fontSize: '1.5rem',
    marginTop: '1rem',
    letterSpacing: '8px',
  },
  videoBtn: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    background: '#1A1A1A',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  exerciseInfo: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.25rem',
    border: '1px solid #E5E7EB',
  },
  stepBadge: {
    display: 'inline-block',
    background: '#FFE5E6',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.7rem',
    color: '#E31B23',
    marginBottom: '0.75rem',
  },
  exerciseTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#1A1A1A',
  },
  durationChip: {
    display: 'inline-block',
    background: '#F3F4F6',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.8rem',
    marginBottom: '1rem',
    color: '#666',
  },
  description: {
    lineHeight: '1.6',
    color: '#4B5563',
    marginBottom: '1rem',
  },
  tipsBox: {
    background: '#FFE5E6',
    padding: '1rem',
    borderRadius: '0.75rem',
    marginTop: '1rem',
  },
  tipsTitle: {
    fontWeight: '700',
    color: '#E31B23',
    marginBottom: '0.5rem',
  },
  schemaSection: {
    background: 'white',
    borderRadius: '1rem',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    border: '1px solid #E5E7EB',
  },
  schemaTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#1A1A1A',
  },
  schemaGrid: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  schemaStep: {
    textAlign: 'center',
    background: '#F9FAFB',
    padding: '0.75rem',
    borderRadius: '0.75rem',
    minWidth: '80px',
  },
  schemaNumber: {
    width: '28px',
    height: '28px',
    background: '#E31B23',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 0.5rem',
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  schemaArrow: {
    fontSize: '1.25rem',
    color: '#D1D5DB',
  },
  navigation: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  navBtnPrev: {
    flex: 1,
    padding: '0.75rem',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '0.75rem',
    color: '#1A1A1A',
    cursor: 'pointer',
    fontWeight: '600',
  },
  navBtnNext: {
    flex: 1,
    padding: '0.75rem',
    background: 'white',
    border: '1px solid #E5E7EB',
    borderRadius: '0.75rem',
    color: '#1A1A1A',
    cursor: 'pointer',
    fontWeight: '600',
  },
  completeBtn: {
    flex: 2,
    padding: '0.75rem',
    background: '#E31B23',
    border: 'none',
    borderRadius: '0.75rem',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  completed: {
    background: '#10B981',
  },
  congratsModal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'white',
    padding: '2rem',
    borderRadius: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    zIndex: 1000,
    border: '2px solid #E31B23',
  },
  congratsIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  congratsTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#E31B23',
    marginBottom: '0.5rem',
  },
  congratsBtn: {
    marginTop: '1rem',
    background: '#E31B23',
    border: 'none',
    padding: '0.5rem 1.5rem',
    borderRadius: '2rem',
    color: 'white',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
  },
};

export default TrainingDetail;