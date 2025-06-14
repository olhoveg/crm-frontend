import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function DealDetail({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Для редактирования
  const [form, setForm] = useState({
    title: '', budget: '', status: '', comment: ''
  });

  useEffect(() => {
    const fetchDeal = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3001/api/deals/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (data.id) {
          setDeal(data);
          setForm({
            title: data.title || '',
            budget: data.budget || '',
            status: data.status || '',
            comment: data.comment || ''
          });
        } else {
          setError('Сделка не найдена');
        }
        setLoading(false);
      } catch {
        setError('Ошибка загрузки сделки');
        setLoading(false);
      }
    };
    fetchDeal();
  }, [id, user.token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch(`http://localhost:3001/api/deals/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success) {
        setDeal(data.deal);
        setEditing(false);
        setMessage('Изменения сохранены');
      } else {
        setMessage(data.message || 'Ошибка сохранения');
      }
    } catch {
      setMessage('Ошибка соединения с сервером');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!deal) return null;

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 1px 10px rgba(0,0,0,0.07)', padding: 32 }}>
      <button onClick={() => navigate('/deals')} style={{ marginBottom: 24 }}>
        ← Назад к сделкам
      </button>
      <h2 style={{ fontSize: 28, fontWeight: 700, color: '#14274e', marginBottom: 18 }}>
        Сделка #{deal.id}
      </h2>
      <form onSubmit={handleSave}>
        <div style={{ marginBottom: 16 }}>
          <b>Название:</b><br />
          <input
            name="title"
            value={editing ? form.title : deal.title}
            onChange={handleChange}
            style={{ width: '100%', padding: 9, fontSize: 18 }}
            disabled={!editing}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Бюджет:</b><br />
          <input
            name="budget"
            value={editing ? form.budget : deal.budget}
            onChange={handleChange}
            style={{ width: '100%', padding: 9, fontSize: 18 }}
            disabled={!editing}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Статус:</b><br />
          <input
            name="status"
            value={editing ? form.status : deal.status}
            onChange={handleChange}
            style={{ width: '100%', padding: 9, fontSize: 18 }}
            disabled={!editing}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <b>Комментарий:</b><br />
          <textarea
            name="comment"
            value={editing ? form.comment : deal.comment}
            onChange={handleChange}
            style={{ width: '100%', minHeight: 60, fontSize: 16, padding: 8 }}
            disabled={!editing}
          />
        </div>
        {editing ? (
          <div>
            <button type="submit" style={{ padding: '8px 24px', marginRight: 14 }}>Сохранить</button>
            <button type="button" style={{ padding: '8px 24px' }} onClick={() => setEditing(false)}>Отмена</button>
          </div>
        ) : (
          <button type="button" style={{ padding: '8px 24px' }} onClick={() => setEditing(true)}>
            Редактировать
          </button>
        )}
        {message && <div style={{ marginTop: 18, color: '#219c5e', fontWeight: 500 }}>{message}</div>}
      </form>
    </div>
  );
}

export default DealDetail;