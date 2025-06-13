import React, { useState } from 'react';

function RegisterPage({ onRegister }) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password })
      });
      const data = await response.json();
      if (data.success) {
        setMessage('Успешная регистрация!');
        if (onRegister) onRegister(data);
      } else {
        setMessage(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setMessage('Ошибка соединения с сервером');
    }
  };

  return (
    <div className="App">
      <h2>Регистрация</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Зарегистрироваться</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default RegisterPage;