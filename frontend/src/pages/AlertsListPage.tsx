import { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { AlertCard } from '../components/AlertCard';
import { AlertForm } from '../components/AlertForm';
import type { AlertFilters, AlertType, AlertStatus } from '../types';
import { TYPE_CONFIG } from '../components/AlertBadge';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../theme';

export function AlertsListPage() {
  const [filters, setFilters]     = useState<AlertFilters>({});
  const [showForm, setShowForm]   = useState(false);
  const { dark } = useTheme();
  const t = getColors(dark);

  const { alerts, loading, error, refetch, resolve, remove } = useAlerts(filters);

  const handleSuccess = () => {
    setShowForm(false);
    refetch();
  };

  const ativos    = alerts.filter(a => a.status === 'ativo').length;
  const resolvidos = alerts.filter(a => a.status === 'resolvido').length;

  const selectStyle = {
    padding: '6px 10px', borderRadius: 7, border: `1.5px solid ${t.inputBorder}`,
    fontSize: 12, background: t.inputBg, color: t.text, cursor: 'pointer',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Modal overlay for form */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 16,
        }}
        onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <AlertForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap',
        background: t.surface, borderRadius: 12, padding: '14px 18px',
        border: `1px solid ${t.border}`, transition: 'background 0.2s',
      }}>
        {/* Filter: Tipo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.labelColor }}>Tipo:</label>
          <select
            value={filters.type ?? ''}
            onChange={e => setFilters(p => ({ ...p, type: (e.target.value as AlertType) || undefined }))}
            style={selectStyle}
          >
            <option value="">Todos</option>
            {(Object.keys(TYPE_CONFIG) as AlertType[]).map(t => (
              <option key={t} value={t}>{TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}</option>
            ))}
          </select>
        </div>

        {/* Filter: Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.labelColor }}>Status:</label>
          <select
            value={filters.status ?? ''}
            onChange={e => setFilters(p => ({ ...p, status: (e.target.value as AlertStatus) || undefined }))}
            style={selectStyle}
          >
            <option value="">Todos</option>
            <option value="ativo">🟢 Ativo</option>
            <option value="resolvido">⚫ Resolvido</option>
          </select>
        </div>

        {/* Reset filters */}
        {(filters.type || filters.status) && (
          <button
            onClick={() => setFilters({})}
            style={{
              padding: '6px 12px', borderRadius: 7, border: `1.5px solid ${t.inputBorder}`,
              background: t.surface, fontSize: 12, color: t.textMuted, cursor: 'pointer',
            }}
          >✕ Limpar filtros</button>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Counters */}
          {!loading && (
            <div style={{ display: 'flex', gap: 8, fontSize: 12, color: t.textMuted }}>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>{ativos} ativos</span>
              <span>·</span>
              <span style={{ fontWeight: 600 }}>{resolvidos} resolvidos</span>
            </div>
          )}

          {/* New alert button */}
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#2563eb', color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            <span style={{ fontSize: 16 }}>+</span> Novo Alerta
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            border: `3px solid ${t.spinnerBg}`, borderTopColor: '#2563eb',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      ) : error ? (
        <div style={{
          background: t.errorBg, border: `1px solid ${t.errorBorder}`,
          borderRadius: 10, padding: 16, color: t.errorText, fontSize: 14,
        }}>
          ❌ Erro ao carregar alertas: {error}
          <br />
          <span style={{ fontSize: 12, color: t.errorSubtext }}>
            Verifique se a API está rodando em localhost:3001
          </span>
        </div>
      ) : alerts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: t.emptyBg, borderRadius: 12, border: `1px dashed ${t.emptyBorder}`,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏙️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: t.text }}>
            Nenhum alerta encontrado
          </div>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 4 }}>
            {filters.type || filters.status
              ? 'Tente remover os filtros aplicados.'
              : 'Clique em "+ Novo Alerta" para cadastrar a primeira ocorrência.'}
          </div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 16,
        }}>
          {alerts.map(a => (
            <AlertCard key={a.id} alert={a} onResolve={resolve} onDelete={remove} />
          ))}
        </div>
      )}
    </div>
  );
}
