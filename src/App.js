import { useState } from 'react';
import AuthPage from './AuthPage';
import Cabinet from './Cabinet';

function App() {
  // --- загружаем user/token из localStorage, если есть
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // --- при логине/регистрации сохраняем токен
  const handleLogin = (data) => {
    setUser({ login: data.login, token: data.token });
    localStorage.setItem('user', JSON.stringify({ login: data.login, token: data.token }));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (user) {
    return <Cabinet user={user} onLogout={handleLogout} />;
  }

  return <AuthPage onAuthSuccess={handleLogin} />;
}

export default App;