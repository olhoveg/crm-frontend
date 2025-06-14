import { Outlet, Link, useLocation } from 'react-router-dom';

function CabinetLayout({ user, onLogout }) {
  const location = useLocation();
  const menuItems = [
    { to: '/', label: 'Профиль' },
    { to: '/deals', label: 'Сделки' },
    // Добавляй новые пункты меню здесь
  ];

  return (
    <div style={{ background: '#f4f7fb', minHeight: '100vh' }}>
      {/* Верхняя полоса */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#fff',
        borderBottom: '1px solid #e7ecf3',
        padding: '0 38px',
        minHeight: 66,
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 10px 0 rgba(130,140,180,0.07)'
      }}>
        <b style={{ fontSize: 23, color: '#22315b', letterSpacing: '.04em' }}>CRM Мои сервисы</b>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{
            color: '#607090',
            fontSize: 15,
            background: '#f7f7fa',
            borderRadius: 16,
            padding: '5px 16px',
            fontWeight: 500
          }}>{user.login}</span>
          <button style={{
            background: 'linear-gradient(95deg, #5e90f6, #7bc3ee)',
            color: '#fff',
            border: 'none',
            borderRadius: 7,
            padding: '9px 24px',
            fontWeight: 600,
            fontSize: 16,
            boxShadow: '0 1px 8px 0 rgba(60,120,220,0.06)',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }} onClick={onLogout}>Выйти</button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        {/* Боковое меню */}
        <aside style={{
          background: '#fff',
          padding: '38px 0 0 0',
          minWidth: 170,
          borderRight: '1px solid #e5e9f1',
          minHeight: 'calc(100vh - 66px)',
          boxShadow: '1px 0 8px 0 rgba(120,120,180,0.05)'
        }}>
          <nav>
            {menuItems.map(item => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  display: 'block',
                  padding: '13px 32px 13px 32px',
                  margin: '0 0 6px 0',
                  fontSize: 18,
                  fontWeight: 500,
                  color: location.pathname === item.to ? '#2151d1' : '#27304c',
                  background: location.pathname === item.to ? '#eaf2ff' : 'transparent',
                  borderRadius: location.pathname === item.to ? '0 24px 24px 0' : '0 24px 24px 0',
                  textDecoration: 'none',
                  transition: 'background .13s, color .13s'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        {/* Контент */}
        <main style={{ flex: 1, padding: '42px 5vw 60px 5vw', minHeight: 600 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default CabinetLayout;