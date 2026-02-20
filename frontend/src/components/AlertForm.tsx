import { useState, type FormEvent } from 'react';
import { alertApi } from '../services/api';
import type { AlertType, CreateAlertDTO } from '../types';
import { TYPE_CONFIG } from './AlertBadge';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../theme';

interface AlertFormProps {
  onSuccess: () => void;
  onCancel:  () => void;
}

const EMPTY: CreateAlertDTO = {
  title: '', description: '', type: 'outros', location: '',
  latitude: undefined, longitude: undefined,
};

export function AlertForm({ onSuccess, onCancel }: AlertFormProps) {
  const [form, setForm]       = useState<CreateAlertDTO>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors]   = useState<Partial<Record<keyof CreateAlertDTO, string>>>({});
  const { dark } = useTheme();
  const t = getColors(dark);

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.title.trim())       e.title       = 'Título é obrigatório.';
    if (!form.description.trim()) e.description = 'Descrição é obrigatória.';
    if (!form.location.trim())    e.location    = 'Local é obrigatório.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await alertApi.create(form);
      setForm(EMPTY);
      onSuccess();
    } catch (e) {
      setErrors({ title: (e as Error).message });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof CreateAlertDTO, value: string) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const inputStyle = (hasError: boolean) => ({
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1.5px solid ${hasError ? '#ef4444' : t.inputBorder}`,
    fontSize: 13, outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: 'inherit', background: t.inputBg, color: t.text,
    transition: 'border-color 0.15s',
  });

  const labelStyle = { fontSize: 12, fontWeight: 600, color: t.labelColor, marginBottom: 4, display: 'block' };
  const errStyle   = { fontSize: 11, color: '#ef4444', marginTop: 3 };

  return (
    <div style={{
      background: t.surface, borderRadius: 16, padding: 28,
      border: `1px solid ${t.border}`, maxWidth: 560, width: '100%',
      boxShadow: dark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.10)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: t.text }}>
          🆕 Novo Alerta
        </h2>
        <button onClick={onCancel} style={{
          background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: t.textSubtle,
        }}>✕</button>
      </div>

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Título */}
        <div>
          <label style={labelStyle}>Título *</label>
          <input
            value={form.title}
            onChange={e => field('title', e.target.value)}
            placeholder="Ex: Alagamento na Av. Central"
            style={inputStyle(!!errors.title)}
            onFocus={e => (e.target.style.borderColor = '#3b82f6')}
            onBlur={e  => (e.target.style.borderColor = errors.title ? '#ef4444' : t.inputBorder)}
          />
          {errors.title && <p style={errStyle}>{errors.title}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label style={labelStyle}>Tipo *</label>
          <select
            value={form.type}
            onChange={e => field('type', e.target.value)}
            style={{ ...inputStyle(false), cursor: 'pointer' }}
          >
            {(Object.keys(TYPE_CONFIG) as AlertType[]).map(t => (
              <option key={t} value={t}>{TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}</option>
            ))}
          </select>
        </div>

        {/* Descrição */}
        <div>
          <label style={labelStyle}>Descrição *</label>
          <textarea
            value={form.description}
            onChange={e => field('description', e.target.value)}
            placeholder="Descreva a ocorrência em detalhes..."
            rows={3}
            style={{ ...inputStyle(!!errors.description), resize: 'vertical' }}
            onFocus={e => (e.target.style.borderColor = '#3b82f6')}
            onBlur={e  => (e.target.style.borderColor = errors.description ? '#ef4444' : t.inputBorder)}
          />
          {errors.description && <p style={errStyle}>{errors.description}</p>}
        </div>

        {/* Local */}
        <div>
          <label style={labelStyle}>Local *</label>
          <input
            value={form.location}
            onChange={e => field('location', e.target.value)}
            placeholder="Ex: Rua XV de Novembro, 200 — São Paulo, SP"
            style={inputStyle(!!errors.location)}
            onFocus={e => (e.target.style.borderColor = '#3b82f6')}
            onBlur={e  => (e.target.style.borderColor = errors.location ? '#ef4444' : t.inputBorder)}
          />
          {errors.location && <p style={errStyle}>{errors.location}</p>}
        </div>

        {/* Coordenadas (opcionais) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={labelStyle}>Latitude (opcional)</label>
            <input
              type="number" step="0.000001"
              value={form.latitude ?? ''}
              onChange={e => setForm(p => ({ ...p, latitude: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="-23.5616"
              style={inputStyle(false)}
            />
          </div>
          <div>
            <label style={labelStyle}>Longitude (opcional)</label>
            <input
              type="number" step="0.000001"
              value={form.longitude ?? ''}
              onChange={e => setForm(p => ({ ...p, longitude: e.target.value ? parseFloat(e.target.value) : undefined }))}
              placeholder="-46.6560"
              style={inputStyle(false)}
            />
          </div>
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button
            type="submit" disabled={loading}
            style={{
              flex: 1, padding: '11px', borderRadius: 8, border: 'none',
              background: loading ? '#9ca3af' : '#2563eb',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: loading ? 'wait' : 'pointer', transition: 'background 0.15s',
            }}
          >
            {loading ? 'Cadastrando…' : '🚨 Cadastrar Alerta'}
          </button>
          <button
            type="button" onClick={onCancel}
            style={{
              padding: '11px 20px', borderRadius: 8,
              border: `1.5px solid ${t.cancelBorder}`, background: t.cancelBg,
              color: t.cancelColor, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
