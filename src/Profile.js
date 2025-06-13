import React, { useEffect, useState } from 'react';

// Маппинг ролей на русский
const ROLE_LABELS = {
  client: 'Клиент',
  specialist: 'Специалист',
  admin: 'Администратор'
};

function Profile({ user }) {
  const [form, setForm] = useState({
    login: user.login || '',
    lastname: '',
    firstname: '',
    middlename: '',
    email: '',
    role: user.role || '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editing, setEditing] = useState(false);

  // Загрузка профиля из API
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/profile', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!res.ok) throw new Error('Ошибка загрузки');
        const data = await res.json();
        setForm({
          login: data.login,
          lastname: data.lastname || '',
          firstname: data.firstname || '',
          middlename: data.middlename || '',
          email: data.email || '',
          role: data.role || ''
        });
        setLoading(false);
      } catch (e) {
        setMessage('Ошибка загрузки профиля');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user.token, user.login]);

  // Обработка изменений формы
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Сохранить изменения
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:3001/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Данные успешно обновлены!');
        setEditing(false);
      } else {
        setMessage(data.message || 'Ошибка обновления');
      }
    } catch {
      setMessage('Ошибка соединения с сервером');
    }
  };

  if (loading) return <div style={styles.profileField}>Загрузка профиля...</div>;

  return (
    <div>
      <h2 style={styles.title}>Профиль специалиста</h2>
      <form onSubmit={handleSave} style={{ maxWidth: 420, margin: '0 auto', textAlign: 'left' }}>
        <div style={styles.profileField}>
          <b>Логин:</b> {form.login}
        </div>
        <label style={styles.label}>
          Фамилия:
          <input
            style={styles.input}
            name="lastname"
            value={form.lastname}
            onChange={handleChange}
            disabled={!editing}
          />
        </label>
        <label style={styles.label}>
          Имя:
          <input
            style={styles.input}
            name="firstname"
            value={form.firstname}
            onChange={handleChange}
            disabled={!editing}
          />
        </label>
        <label style={styles.label}>
          Отчество:
          <input
            style={styles.input}
            name="middlename"
            value={form.middlename}
            onChange={handleChange}
            disabled={!editing}
          />
        </label>
        <label style={styles.label}>
          Email:
          <input
            style={styles.input}
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={!editing}
          />
        </label>
        <div style={styles.profileField}>
          <b>Роль:</b> {ROLE_LABELS[form.role] || form.role}
        </div>
        {editing ? (
          <div>
            <button type="submit" style={styles.saveBtn}>Сохранить</button>
            <button
              type="button"
              style={styles.cancelBtn}
              onClick={() => { setEditing(false); setMessage(''); }}
            >Отмена</button>
          </div>
        ) : (
          <button type="button" style={styles.editBtn} onClick={() => setEditing(true)}>
            Редактировать
          </button>
        )}
        {message && <div style={message.startsWith('Данные') ? styles.successMsg : styles.errorMsg}>{message}</div>}
      </form>
    </div>
  );
}

const styles = {
  title: {
    color: '#14274e',
    fontWeight: 700,
    fontSize: 28,
    marginBottom: 22
  },
  label: {
    display: 'block',
    marginBottom: 13,
    fontSize: 17,
    color: '#14274e'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #e0e7ef',
    borderRadius: 8,
    fontSize: 17,
    background: '#f8fafc',
    marginTop: 4
  },
  profileField: {
    background: '#f8fafc',
    borderRadius: 8,
    padding: '14px 20px',
    marginBottom: 16,
    fontSize: 18,
    color: '#14274e',
    boxShadow: '0 1px 4px rgba(100,120,180,0.04)'
  },
  editBtn: {
    marginTop: 20,
    padding: '12px 32px',
    background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
    color: '#fff',
    borderRadius: 8,
    border: 'none',
    fontWeight: 600,
    fontSize: 17,
    cursor: 'pointer'
  },
  saveBtn: {
    marginTop: 20,
    padding: '12px 32px',
    background: 'linear-gradient(90deg, #1ec57c 0%, #2fc8e0 100%)',
    color: '#fff',
    borderRadius: 8,
    border: 'none',
    fontWeight: 600,
    fontSize: 17,
    marginRight: 16,
    cursor: 'pointer'
  },
  cancelBtn: {
    marginTop: 20,
    padding: '12px 24px',
    background: '#eee',
    color: '#607090',
    borderRadius: 8,
    border: 'none',
    fontWeight: 600,
    fontSize: 17,
    cursor: 'pointer'
  },
  successMsg: {
    marginTop: 24,
    background: '#e6fff2',
    color: '#219c5e',
    borderRadius: 8,
    padding: '13px 0',
    fontWeight: 500,
    fontSize: 16,
    textAlign: 'center'
  },
  errorMsg: {
    marginTop: 24,
    background: '#ffecec',
    color: '#fc4343',
    borderRadius: 8,
    padding: '13px 0',
    fontWeight: 500,
    fontSize: 16,
    textAlign: 'center'
  }
};

export default Profile;