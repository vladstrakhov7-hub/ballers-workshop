from flask import Flask, jsonify, request, session
from flask_cors import CORS
import sqlite3
import hashlib
import json

app = Flask(__name__)
app.secret_key = 'ballers_workshop_secret_key_2025'
CORS(app, supports_credentials=True, origins=[
    'http://localhost:5173',
    'https://ballers-workshop.vercel.app',
    'https://ballers-workshop.onrender.com'
])

def init_db():
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    
    # Таблица пользователей
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                 id INTEGER PRIMARY KEY,
                 username TEXT UNIQUE,
                 password TEXT,
                 email TEXT,
                 registered_date TEXT,
                 total_progress INTEGER DEFAULT 0,
                 is_admin INTEGER DEFAULT 0)''')
    
    # Таблица аспектов (звезды)
    c.execute('''CREATE TABLE IF NOT EXISTS aspects (
                 id INTEGER PRIMARY KEY,
                 name TEXT,
                 player_name TEXT,
                 player_image TEXT,
                 icon TEXT,
                 color TEXT,
                 difficulty TEXT)''')
    
    # Таблица тренировок
    c.execute('''CREATE TABLE IF NOT EXISTS sequences (
                 id INTEGER PRIMARY KEY,
                 aspect_id INTEGER,
                 step_number INTEGER,
                 exercise TEXT,
                 duration TEXT,
                 description TEXT,
                 FOREIGN KEY(aspect_id) REFERENCES aspects(id))''')
    
    # Таблица прогресса пользователя
    c.execute('''CREATE TABLE IF NOT EXISTS user_progress (
                 id INTEGER PRIMARY KEY,
                 user_id INTEGER,
                 aspect_id INTEGER,
                 completed_steps TEXT,
                 FOREIGN KEY(user_id) REFERENCES users(id),
                 FOREIGN KEY(aspect_id) REFERENCES aspects(id))''')
    
    # Добавляем звезд
    stars_data = [
        (1, 'Дриблинг Ямаля', 'Ламин Ямаль', '/images/lamine-yamal.jpg', '🇪🇸✨', 'blue', '⭐️⭐️⭐️'),
        (2, 'Завершение Холланда', 'Эрлинг Холланд', '/images/haaland.jpg', '🇳🇴⚡', 'green', '⭐️⭐️⭐️⭐️'),
        (3, 'Финты Винисиуса', 'Винисиус Жуниор', '/images/vinicius-jr.jpg', '🇧🇷🎭', 'yellow', '⭐️⭐️⭐️⭐️'),
        (4, 'Видение Месси', 'Лионель Месси', '/images/messi.jpg', '🇦🇷🐐', 'red', '⭐️⭐️⭐️⭐️⭐️'),
        (5, 'Магия Роналдо', 'Криштиану Роналдо', '/images/ronaldo.jpg', '🇵🇹🐐', 'orange', '⭐️⭐️⭐️⭐️⭐️'),
    ]
    
    for star in stars_data:
        c.execute('INSERT OR IGNORE INTO aspects (id, name, player_name, player_image, icon, color, difficulty) VALUES (?,?,?,?,?,?,?)', star)
    
    # Тренировки
    trainings_data = [
        # Ямаль
        (1, 1, 1, 'Дриблинг в коридоре', '10', 'Дриблинг между 5 конусами на максимальной скорости'),
        (2, 1, 2, 'Смена направления', '12', 'Резкие развороты с мячом на 180 градусов'),
        (3, 1, 3, 'Обыгрыш один в один', '15', 'Финт + уход в сторону + ускорение'),
        # Холланд
        (4, 2, 1, 'Удар в девятку', '10', '10 ударов с линии штрафной в верхние углы'),
        (5, 2, 2, 'Удар с разворота', '12', 'Прием мяча + разворот + удар за 2 секунды'),
        (6, 2, 3, 'Игра на опережение', '15', 'Забегания за спину защитнику на скорость'),
        # Винисиус
        (7, 3, 1, 'Эластико', '15', 'Техника эластико - перекат мяча внешней и внутренней'),
        (8, 3, 2, 'Финт тела', '10', 'Ложный замах корпусом + уход в сторону'),
        (9, 3, 3, 'Радута', '15', 'Перекидка мяча через себя и головой'),
        # Месси
        (10, 4, 1, 'Пас в касание', '12', 'Стенка со сменой позиции, 10 повторений'),
        (11, 4, 2, 'Сквозная передача', '15', 'Пас в разрез между манекенами на точность'),
        (12, 4, 3, 'Пас со сканированием', '12', 'Перед пасом - быстрый взгляд через плечо'),
        # Роналдо
        (13, 5, 1, 'Прыжок на опережение', '12', 'Прыжок выше защитника, удар головой'),
        (14, 5, 2, 'Удар со штрафного', '15', 'Стенка + удар с 25 метров'),
        (15, 5, 3, 'Финт с уходом', '15', 'Ложный замах + уход + удар сходу'),
    ]
    
    for t in trainings_data:
        c.execute('INSERT OR IGNORE INTO sequences (id, aspect_id, step_number, exercise, duration, description) VALUES (?,?,?,?,?,?)', t)
    
    # Создаем админа (admin / admin123)
    admin_hash = hashlib.sha256('admin123'.encode()).hexdigest()
    c.execute('INSERT OR IGNORE INTO users (id, username, password, email, registered_date, is_admin) VALUES (1, "admin", ?, "admin@baller.com", datetime("now"), 1)', (admin_hash,))
    
    conn.commit()
    conn.close()
    print("✅ База данных создана!")

@app.route('/api/aspects', methods=['GET'])
def get_aspects():
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    c.execute('SELECT id, name, player_name, player_image, icon, color, difficulty FROM aspects')
    aspects = [{'id': row[0], 'name': row[1], 'player_name': row[2], 'player_image': row[3], 'icon': row[4], 'color': row[5], 'difficulty': row[6]} for row in c.fetchall()]
    conn.close()
    return jsonify(aspects)

@app.route('/api/aspect/<int:aspect_id>/trainings', methods=['GET'])
def get_trainings(aspect_id):
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    c.execute('SELECT step_number, exercise, duration, description FROM sequences WHERE aspect_id=? ORDER BY step_number', (aspect_id,))
    trainings = [{'step': row[0], 'exercise': row[1], 'duration': row[2], 'description': row[3]} for row in c.fetchall()]
    conn.close()
    return jsonify(trainings)

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = hashlib.sha256(data.get('password').encode()).hexdigest()
    email = data.get('email')
    
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    try:
        c.execute('INSERT INTO users (username, password, email, registered_date) VALUES (?, ?, ?, datetime("now"))', 
                 (username, password, email))
        conn.commit()
        conn.close()
        return jsonify({'success': True, 'message': 'Регистрация успешна!'})
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'success': False, 'message': 'Пользователь уже существует'})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = hashlib.sha256(data.get('password').encode()).hexdigest()
    
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    c.execute('SELECT id, username, is_admin FROM users WHERE username=? AND password=?', (username, password))
    user = c.fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user[0]
        session['username'] = user[1]
        return jsonify({'success': True, 'user': {'id': user[0], 'username': user[1], 'is_admin': user[2]}})
    return jsonify({'success': False, 'message': 'Неверный логин или пароль'})

@app.route('/api/users', methods=['GET'])
def get_users():
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    c.execute('SELECT id, username, email, registered_date, total_progress FROM users')
    users = [{'id': row[0], 'username': row[1], 'email': row[2], 'date': row[3], 'progress': row[4]} for row in c.fetchall()]
    conn.close()
    return jsonify(users)

if __name__ == '__main__':
    init_db()
    print("🚀 Сервер запущен на http://localhost:5000")
    app.run(debug=True, port=5000) 

    # Добавь после существующего кода:

@app.route('/api/save_progress', methods=['POST'])
def save_progress():
    data = request.json
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Не авторизован'})
    
    aspect_id = data.get('aspect_id')
    completed_steps = json.dumps(data.get('completed_steps', {}))
    
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO user_progress (user_id, aspect_id, completed_steps) 
                 VALUES (?, ?, ?)''', (user_id, aspect_id, completed_steps))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/get_progress', methods=['GET'])
def get_progress():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False, 'message': 'Не авторизован'})
    
    aspect_id = request.args.get('aspect_id')
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    c.execute('SELECT completed_steps FROM user_progress WHERE user_id=? AND aspect_id=?', 
              (user_id, aspect_id))
    row = c.fetchone()
    conn.close()
    
    if row:
        return jsonify({'success': True, 'progress': json.loads(row[0])})
    return jsonify({'success': True, 'progress': {}})

@app.route('/api/user_stats', methods=['GET'])
def user_stats():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'success': False})
    
    conn = sqlite3.connect('football.db')
    c = conn.cursor()
    
    # Общее количество завершенных тренировок
    c.execute('''SELECT COUNT(*) FROM user_progress WHERE user_id=?''', (user_id,))
    total_completed = c.fetchone()[0]
    
    # Обновляем total_progress пользователя
    c.execute('UPDATE users SET total_progress=? WHERE id=?', (total_completed * 10, user_id))
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'completed_trainings': total_completed})