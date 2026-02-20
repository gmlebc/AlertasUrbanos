import { useState } from 'react';
import { AlertsListPage } from './pages/AlertsListPage';
import { DashboardPage  } from './pages/DashboardPage';
import { useTheme } from './contexts/ThemeContext';
import { getColors } from './theme';

type Tab = 'alerts' | 'dashboard';

export default function App() {
  const [tab, setTab] = useState<Tab>('alerts');
  const { dark, toggle } = useTheme();
  const t = getColors(dark);

  const navItem = (id: Tab, label: string, icon: string) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '9px 18px', borderRadius: 8, border: 'none',
        background: tab === id ? t.navActive : 'transparent',
        color: tab === id ? t.navActiveColor : t.navColor,
        fontSize: 14, fontWeight: tab === id ? 700 : 500,
        cursor: 'pointer', transition: 'all 0.15s',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span> {label}
    </button>
  );

  return (
    <>
      {/* Global styles */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body {
          margin: 0;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: ${t.bg};
          color: ${t.text};
          -webkit-font-smoothing: antialiased;
          transition: background 0.2s, color 0.2s;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
        select, input, textarea, button { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${t.scrollbarTrack}; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollbarThumb}; border-radius: 3px; }
      `}</style>

      {/* Top Navbar */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: t.navBg, borderBottom: `1px solid ${t.border}`,
        boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.3)' : '0 1px 4px rgba(0,0,0,0.04)',
        transition: 'background 0.2s, border-color 0.2s',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          height: 58, display: 'flex', alignItems: 'center', gap: 20,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 16 }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 2px 8px rgba(220,38,38,0.35)',
            }}>🚨</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: t.text, lineHeight: 1.2 }}>
                Alertas Urbanos
              </div>
              <div style={{ fontSize: 10, color: t.textSubtle, lineHeight: 1 }}>
                Sistema de Monitoramento
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 4 }}>
            {navItem('alerts',    'Alertas',    '🗂️')}
            {navItem('dashboard', 'Dashboard',  '📊')}
          </nav>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: t.textSubtle }}>
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>

            {/* Dark mode toggle */}
            <button
              onClick={toggle}
              title={dark ? 'Modo claro' : 'Modo escuro'}
              style={{
                width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${t.border}`,
                background: t.surface, color: t.textMuted,
                fontSize: 17, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: t.text }}>
            {tab === 'alerts' ? '🗂️ Gerenciamento de Alertas' : '📊 Dashboard Estatístico'}
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: t.textMuted }}>
            {tab === 'alerts'
              ? 'Visualize, filtre e gerencie todas as ocorrências urbanas em tempo real.'
              : 'Análise e estatísticas consolidadas dos alertas registrados no sistema.'}
          </p>
        </div>

        {tab === 'alerts'    && <AlertsListPage />}
        {tab === 'dashboard' && <DashboardPage  />}
      </main>
    </>
  );
}
