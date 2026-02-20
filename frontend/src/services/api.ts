import type { Alert, AlertFilters, AlertStats, CreateAlertDTO, UpdateAlertDTO } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(json.message || `HTTP ${res.status}`);
  }
  return json.data as T;
}

export const alertApi = {
  getAll: (filters?: AlertFilters): Promise<Alert[]> => {
    const params = new URLSearchParams();
    if (filters?.type)   params.set('type',   filters.type);
    if (filters?.status) params.set('status', filters.status);
    const qs = params.toString();
    return request<Alert[]>(`/alertas${qs ? '?' + qs : ''}`);
  },

  getById: (id: number): Promise<Alert> =>
    request<Alert>(`/alertas/${id}`),

  getStats: (): Promise<AlertStats> =>
    request<AlertStats>('/alertas/estatisticas'),

  create: (data: CreateAlertDTO): Promise<Alert> =>
    request<Alert>('/alertas', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: number, data: UpdateAlertDTO): Promise<Alert> =>
    request<Alert>(`/alertas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  updateStatus: (id: number, status: 'ativo' | 'resolvido'): Promise<Alert> =>
    request<Alert>(`/alertas/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  delete: (id: number): Promise<void> =>
    request<void>(`/alertas/${id}`, { method: 'DELETE' }),
};
