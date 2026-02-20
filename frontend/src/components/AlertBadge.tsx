import type { AlertType, AlertStatus } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../theme';

interface TypeConfig {
  label: string;
  color: string;
  bg: string;
  darkColor: string;
  darkBg: string;
  icon: string;
}

export const TYPE_CONFIG: Record<AlertType, TypeConfig> = {
  enchente:      { label: 'Enchente',         color: '#1d87e5', bg: '#dbeafe', darkColor: '#60a5fa', darkBg: 'rgba(29,135,229,0.18)',  icon: '🌊' },
  deslizamento:  { label: 'Deslizamento',     color: '#92400e', bg: '#fef3c7', darkColor: '#fbbf24', darkBg: 'rgba(146,64,14,0.22)',   icon: '⛰️' },
  incendio:      { label: 'Incêndio',         color: '#dc2626', bg: '#fee2e2', darkColor: '#f87171', darkBg: 'rgba(220,38,38,0.20)',   icon: '🔥' },
  acidente:      { label: 'Acidente',         color: '#d97706', bg: '#fef3c7', darkColor: '#fbbf24', darkBg: 'rgba(217,119,6,0.20)',   icon: '🚗' },
  obra:          { label: 'Obra',             color: '#7c3aed', bg: '#ede9fe', darkColor: '#a78bfa', darkBg: 'rgba(124,58,237,0.22)',  icon: '🚧' },
  criminalidade: { label: 'Criminalidade',    color: '#0f172a', bg: '#f1f5f9', darkColor: '#94a3b8', darkBg: 'rgba(100,116,139,0.22)', icon: '🚨' },
  falta_energia: { label: 'Falta de Energia', color: '#b45309', bg: '#fffbeb', darkColor: '#fcd34d', darkBg: 'rgba(180,83,9,0.22)',    icon: '⚡' },
  outros:        { label: 'Outros',           color: '#475569', bg: '#f8fafc', darkColor: '#94a3b8', darkBg: 'rgba(71,85,105,0.22)',   icon: '📌' },
};

export function TypeBadge({ type }: { type: AlertType }) {
  const { dark } = useTheme();
  const c = TYPE_CONFIG[type];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      color:      dark ? c.darkColor : c.color,
      background: dark ? c.darkBg   : c.bg,
    }}>
      {c.icon} {c.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: AlertStatus }) {
  const { dark } = useTheme();
  const t = getColors(dark);
  const isAtivo = status === 'ativo';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 10px', borderRadius: 999,
      fontSize: 12, fontWeight: 600,
      color:      isAtivo ? t.statusAtivoText      : t.statusResolvidoText,
      background: isAtivo ? t.statusAtivoBg        : t.statusResolvidoBg,
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: isAtivo ? t.statusAtivoDot : t.statusResolvidoDot,
        display: 'inline-block',
        ...(isAtivo ? { boxShadow: `0 0 0 2px ${t.statusAtivoPulse}`, animation: 'pulse 2s infinite' } : {}),
      }} />
      {isAtivo ? 'Ativo' : 'Resolvido'}
    </span>
  );
}
