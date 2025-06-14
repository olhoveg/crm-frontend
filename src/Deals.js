import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Deals({ user }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDeal, setNewDeal] = useState({
    title: '', budget: '', status: 'В работе', comment: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/deals', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        setDeals(data);
        setLoading(false);
      } catch (e) {
        setError('Ошибка загрузки сделок');
        setLoading(false);
      }
    };
    fetchDeals();
  }, [user.token]);

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(newDeal)
      });
      const data = await res.json();
      if (data.success) {
        setDeals([data.deal, ...deals]);
        setNewDeal({ title: '', budget: '', status: 'В работе', comment: '' });
      } else {
        setError(data.message || 'Ошибка создания сделки');
      }
    } catch {
      setError('Ошибка соединения с сервером');
    }
  };

  return (
    <div>
      <h2 style={{ color: '#14274e', fontWeight: 700, fontSize: 28, marginBottom: 22 }}>Сделки</h2>
      <form onSubmit={handleCreateDeal} style={{ marginBottom: 32 }}>
        <input
          placeholder="Название сделки"
          value={newDeal.title}
          onChange={e => setNewDeal({ ...newDeal, title: e.target.value })}
          style={{ padding: 10, marginRight: 14, fontSize: 16 }}
        />
        <input
          placeholder="Бюджет"
          value={newDeal.budget}
          onChange={e => setNewDeal({ ...newDeal, budget: e.target.value })}
          style={{ padding: 10, marginRight: 14, fontSize: 16, width: 120 }}
        />
        <button type="submit" style={{ padding: 10, fontSize: 16 }}>Создать</button>
      </form>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {deals.map(deal => (
            <li key={deal.id} style={{
              background: '#f8fafc', borderRadius: 8, padding: '17px 22px', marginBottom: 16,
              textAlign: 'left', fontSize: 18, boxShadow: '0 1px 7px rgba(100,120,180,0.07)',
              cursor: 'pointer'
            }} onClick={() => navigate(`/deals/${deal.id}`)}>
              <b>Сделка #{deal.id}</b> — {deal.title}
              <div>Статус: {deal.status}</div>
              <div>Бюджет: {deal.budget}</div>
              <div>Комментарий: {deal.comment}</div>
            </li>
          ))}
        </ul>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
}

export default Deals;