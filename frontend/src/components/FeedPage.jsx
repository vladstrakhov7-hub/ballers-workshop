import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaComment, FaShare, FaUpload, FaArrowLeft, FaTrash } from 'react-icons/fa';

function FeedPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '', image: null, imagePreview: null });

  // Загружаем посты из localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('feed_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Демо-посты
      const demoPosts = [
        {
          id: 1,
          username: 'Алексей_10',
          avatar: '⚽',
          title: 'Закончил тренировку по дриблингу Ямаля!',
          description: '3 дня упорных тренировок и результат виден. Дриблинг стал намного резче! 🔥',
          image: null,
          likes: 24,
          comments: 5,
          date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          achievement: 'Дриблинг Ямаля'
        },
        {
          id: 2,
          username: 'FootballKing7',
          avatar: '👑',
          title: 'Мой прогресс после тренировок Холланда',
          description: 'Забил 7 голов в последней игре! Спасибо за программу! 🎯',
          image: null,
          likes: 56,
          comments: 12,
          date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          achievement: 'Завершение Холланда'
        }
      ];
      setPosts(demoPosts);
      localStorage.setItem('feed_posts', JSON.stringify(demoPosts));
    }
  }, []);

  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
  };

  const handleDelete = (postId) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result, imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim()) {
      alert('Введите заголовок');
      return;
    }
    
    const newPostObj = {
      id: Date.now(),
      username: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : 'Пользователь',
      avatar: '⚡',
      title: newPost.title,
      description: newPost.description,
      image: newPost.image || null,
      likes: 0,
      comments: 0,
      date: new Date().toISOString(),
      achievement: 'Новое достижение'
    };
    
    const updatedPosts = [newPostObj, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('feed_posts', JSON.stringify(updatedPosts));
    setNewPost({ title: '', description: '', image: null, imagePreview: null });
    setShowUpload(false);
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffHours < 1) return 'только что';
    if (diffHours < 24) return `${diffHours} ч назад`;
    return `${Math.floor(diffHours / 24)} д назад`;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <FaArrowLeft /> На главную
        </button>
        <h1 style={styles.title}>📸 Лента достижений</h1>
        <button style={styles.uploadBtn} onClick={() => setShowUpload(true)}>
          <FaUpload /> Поделиться
        </button>
      </div>
      
      <p style={styles.subtitle}>Смотри, как прогрессируют другие, и делись своими успехами!</p>

      <div style={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id} style={styles.postCard}>
            <div style={styles.postHeader}>
              <div style={styles.postAvatar}>{post.avatar}</div>
              <div style={styles.postUserInfo}>
                <span style={styles.username}>{post.username}</span>
                <span style={styles.postDate}>{formatDate(post.date)}</span>
              </div>
              <div style={styles.achievementBadge}>{post.achievement}</div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(post.id)}>
                <FaTrash />
              </button>
            </div>
            
            {post.image && (
              <div style={styles.postImage}>
                <img src={post.image} alt={post.title} style={styles.image} />
              </div>
            )}
            
            <div style={styles.postContent}>
              <h3 style={styles.postTitle}>{post.title}</h3>
              <p style={styles.postDescription}>{post.description}</p>
            </div>
            
            <div style={styles.postActions}>
              <button style={styles.actionBtn} onClick={() => handleLike(post.id)}>
                <FaHeart /> {post.likes}
              </button>
              <button style={styles.actionBtn}>
                <FaComment /> {post.comments}
              </button>
              <button style={styles.actionBtn}>
                <FaShare /> Поделиться
              </button>
            </div>
          </div>
        ))}
      </div>

      {showUpload && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h2 style={styles.modalTitle}>Поделиться достижением</h2>
            <input 
              type="text" 
              placeholder="Заголовок"
              style={styles.input}
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            />
            <textarea 
              placeholder="Расскажи о своем прогрессе..."
              style={styles.textarea}
              value={newPost.description}
              onChange={(e) => setNewPost({...newPost, description: e.target.value})}
            />
            <input type="file" accept="image/*" onChange={handleImageChange} style={styles.fileInput} />
            {newPost.imagePreview && (
              <div style={styles.previewContainer}>
                <img src={newPost.imagePreview} alt="preview" style={styles.preview} />
              </div>
            )}
            <div style={styles.modalButtons}>
              <button style={styles.cancelBtn} onClick={() => setShowUpload(false)}>Отмена</button>
              <button style={styles.submitBtn} onClick={handleSubmitPost}>Опубликовать</button>
            </div>
          </div>
        </div>
      )}
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
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1rem',
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
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#1A1A1A',
  },
  uploadBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#E31B23',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '2rem',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '2rem',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
    gap: '1.5rem',
  },
  postCard: {
    background: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '1rem',
    overflow: 'hidden',
    transition: 'all 0.2s',
  },
  postHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    borderBottom: '1px solid #F0F0F0',
  },
  postAvatar: {
    width: '40px',
    height: '40px',
    background: '#F5F5F5',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
  },
  postUserInfo: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    display: 'block',
    color: '#1A1A1A',
  },
  postDate: {
    fontSize: '0.7rem',
    color: '#999',
  },
  achievementBadge: {
    background: '#FFE5E6',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
    fontSize: '0.7rem',
    color: '#E31B23',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#CCC',
    cursor: 'pointer',
  },
  postImage: {
    background: '#F5F5F5',
    minHeight: '200px',
  },
  image: {
    width: '100%',
    height: 'auto',
  },
  postContent: {
    padding: '1rem',
  },
  postTitle: {
    fontSize: '1.1rem',
    marginBottom: '0.5rem',
    color: '#1A1A1A',
  },
  postDescription: {
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.5',
  },
  postActions: {
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    borderTop: '1px solid #F0F0F0',
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    background: 'white',
    borderRadius: '1rem',
    padding: '2rem',
    width: '90%',
    maxWidth: '500px',
  },
  modalTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#1A1A1A',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #E0E0E0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    margin: '0.5rem 0',
    border: '1px solid #E0E0E0',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    minHeight: '100px',
    fontFamily: 'inherit',
  },
  fileInput: {
    margin: '0.5rem 0',
  },
  previewContainer: {
    margin: '0.5rem 0',
  },
  preview: {
    maxWidth: '100%',
    borderRadius: '0.5rem',
  },
  modalButtons: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1rem',
  },
  cancelBtn: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #E0E0E0',
    background: 'white',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 1,
    padding: '0.75rem',
    background: '#E31B23',
    border: 'none',
    borderRadius: '0.5rem',
    color: 'white',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default FeedPage;