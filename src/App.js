import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import CabinetLayout from './CabinetLayout';
import Profile from './Profile';
import DealDetail from './DealDetail';
import KanbanBoard from './KanbanBoard';


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

  return (
    <Router>
      <Routes>
        {!user ? (
          // Неавторизованный — на любую страницу только AuthPage
          <Route path="*" element={<AuthPage onAuthSuccess={handleLogin} />} />
        ) : (
          <>
            <Route path="/" element={<CabinetLayout user={user} onLogout={handleLogout} />}>
              <Route index element={<Profile user={user} />} />
              <Route path="deals" element={<KanbanBoard user={user} />} />
              <Route path="deals/:id" element={<DealDetail user={user} />} />
            </Route>
            
            {/* Любая другая страница — редирект в корень */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;