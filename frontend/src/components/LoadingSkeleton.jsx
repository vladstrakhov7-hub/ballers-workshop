function LoadingSkeleton() {
  return (
    <div style={styles.container}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={styles.skeletonCard}>
          <div style={styles.skeletonImage} />
          <div style={styles.skeletonContent}>
            <div style={styles.skeletonLine} />
            <div style={{ ...styles.skeletonLine, width: '60%' }} />
            <div style={{ ...styles.skeletonLine, width: '80%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  skeletonCard: {
    background: '#F5F5F5',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    border: '1px solid #E0E0E0',
  },
  skeletonImage: {
    height: '280px',
    background: 'linear-gradient(90deg, #E0E0E0 25%, #F0F0F0 50%, #E0E0E0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  },
  skeletonContent: {
    padding: '1.5rem',
  },
  skeletonLine: {
    height: '20px',
    background: '#E0E0E0',
    borderRadius: '10px',
    marginBottom: '12px',
  },
};

// Добавь в глобальный CSS эту анимацию:
// @keyframes shimmer {
//   0% { background-position: 200% 0; }
//   100% { background-position: -200% 0; }
// }

export default LoadingSkeleton;