import { useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function HorizontalScroll({ aspects, onSelectAspect }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={styles.container}>
      <button style={{...styles.scrollBtn, ...styles.left}} onClick={() => scroll('left')}>
        <FaArrowLeft />
      </button>
      
      <div ref={scrollRef} style={styles.wrapper}>
        {aspects.map((a) => (
          <div key={a.id} style={styles.card} onClick={() => onSelectAspect(a.id)}>
            <div style={styles.cardImage}>
              <img src={a.player_image} alt={a.player_name} style={styles.img} />
              <div style={styles.badge}>{a.difficulty}</div>
            </div>
            <div style={styles.cardInfo}>
              <div style={styles.emoji}>{a.icon}</div>
              <h3 style={styles.cardTitle}>{a.name}</h3>
              <p style={styles.cardPlayer}>{a.player_name}</p>
              <button style={styles.startBtn}>▶ Начать</button>
            </div>
          </div>
        ))}
      </div>
      
      <button style={{...styles.scrollBtn, ...styles.right}} onClick={() => scroll('right')}>
        <FaArrowRight />
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    margin: '2rem 0',
    padding: '0 40px',
  },
  wrapper: {
    display: 'flex',
    gap: '1.5rem',
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    padding: '1rem 0.5rem',
    scrollbarWidth: 'thin',
  },
  card: {
    minWidth: '280px',
    maxWidth: '280px',
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    border: '2px solid rgba(255,215,0,0.3)',
  },
  cardImage: {
    position: 'relative',
    height: '220px',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: '#8B0000',
  },
  cardInfo: {
    padding: '1rem',
    textAlign: 'center',
  },
  emoji: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.25rem',
    color: 'white',
  },
  cardPlayer: {
    fontSize: '0.8rem',
    color: '#FFD700',
    marginBottom: '0.75rem',
  },
  startBtn: {
    background: 'linear-gradient(135deg, #FFD700, #FFA500)',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    color: '#8B0000',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
  },
  scrollBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(255,215,0,0.9)',
    border: 'none',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  left: { left: 0 },
  right: { right: 0 },
};

export default HorizontalScroll;