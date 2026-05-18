import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    isVisible && (
      <button onClick={scrollToTop} style={styles.button}>
        <FaArrowUp />
      </button>
    )
  );
}

const styles = {
  button: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    background: '#E31B23',
    border: 'none',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    color: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(227, 27, 35, 0.3)',
    transition: 'all 0.2s',
    zIndex: 1000,
  },
};

export default ScrollToTop;