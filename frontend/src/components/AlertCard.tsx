import { useState } from 'react';
import type { Alert } from '../types';
import { TypeBadge, StatusBadge } from './AlertBadge';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../theme';

interface AlertCardProps {
  alert: Alert;
  onResolve: (id: number) => Promise<void>;
  onDelete:  (id: number) => Promise<void>;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(iso));
}

export function AlertCard({ alert, onResolve, onDelete }: AlertCardProps) {
  const [loadingResolve, setLoadingResolve] = useState(false);
  const [loadingDelete,  setLoadingDelete]  = useState(false);
  const [confirmDelete,  setConfirmDelete]  = useState(false);
  const { dark } = useTheme();
  const t = getColors(dark);

  const handleResolve = async () => {
    setLoadingResolve(true);
    try { await onResolve(alert.id); } finally { setLoadingResolve(false); }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setLoadingDelete(true);
    try { await onDelete(alert.id); } finally { setLoadingDelete(false); setConfirmDelete(false); }
  };

  const shadowHover = dark ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 20px rgba(0,0,0,0.08)';

  return (
    <div style={{
      background: t.surface,
      border: `1px solid ${t.border}`,
      borderRadius: 12,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s',
      cursor: 'default',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = shadowHover;
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
    }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: t.text, lineHeight: 1.4 }}>
          {alert.title}
        </h3>
        <StatusBadge status={alert.status} />
      </div>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <TypeBadge type={alert.type} />
      </div>

      {/* Description */}
      <p style={{ margin: 0, fontSize: 13, color: t.textSecondary, lineHeight: 1.6 }}>
        {alert.description}
      </p>

      {/* Meta */}
      <div style={{ display: 'flex', gap: 12, fontSize: 12, color: t.textSubtle }}>
        <span>📍 {alert.location}</span>
      </div>
      <div style={{ fontSize: 11, color: t.textSubtle }}>
        🕐 {formatDate(alert.created_at)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {alert.status === 'ativo' && (
          <button
            onClick={handleResolve}
            disabled={loadingResolve}
            style={{
              flex: 1, padding: '7px 12px', borderRadius: 8, border: 'none',
              background: '#16a34a', color: '#fff', fontSize: 12, fontWeight: 600,
              cursor: loadingResolve ? 'wait' : 'pointer', opacity: loadingResolve ? 0.7 : 1,
              transition: 'background 0.15s',
            }}
          >
            {loadingResolve ? 'Resolvendo…' : '✅ Marcar como Resolvido'}
          </button>
        )}
        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          style={{
            padding: '7px 12px', borderRadius: 8,
            border: confirmDelete ? '1.5px solid #dc2626' : `1.5px solid ${t.deleteBorder}`,
            background: confirmDelete ? t.deleteConfirmBg : t.deleteBg,
            color: confirmDelete ? '#dc2626' : t.deleteColor,
            fontSize: 12, fontWeight: 600,
            cursor: loadingDelete ? 'wait' : 'pointer', transition: 'all 0.15s',
          }}
        >
          {loadingDelete ? '…' : confirmDelete ? 'Confirmar exclusão' : '🗑️'}
        </button>
        {confirmDelete && (
          <button
            onClick={() => setConfirmDelete(false)}
            style={{
              padding: '7px 12px', borderRadius: 8, border: `1.5px solid ${t.deleteBorder}`,
              background: t.deleteBg, color: t.deleteColor, fontSize: 12, cursor: 'pointer',
            }}
          >✕</button>
        )}
      </div>
    </div>
  );
}
