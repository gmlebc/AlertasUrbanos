import { useState, useEffect, useCallback } from 'react';
import { alertApi } from '../services/api';
import type { Alert, AlertFilters } from '../types';

export function useAlerts(filters: AlertFilters = {}) {
  const [alerts, setAlerts]   = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await alertApi.getAll(filters);
      setAlerts(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filters.type, filters.status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetchAlerts(); }, [fetchAlerts]);

  const resolve = async (id: number) => {
    await alertApi.updateStatus(id, 'resolvido');
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolvido' as const } : a));
  };

  const remove = async (id: number) => {
    await alertApi.delete(id);
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return { alerts, loading, error, refetch: fetchAlerts, resolve, remove };
}
