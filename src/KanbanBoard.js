import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable
} from '@dnd-kit/core';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

const inputStyle = {
  padding: 8, fontSize: 15, borderRadius: 8, border: '1px solid #d9d9e8',
  width: '92%', marginBottom: 8
};

const STAGES = [
  { id: 'new', title: 'Новая заявка', color: '#ffd967' },
  { id: 'in_work', title: 'Принято в работу', color: '#7ecbfa' },
  { id: 'callback', title: 'Перезвонить', color: '#d7bfff' },
  { id: 'consultation', title: 'Первичная консультация', color: '#f9b7b7' },
  { id: 'confirmed', title: 'Запись подтверждена', color: '#b5f5c9' },
];

function KanbanBoard({ user }) {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newDeal, setNewDeal] = useState({
    title: '',
    budget: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    companyName: '',
    companyAddress: ''
  });
  const [error, setError] = useState('');
  const sensors = useSensors(useSensor(PointerSensor));

  // Загрузка сделок
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

  // Добавление сделки
  const handleAddDeal = async (e) => {
    e.preventDefault();
    if (!newDeal.title.trim()) return;
    try {
      const res = await fetch('http://localhost:3001/api/deals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ ...newDeal, stage: 'new' })
      });
      const data = await res.json();
      if (data.success) {
        setDeals([data.deal, ...deals]);
        setNewDeal({
          title: '',
          budget: '',
          contactName: '',
          contactPhone: '',
          contactEmail: '',
          companyName: '',
          companyAddress: ''
        });
      } else {
        setError(data.message || 'Ошибка создания сделки');
      }
    } catch {
      setError('Ошибка соединения с сервером');
    }
  };

  // Drag & Drop
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const activeDealId = active.id;
    const overStageId = over.id;

    const draggedDeal = deals.find(d => d.id.toString() === activeDealId);
    if (!draggedDeal) return;

    // Если ничего не меняется
    if (draggedDeal.stage === overStageId) return;

    // Обновить локально
    setDeals(deals =>
      deals.map(d =>
        d.id === draggedDeal.id ? { ...d, stage: overStageId } : d
      )
    );
    // Обновить на сервере
    try {
      await fetch(`http://localhost:3001/api/deals/${activeDealId}/stage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({ stage: overStageId })
      });
    } catch (e) {
      setError('Ошибка обновления стадии');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ margin: '14px 0 28px 0', fontSize: 28, color: '#253a60' }}>Канбан-доска</h2>
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <div style={{ display: 'flex', gap: 26, alignItems: 'flex-start', overflowX: 'auto' }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {STAGES.map(stage => (
            <DroppableColumn
              key={stage.id}
              stage={stage}
              deals={deals.filter(d => d.stage === stage.id)}
              loading={loading}
              onAddDeal={handleAddDeal}
              newDeal={newDeal}
              setNewDeal={setNewDeal}
              user={user}
            />
          ))}
        </DndContext>
      </div>
      {loading && <div style={{ marginTop: 20 }}>Загрузка...</div>}
    </div>
  );
}

// Колонка (стадия)
function DroppableColumn({ stage, deals, loading, onAddDeal, newDeal, setNewDeal, user }) {
  const { setNodeRef } = useDroppable({ id: stage.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        minWidth: 330,
        background: '#fff',
        borderRadius: 15,
        boxShadow: '0 2px 12px 0 rgba(160,160,200,0.09)',
        padding: '18px 14px 18px 14px'
      }}
    >
      <div style={{
        fontWeight: 700, fontSize: 17,
        marginBottom: 12,
        color: '#334677',
        borderLeft: `5px solid ${stage.color}`,
        paddingLeft: 12
      }}>
        {stage.title}
      </div>
      {stage.id === 'new' && (
        <form onSubmit={onAddDeal} style={{ marginBottom: 18 }}>
          <input
            placeholder="Название"
            value={newDeal.title}
            onChange={e => setNewDeal({ ...newDeal, title: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Бюджет"
            value={newDeal.budget}
            onChange={e => setNewDeal({ ...newDeal, budget: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Контакт: Имя"
            value={newDeal.contactName}
            onChange={e => setNewDeal({ ...newDeal, contactName: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Контакт: Телефон"
            value={newDeal.contactPhone}
            onChange={e => setNewDeal({ ...newDeal, contactPhone: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Контакт: Email"
            value={newDeal.contactEmail}
            onChange={e => setNewDeal({ ...newDeal, contactEmail: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Компания: Название"
            value={newDeal.companyName}
            onChange={e => setNewDeal({ ...newDeal, companyName: e.target.value })}
            style={inputStyle}
          />
          <input
            placeholder="Компания: Адрес"
            value={newDeal.companyAddress}
            onChange={e => setNewDeal({ ...newDeal, companyAddress: e.target.value })}
            style={inputStyle}
          />
          <button
            type="submit"
            style={{
              background: 'linear-gradient(95deg, #5e90f6, #7bc3ee)',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 20px', fontWeight: 600, fontSize: 16,
              cursor: 'pointer'
            }}
          >Добавить</button>
        </form>
      )}
      {deals.map((deal) => (
        <DraggableCard key={deal.id} id={deal.id.toString()} deal={deal} />
      ))}
    </div>
  );
}

// Карточка сделки с переходом в деталку по клику
function DraggableCard({ id, deal }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { deal }
  });

  return (
    <div
      style={{
        background: isDragging ? '#eaf4fd' : '#f7f8fc',
        borderRadius: 11,
        boxShadow: isDragging ? '0 4px 16px 0 rgba(90,140,230,0.13)' : '0 1px 5px 0 rgba(100,120,160,0.07)',
        marginBottom: 12,
        padding: '13px 14px 10px 14px',
        minHeight: 60,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        transition: 'background 0.15s',
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined
      }}
    >
      {/* Drag handle слева */}
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={{
          width: 22,
          height: 22,
          marginRight: 12,
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none'
        }}
        title="Перетащить"
      >
        <span style={{ fontSize: 18, color: '#bbb' }}>≡</span>
      </div>
      {/* Основная кликабельная часть */}
      <Link
        to={`/deals/${deal.id}`}
        style={{ flex: 1, textDecoration: 'none', color: 'inherit' }}
      >
        <b style={{ fontSize: 16 }}>Сделка #{deal.id}</b><br />
        <span style={{ color: '#3b5283' }}>{deal.title}</span><br />
        <span style={{ fontSize: 15, color: '#7683a0' }}>{deal.budget}</span>
      </Link>
    </div>
  );
}

export default KanbanBoard;