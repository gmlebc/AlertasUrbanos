import { useEffect, useRef } from 'react';
import { useStats } from '../hooks/useStats';
import { TYPE_CONFIG } from '../components/AlertBadge';
import type { AlertType } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { getColors } from '../theme';
import {
  Chart,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
  DoughnutController, BarController,
} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, DoughnutController, BarController);

function DonutChart({ data, borderColor }: { data: { label: string; value: number; color: string }[]; borderColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels:   data.map(d => d.label),
        datasets: [{ data: data.map(d => d.value), backgroundColor: data.map(d => d.color), borderWidth: 2, borderColor, hoverOffset: 6 }],
      },
      options: {
        responsive: false, cutout: '58%',
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed} alerta(s)` } } },
      },
    });
    return () => { chartRef.current?.destroy(); };
  }, [data, borderColor]);

  return <canvas ref={canvasRef} width={180} height={180} />;
}

function BarChart({ data, gridColor, tickColor }: { data: { day: string; count: number }[]; gridColor: string; tickColor: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef  = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvasRef.current, {
      type: 'bar',
      data: {
        labels: data.map(d => new Date(d.day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
        datasets: [{ label: 'Alertas', data: data.map(d => d.count), backgroundColor: 'rgba(37,99,235,0.75)', borderColor: 'rgba(37,99,235,1)', borderWidth: 1, borderRadius: 4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => ` ${ctx.parsed.y} alerta(s)` } } },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 }, color: tickColor }, grid: { color: gridColor } },
          x: { ticks: { font: { size: 11 }, color: tickColor }, grid: { display: false } },
        },
      },
    });
    return () => { chartRef.current?.destroy(); };
  }, [data, gridColor, tickColor]);

  return <div style={{ position: 'relative', height: 140 }}><canvas ref={canvasRef} /></div>;
}

export function DashboardPage() {
  const { stats, loading, error } = useStats();
  const { dark } = useTheme();
  const t = getColors(dark);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${t.spinnerBg}`, borderTopColor: '#3b82f6', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (error) return <div style={{ background: t.errorBg, borderRadius: 10, padding: 16, color: t.errorText, border: `1px solid ${t.errorBorder}` }}>❌ Erro: {error}</div>;
  if (!stats) return null;

  const totalAtivos     = stats.byStatus.find(s => s.status === 'ativo')?.count     ?? 0;
  const totalResolvidos = stats.byStatus.find(s => s.status === 'resolvido')?.count ?? 0;
  const total           = totalAtivos + totalResolvidos;

  const donutData = stats.byType.map(d => ({
    label: TYPE_CONFIG[d.type as AlertType]?.label ?? d.type,
    value: d.count,
    color: dark
      ? (TYPE_CONFIG[d.type as AlertType]?.darkColor ?? '#94a3b8')
      : (TYPE_CONFIG[d.type as AlertType]?.color     ?? '#94a3b8'),
  }));

  const statCards = [
    { label: 'Total de Alertas', value: total,           color: '#2563eb', icon: '📋' },
    { label: 'Alertas Ativos',   value: totalAtivos,      color: '#dc2626', icon: '🔴' },
    { label: 'Resolvidos',       value: totalResolvidos,  color: '#16a34a', icon: '✅' },
    { label: 'Últimas 24h',      value: stats.recent24h,  color: '#d97706', icon: '⏰' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: t.surface, borderRadius: 12, padding: '20px 22px', border: `1px solid ${t.border}`, borderLeft: `4px solid ${s.color}`, transition: 'background 0.2s' }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: t.surface, borderRadius: 12, padding: 22, border: `1px solid ${t.border}`, transition: 'background 0.2s' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: t.headingColor }}>Alertas por Tipo</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <DonutChart data={donutData} borderColor={t.surface} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
              {donutData.map(d => (
                <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                  <span style={{ color: t.textSecondary, flex: 1 }}>{d.label}</span>
                  <span style={{ fontWeight: 700, color: t.text }}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ background: t.surface, borderRadius: 12, padding: 22, border: `1px solid ${t.border}`, transition: 'background 0.2s' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: t.headingColor }}>Alertas — Últimos 7 Dias</h3>
          {stats.timeline.length > 0
            ? <BarChart data={stats.timeline} gridColor={t.chartGrid} tickColor={t.chartText} />
            : <p style={{ color: t.textMuted, fontSize: 13 }}>Sem dados recentes.</p>
          }
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${t.divider}` }}>
            <h4 style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Por Status</h4>
            <div style={{ display: 'flex', gap: 16 }}>
              {stats.byStatus.map(s => (
                <div key={s.status} style={{
                  flex: 1, padding: '10px 14px', borderRadius: 8, textAlign: 'center',
                  background: s.status === 'ativo' ? t.statusAtivoBg : t.statusResolvidoBg,
                }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: s.status === 'ativo' ? t.statusAtivoText : t.statusResolvidoText }}>{s.count}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'capitalize' }}>{s.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
