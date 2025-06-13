import { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

function Cabinet({ user, onLogout }) {
  return (
    <div className="App">
      <h2>Личный кабинет</h2>
      <p>Добро пожаловать, {user.login}!</p>
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
}

function App() {
  // --- загружаем user/token из localStorage, если есть
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [page, setPage] = useState('login');

  // --- при логине/регистрации сохраняем токен
  const handleLogin = (data) => {
    setUser({ login: data.login, token: data.token });
    localStorage.setItem('user', JSON.stringify({ login: data.login, token: data.token }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setPage('login');
  };

  if (user) {
    return <Cabinet user={user} onLogout={handleLogout} />;
  }

  if (page === 'register') {
    return (
      <div>
        <RegisterPage onRegister={handleLogin} />
        <p>
          Уже есть аккаунт?{' '}
          <button onClick={() => setPage('login')}>Войти</button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <LoginPage onLogin={handleLogin} />
      <p>
        Нет аккаунта?{' '}
        <button onClick={() => setPage('register')}>Зарегистрироваться</button>
      </p>
    </div>
  );
}

export default App;