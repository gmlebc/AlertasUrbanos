import { useState, useEffect } from 'react';
import { alertApi } from '../services/api';
import type { AlertStats } from '../types';

export function useStats() {
  const [stats, setStats]     = useState<AlertStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    alertApi.getStats()
      .then(data => { setStats(data); setLoading(false); })
      .catch(e  => { setError((e as Error).message); setLoading(false); });
  }, []);

  return { stats, loading, error };
}
