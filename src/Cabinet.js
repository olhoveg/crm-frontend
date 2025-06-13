import React, { useState } from 'react';
import Profile from './Profile';

function Cabinet({ user, onLogout }) {
  const [tab, setTab] = useState('deals'); // По умолчанию "Сделки"

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <div style={styles.headerTitle}>CRM 24Balance</div>
        <div style={styles.headerRight}>
          <span style={styles.userName}>{user.login}</span>
          <button style={styles.logoutBtn} onClick={onLogout}>Выйти</button>
        </div>
      </header>
      <div style={styles.mainArea}>
        <nav style={styles.sidebar}>
          <button
            style={tab === 'deals' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => setTab('deals')}
          >
            Сделки
          </button>
          <button
            style={tab === 'profile' ? styles.sidebarBtnActive : styles.sidebarBtn}
            onClick={() => setTab('profile')}
          >
            Профиль специалиста
          </button>
        </nav>
        <main style={styles.content}>
          {tab === 'deals' && (
            <div>
              <h2 style={styles.title}>Сделки</h2>
              <ul style={styles.dealsList}>
                <li style={styles.dealCard}>
                  <b>Сделка №1</b>
                  <div>Статус: В работе</div>
                  <div>Сумма: 12 000 ₽</div>
                </li>
                <li style={styles.dealCard}>
                  <b>Сделка №2</b>
                  <div>Статус: Завершена</div>
                  <div>Сумма: 7 500 ₽</div>
                </li>
                <li style={styles.dealCard}>
                  <b>Сделка №3</b>
                  <div>Статус: Отменена</div>
                  <div>Сумма: 5 000 ₽</div>
                </li>
              </ul>
            </div>
          )}
          {tab === 'profile' && (
            <Profile user={user} />
          )}
        </main>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    minWidth: '100vw',
    background: 'linear-gradient(135deg, #dbe6e4 0%, #b8c6db 100%)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    height: 64,
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 36px',
    position: 'sticky',
    top: 0,
    zIndex: 10
  },
  headerTitle: {
    fontWeight: 700,
    fontSize: 22,
    color: '#223c70',
    letterSpacing: '1px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 18
  },
  userName: {
    fontWeight: 500,
    fontSize: 17,
    color: '#3b4e80'
  },
  logoutBtn: {
    border: 'none',
    borderRadius: 8,
    padding: '10px 16px',
    background: 'linear-gradient(90deg, #6a82fb 0%, #fc5c7d 100%)',
    color: '#fff',
    fontWeight: 600,
    fontSize: 15,
    cursor: 'pointer'
  },
  mainArea: {
    flex: 1,
    display: 'flex',
    minHeight: 0,
    minWidth: 0
  },
  sidebar: {
    width: 220,
    background: '#f4f6fb',
    boxShadow: '2px 0 8px rgba(90,100,150,0.04)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '34px 0 0 0'
  },
  sidebarBtn: {
    padding: '18px 24px',
    border: 'none',
    background: 'none',
    color: '#6571a3',
    fontSize: 17,
    fontWeight: 500,
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s'
  },
  sidebarBtnActive: {
    padding: '18px 24px',
    border: 'none',
    background: 'linear-gradient(90deg, #6a82fb10 0%, #fc5c7d10 100%)',
    color: '#3551b4',
    fontWeight: 700,
    fontSize: 17,
    textAlign: 'left',
    cursor: 'pointer'
  },
  content: {
    flex: 1,
    padding: '46px 48px',
    minWidth: 0
  },
  title: {
    color: '#14274e',
    fontWeight: 700,
    fontSize: 28,
    marginBottom: 22
  },
  profileField: {
    textAlign: 'left',
    background: '#f8fafc',
    borderRadius: 8,
    padding: '14px 20px',
    marginBottom: 16,
    fontSize: 18,
    color: '#14274e',
    boxShadow: '0 1px 4px rgba(100,120,180,0.04)'
  },
  dealsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  dealCard: {
    background: '#f8fafc',
    borderRadius: 8,
    padding: '17px 22px',
    marginBottom: 16,
    textAlign: 'left',
    fontSize: 18,
    boxShadow: '0 1px 7px rgba(100,120,180,0.07)'
  }
};

export default Cabinet;