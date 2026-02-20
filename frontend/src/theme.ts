const LIGHT = {
  /* backgrounds */
  bg:              '#f8fafc',
  surface:         '#ffffff',
  surfaceHover:    '#f9fafb',
  navBg:           '#ffffff',
  inputBg:         '#fafafa',
  emptyBg:         '#ffffff',
  /* borders */
  border:          '#000000',
  inputBorder:     '#d1d5db',
  emptyBorder:     '#d1d5db',
  divider:         '#f3f4f6',
  /* text */
  text:            '#111827',
  textSecondary:   '#4b5563',
  textMuted:       '#6b7280',
  textSubtle:      '#9ca3af',
  labelColor:      '#374151',
  headingColor:    '#374151',
  /* nav */
  navActive:       '#eff6ff',
  navActiveColor:  '#2563eb',
  navColor:        '#6b7280',
  /* status badges */
  statusAtivoBg:   '#dcfce7',
  statusAtivoText: '#166534',
  statusAtivoDot:  '#16a34a',
  statusAtivoPulse:'#86efac',
  statusResolvidoBg:   '#f3f4f6',
  statusResolvidoText: '#374151',
  statusResolvidoDot:  '#9ca3af',
  /* buttons */
  cancelBorder:    '#e5e7eb',
  cancelBg:        '#ffffff',
  cancelColor:     '#374151',
  deleteBorder:    '#e5e7eb',
  deleteBg:        '#ffffff',
  deleteColor:     '#6b7280',
  deleteConfirmBg: '#fee2e2',
  /* feedback */
  spinnerBg:       '#e5e7eb',
  errorBg:         '#fee2e2',
  errorBorder:     '#fca5a5',
  errorText:       '#dc2626',
  errorSubtext:    '#7f1d1d',
  /* charts */
  chartGrid:       '#f3f4f6',
  chartText:       '#6b7280',
  /* scrollbar */
  scrollbarTrack:  '#f1f5f9',
  scrollbarThumb:  '#cbd5e1',
};

const DARK = {
  /* backgrounds */
  bg:              '#0f172a',
  surface:         '#1e293b',
  surfaceHover:    '#263348',
  navBg:           '#1e293b',
  inputBg:         '#0f172a',
  emptyBg:         '#1e293b',
  /* borders */
  border:          '#334155',
  inputBorder:     '#475569',
  emptyBorder:     '#475569',
  divider:         '#1e293b',
  /* text */
  text:            '#f1f5f9',
  textSecondary:   '#cbd5e1',
  textMuted:       '#94a3b8',
  textSubtle:      '#64748b',
  labelColor:      '#94a3b8',
  headingColor:    '#94a3b8',
  /* nav */
  navActive:       '#1e3a5f',
  navActiveColor:  '#60a5fa',
  navColor:        '#94a3b8',
  /* status badges */
  statusAtivoBg:   '#14532d',
  statusAtivoText: '#86efac',
  statusAtivoDot:  '#22c55e',
  statusAtivoPulse:'#4ade80',
  statusResolvidoBg:   '#334155',
  statusResolvidoText: '#94a3b8',
  statusResolvidoDot:  '#64748b',
  /* buttons */
  cancelBorder:    '#475569',
  cancelBg:        '#1e293b',
  cancelColor:     '#cbd5e1',
  deleteBorder:    '#475569',
  deleteBg:        '#1e293b',
  deleteColor:     '#94a3b8',
  deleteConfirmBg: '#450a0a',
  /* feedback */
  spinnerBg:       '#334155',
  errorBg:         '#450a0a',
  errorBorder:     '#991b1b',
  errorText:       '#fca5a5',
  errorSubtext:    '#fca5a5',
  /* charts */
  chartGrid:       '#334155',
  chartText:       '#94a3b8',
  /* scrollbar */
  scrollbarTrack:  '#1e293b',
  scrollbarThumb:  '#475569',
};

export type ThemeColors = typeof LIGHT;

export function getColors(dark: boolean): ThemeColors {
  return dark ? DARK : LIGHT;
}
