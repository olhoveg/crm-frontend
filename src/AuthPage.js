import React, { useState } from 'react';

function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const allowedRoles = ['specialist', 'admin'];
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const url =
      mode === 'login'
        ? 'http://localhost:3001/api/login'
        : 'http://localhost:3001/api/register';

    // Дополнительно отправляем role при регистрации
    const body =
      mode === 'login'
        ? { login, password }
        : { login, password, role: 'specialist' };

    try {
      console.log('Попытка логина', body);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log('login response', data);
      if (data.success) {
        if (mode === 'login') {
          // Только если роль не client
          if (!allowedRoles.includes(data.role)) {
            setMessage('Доступ только для специалистов и администраторов');
            return;
          }
          setMessage('Успешный вход!');
          if (onAuthSuccess) onAuthSuccess(data);
        } else {
          setMessage('Успешная регистрация!');
          // Automatically switch to login after successful registration
          setTimeout(() => setMode('login'), 1000);
        }
      } else {
        setMessage(data.message || (mode === 'login' ? 'Ошибка входа' : 'Ошибка регистрации'));
      }
    } catch {
      setMessage('Ошибка соединения с сервером');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => { setMode('login'); setMessage(''); }}
            style={mode === 'login' ? styles.tabActive : styles.tab}
          >
            Войти
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setMessage(''); }}
            style={mode === 'register' ? styles.tabActive : styles.tab}
          >
            Регистрация
          </button>
        </div>
        <h2 style={styles.title}>
          {mode === 'login' ? 'Вход в систему' : 'Регистрация'}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            style={styles.input}
            autoFocus
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        {message && (
          <div style={message.startsWith('Успешн') ? styles.successMsg : styles.errorMsg}>
            {message}
          </div>
        )}
      </div>
      <style>{`
        body { background: #f0f2f5; }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #dbe6e4 0%, #b8c6db 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    background: '#fff',
    borderRadius: 18,
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    padding: '38px 32px 28px 32px',
    width: 360,
    maxWidth: '100%',
    textAlign: 'center',
  },
  tabs: {
    display: 'flex',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
  },
  tab: {
    flex: 1,
    padding: '12px 0',
    background: '#f5f6fa',
    border: 'none',
    fontSize: 17,
    color: '#6571a3',
    cursor: 'pointer',
  },
  tabActive: {
    flex: 1,
    padding: '12px 0',
    background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
    color: '#fff',
    fontSize: 17,
    fontWeight: 600,
    border: 'none',
  },
  title: {
    marginBottom: 24,
    fontSize: 24,
    fontWeight: 700,
    color: '#14274e',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  input: {
    padding: '12px 14px',
    fontSize: 16,
    borderRadius: 8,
    border: '1px solid #e0e7ef',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px 0',
    fontSize: 17,
    fontWeight: 600,
    borderRadius: 8,
    background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
  successMsg: {
    marginTop: 20,
    padding: '10px 0',
    background: '#e6fff2',
    color: '#219c5e',
    borderRadius: 8,
  },
  errorMsg: {
    marginTop: 20,
    padding: '10px 0',
    background: '#ffecec',
    color: '#fc4343',
    borderRadius: 8,
  },
};

export default AuthPage;