import React, { useState } from 'react';

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Успешный вход!');
        if (onLogin) onLogin(data);
      } else {
        setMessage(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setMessage('Ошибка соединения с сервером');
    }
  };

  return (
    <div className="App">
      <h2>Вход в систему</h2>
      <form onSubmit={handleLogin}>
        <div>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Войти</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default LoginPage;